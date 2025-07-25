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
  .then(data => { 
    artikelDaten = data; 
    console.log('Geladene Artikel:', artikelDaten);
    console.log('Anzahl Artikel:', artikelDaten.length);
  })
  .catch((error) => {
    console.error('Fehler beim Laden:', error);
    resultContainer.innerHTML = '<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Fehler beim Laden der Daten.</div>';
  });

// Suchfunktion
function sucheArtikel(query) {
  query = query.trim();
  console.log('Suche nach:', query);
  
  return artikelDaten.find(artikel => {
    const artikelnummer = artikel.artikelnummer ? artikel.artikelnummer.toString().toLowerCase().trim() : '';
    const ean = artikel.ean ? artikel.ean.toString().trim() : '';
    const udid = artikel.udid ? artikel.udid.toString().toLowerCase().trim() : '';
    
    console.log('Vergleiche mit:', { artikelnummer, ean, udid });
    
    // Vergleiche sowohl mit als auch ohne toLowerCase für Zahlen
    const queryLower = query.toLowerCase();
    const queryExact = query;
    
    return artikelnummer === queryLower || 
           ean === queryExact || 
           udid === queryLower;
  });
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
  
  // Bild-HTML erstellen (falls vorhanden)
  let bildHTML = '';
  if (artikel.bild && artikel.bild.trim() !== '') {
    bildHTML = `
      <div class="mb-4">
        <span class="font-bold">Produktbild:</span><br>
        <img src="${artikel.bild}" alt="Produktbild" 
             class="mt-2 max-w-xs rounded-lg shadow-md border border-gray-300"
             onerror="this.style.display='none'">
      </div>
    `;
  }

  resultContainer.innerHTML = `
    <div class="bg-green-100 border border-green-400 text-green-800 px-4 py-4 rounded shadow">
      <h2 class="text-xl font-bold mb-4 text-center">Konformitätserklärung</h2>
      <div class="mb-2"><span class="font-bold">Artikelname:</span> ${artikel.artikelname || 'N/A'}</div>
      <div class="mb-2"><span class="font-bold">Artikelnummer:</span> ${artikel.artikelnummer || 'N/A'}</div>
      <div class="mb-2"><span class="font-bold">EAN:</span> ${artikel.ean || 'N/A'}</div>
      <div class="mb-2"><span class="font-bold">UD-ID:</span> ${artikel.udid || 'N/A'}</div>
      <div class="mb-2"><span class="font-bold">Beschreibung:</span> ${artikel.beschreibung || 'N/A'}</div>
      ${bildHTML}
      ${pdfLinks ? `<div class="mb-4"><span class="font-bold">PDF-Links:</span><br>${pdfLinks}</div>` : ''}
      
      <div class="mt-6 pt-4 border-t border-green-300">
        <p class="text-sm leading-relaxed">
          Wir möchten Ihnen mitteilen, dass wir wichtige Informationen zur Konformitätserklärung zu diesem Produkt für Sie in einer PDF-Datei vorbereitet haben.
        </p>
        <p class="text-sm leading-relaxed mt-2">
          Um diese Informationen anzuzeigen und herunterzuladen, bitten wir Sie, die folgenden Schritte zu befolgen:
        </p>
        <ol class="text-sm leading-relaxed mt-2 ml-4 list-decimal">
          <li>Klicken Sie auf den unten stehenden Link, um die PDF-Datei in einem neuen Fenster zu öffnen.</li>
          <li>Stellen Sie sicher, dass Sie einen PDF-Viewer auf Ihrem Gerät installiert haben, um die Datei problemlos anzeigen zu können.</li>
        </ol>
        <p class="text-sm leading-relaxed mt-2">
          Falls Sie noch keinen PDF-Viewer installiert haben, können Sie einen kostenlosen PDF-Viewer wie Adobe Acrobat Reader oder Foxit Reader herunterladen und installieren.
        </p>
        <ol class="text-sm leading-relaxed mt-2 ml-4 list-decimal" start="3">
          <li>Sobald die PDF-Datei geöffnet ist, können Sie sie lesen, herunterladen oder ausdrucken, je nach Ihren individuellen Bedürfnissen.</li>
        </ol>
        <p class="text-sm leading-relaxed mt-2">
          Falls Sie Fragen oder Probleme beim Öffnen der PDF-Datei haben, stehen wir Ihnen jederzeit zur Verfügung.
        </p>
        <p class="text-sm leading-relaxed mt-2">
          Zögern Sie nicht, uns zu kontaktieren, und wir helfen Ihnen gerne weiter.
        </p>
        <p class="text-sm leading-relaxed mt-2 font-semibold">
          Vielen Dank für Ihr Verständnis und Ihre Aufmerksamkeit.
        </p>
        <p class="text-sm leading-relaxed mt-2 font-semibold">
          Ihr Team von Hatshats Handelsgesellschaft mbh
        </p>
      </div>
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