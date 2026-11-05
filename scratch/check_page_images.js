async function test() {
  const r = await fetch('https://www.comune.reggioemilia.it/argomenti/attuazione-misure-pnrr/missione-5/pnrr-m5c2-i1-3-realizzazione-di-centri-servizi-per-persone-di-marginalita-anche-estrema-e-senza-dimora-presso-l2019immobile-sito-in-via-kennedy-n-15-17');
  const html = await r.text();
  const re = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    console.log('IMG:', m[1]);
  }
}
test();
