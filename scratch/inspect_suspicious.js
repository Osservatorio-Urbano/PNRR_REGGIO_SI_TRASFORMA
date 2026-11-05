const fs = require('fs');
const path = require('path');

const projects = JSON.parse(fs.readFileSync('reggio-pnrr-public/src/data/projects-public.json', 'utf8'));
const media = JSON.parse(fs.readFileSync('reggio-pnrr-public/src/data/project-media.json', 'utf8'));
const projMap = new Map(projects.map(p => [p.id, p]));

const photosDir = 'reggio-pnrr-public/public/photos';
const files = fs.readdirSync(photosDir);

const results = [];
for (const file of files) {
  const p = path.join(photosDir, file);
  const size = fs.statSync(p).size;
  // find project id
  const idEntry = Object.entries(media).find(([k, v]) => v.mainPhoto && v.mainPhoto.endsWith(file));
  const id = idEntry ? idEntry[0] : null;
  const proj = id ? projMap.get(id) : null;
  
  results.push({
    file,
    size,
    projectId: id,
    title: proj ? proj.title : 'N/A',
    theme: proj ? proj.theme : 'N/A',
    url: proj ? proj.officialUrl : 'N/A'
  });
}

fs.writeFileSync('scratch/all_photos_details.json', JSON.stringify(results, null, 2));
console.log('Written to scratch/all_photos_details.json');
