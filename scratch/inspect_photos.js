const fs = require('fs');
const path = require('path');

const projects = JSON.parse(fs.readFileSync('reggio-pnrr-public/src/data/projects-public.json', 'utf8'));
const media = JSON.parse(fs.readFileSync('reggio-pnrr-public/src/data/project-media.json', 'utf8'));
const projMap = new Map(projects.map(p => [p.id, p]));

const photosDir = 'reggio-pnrr-public/public/photos';
const files = fs.readdirSync(photosDir);

const report = [];

for (const [id, m] of Object.entries(media)) {
  if (m.mainPhoto && m.mainPhoto.startsWith('./photos/')) {
    const filename = path.basename(m.mainPhoto);
    const fullPath = path.join(photosDir, filename);
    const size = fs.existsSync(fullPath) ? fs.statSync(fullPath).size : 0;
    const p = projMap.get(id) || {};
    report.push({
      id,
      filename,
      size,
      title: p.title,
      url: p.officialUrl || ''
    });
  }
}

fs.writeFileSync('scratch/photos_report.json', JSON.stringify(report, null, 2));
console.log('Report written to scratch/photos_report.json with', report.length, 'entries');
