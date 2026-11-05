const fs = require('fs');
const path = require('path');

const dir = 'reggio-pnrr-public/public/photos';
const files = fs.readdirSync(dir);

// For JPEG and PNG, extract width and height
function getDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
    // PNG
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    return { type: 'png', width, height };
  } else if (buf[0] === 0xFF && buf[1] === 0xD8) {
    // JPEG
    let offset = 2;
    while (offset < buf.length) {
      if (buf[offset] !== 0xFF) break;
      const marker = buf[offset + 1];
      if (marker === 0xC0 || marker === 0xC2) {
        const height = buf.readUInt16BE(offset + 5);
        const width = buf.readUInt16BE(offset + 7);
        return { type: 'jpg', width, height };
      }
      const len = buf.readUInt16BE(offset + 2);
      offset += 2 + len;
    }
  }
  return { type: 'unknown', width: 0, height: 0 };
}

const list = files.map(f => {
  const p = path.join(dir, f);
  const size = fs.statSync(p).size;
  const dim = getDimensions(p);
  return {
    file: f,
    size,
    width: dim.width,
    height: dim.height,
    aspect: dim.width && dim.height ? (dim.width / dim.height).toFixed(2) : 'N/A'
  };
});

list.sort((a, b) => a.size - b.size);
fs.writeFileSync('scratch/photos_dimensions.json', JSON.stringify(list, null, 2));
console.log('Saved dimensions for', list.length, 'photos');
