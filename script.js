// Suchelemente referenzieren
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultContainer = document.getElementById('resultContainer');

// Flaggen-Icons (SVG, inline)
const flags = {
  de: '<span title="Deutsch" class="inline-block align-middle mr-1">🇩🇪</span>',
  en: '<span title="Englisch" class="inline-block align-middle mr-1">🇬🇧</span>',
  fr: '<span title="Französisch" class="inline-block align-middle mr-1">🇫🇷</span>'
};

// Daten laden und Suchfunktion initialisieren
let artikelDaten = [];
fetch('https://script.google.com/macros/s/AKfycbwdef9UPveahEToexpEsAvJFP193wCDkKp2E0bzaPlw8q5vfLlgcRSL5DWti40mXiFV/exec')
  .then(res => res.json())
  .then(data => { artikelDaten = data; })
  .catch(() => {
    resultContainer.innerHTML = '<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Fehler beim Laden der Daten.</div>';
  });

// Suchfunktion
function sucheArtikel(query) {
  query = query.trim().toLowerCase();
  return artikelDaten.find(artikel =>
    (artikel.artikelnummer && artikel.artikelnummer.toString().toLowerCase() === query) ||
    (artikel.ean && artikel.ean.toString() === query) ||
    (artikel.udid && artikel.udid.toString().toLowerCase() === query)
  );
}

// Ergebnisanzeige
function zeigeErgebnis(artikel) {
  if (!artikel) {
    resultContainer.innerHTML = '<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded font-semibold">Kein passender Artikel gefunden.</div>';
    return;
  }
  let pdfLinks = '';
  
  // PDF-Links aus Google Sheets (direkte Felder)
  if (artikel.pdf_de) {
    pdfLinks += `<a href="${artikel.pdf_de}" target="_blank" class="inline-flex items-center mr-3 mb-2 text-blue-700 hover:underline">🇩🇪 DE PDF</a>`;
  }
  if (artikel.pdf_en) {
    pdfLinks += `<a href="${artikel.pdf_en}" target="_blank" class="inline-flex items-center mr-3 mb-2 text-blue-700 hover:underline">🇬🇧 EN PDF</a>`;
  }
  if (artikel.pdf_fr) {
    pdfLinks += `<a href="${artikel.pdf_fr}" target="_blank" class="inline-flex items-center mr-3 mb-2 text-blue-700 hover:underline">🇫🇷 FR PDF</a>`;
  }
  
  resultContainer.innerHTML = `
    <div class="bg-green-100 border border-green-400 text-green-800 px-4 py-4 rounded shadow">
      <div class="mb-2"><span class="font-bold">Artikelname:</span> ${artikel.artikelname || 'N/A'}</div>
      <div class="mb-2"><span class="font-bold">Artikelnummer:</span> ${artikel.artikelnummer || 'N/A'}</div>
      <div class="mb-2"><span class="font-bold">Beschreibung:</span> ${artikel.beschreibung || 'N/A'}</div>
      ${pdfLinks ? `<div class="mb-2"><span class="font-bold">PDF-Links:</span><br>${pdfLinks}</div>` : ''}
    </div>
  `;
}

// Event Listener
searchBtn.addEventListener('click', () => {
  const query = searchInput.value;
  const artikel = sucheArtikel(query);
  zeigeErgebnis(artikel);
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
}); 