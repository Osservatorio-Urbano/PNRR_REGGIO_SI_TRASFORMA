const fs = require('fs');
const path = require('path');

const MEDIA_JSON_PATH = path.resolve('reggio-pnrr-public/src/data/project-media.json');
const PHOTOS_DIR = path.resolve('reggio-pnrr-public/public/photos');

const mediaList = JSON.parse(fs.readFileSync(MEDIA_JSON_PATH, 'utf8'));

// The 14 logo banner files to revert to placeholders:
const logoFiles = [
  // 1. Ministero dell'Interno banner (12 projects)
  'pnrr-m5c2-i2-1-piano-di-riqualificazione-urbana-qu.jpg',
  'pnrr-m2c4-i2-2-barriere-ponte-via-asseverati.jpg',
  'pnrr-m2c4-i2-2-barriere-ponte-via-marx.jpg',
  'pnrr-m2c4-i2-2-centro-internazionale-loris-malaguz.jpg',
  'pnrr-m2c4-i2-2-centro-internazionale-loris-malaguz-2.jpg',
  'pnrr-m2c4-i2-2-interventi-di-manutenzione-straordi.jpg',
  'pnrr-m2c4-i2-2-interventi-di-manutenzione-straordi-2.jpg',
  'pnrr-m2c4-i2-2-interventi-di-manutenzione-straordi-3.jpg',
  'pnrr-m2c4-i2-2-interventi-su-impianti-di-pubblica-.jpg',
  'pnrr-m2c4-i2-2-intervento-di-consolidamento-ponte-.jpg',
  'pnrr-m2c4-i2-2-lavori-di-efficientamento-energetic.jpg',
  'pnrr-m2c4-i2-2-lavori-di-messa-in-sicurezza-della-.jpg',
  // 2. Dipartimento per la trasformazione digitale banner (1 project)
  '1-7-2-digitale-facile-in-emilia-romagna-centri-di-.jpg',
  // 3. MIT - Ministero delle Infrastrutture e dei Trasporti banner (1 project)
  'pnrr-m5c2-i2-3-pinqua-economia-lavoro-e-innovazion.png'
];

let revertedCount = 0;

// Aggiorna mediaList
mediaList.forEach(item => {
  if (item.mainPhoto) {
    const filename = path.basename(item.mainPhoto);
    if (logoFiles.includes(filename)) {
      console.log(`Reverting project [${item.id}] from logo banner "${filename}" to placeholder`);
      item.mainPhoto = null;
      revertedCount++;
    }
  }
});

// Elimina i file dei loghi da public/photos/
logoFiles.forEach(file => {
  const fullPath = path.join(PHOTOS_DIR, file);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`Deleted file: ${file}`);
  }
});

fs.writeFileSync(MEDIA_JSON_PATH, JSON.stringify(mediaList, null, 2), 'utf8');
console.log(`\nOperazione completata con successo! ${revertedCount} progetti ripristinati al placeholder originale.`);
