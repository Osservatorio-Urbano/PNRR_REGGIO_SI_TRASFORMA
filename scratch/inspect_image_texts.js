const fs = require('fs');
const path = require('path');

const dir = 'reggio-pnrr-public/public/photos';
const files = fs.readdirSync(dir);

const keywords = ['ministero', 'dipartimento', 'governo', 'regione', 'italia domani', 'mit', 'trasformazione', 'banner', 'logo'];

const results = [];

for (const file of files) {
  const p = path.join(dir, file);
  const buf = fs.readFileSync(p);
  const text = buf.toString('latin1').toLowerCase();
  
  const matched = [];
  keywords.forEach(kw => {
    if (text.includes(kw)) matched.push(kw);
  });

  results.push({
    file,
    size: buf.length,
    matched
  });
}

fs.writeFileSync('scratch/photos_text_scan.json', JSON.stringify(results, null, 2));
console.log('Saved photos text scan');
