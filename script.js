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
    resultContainer.innerHTML = `
      <div class="bg-white border-2 border-red-200 rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <h3 class="text-xl font-bold text-white text-center">Artikel nicht gefunden</h3>
        </div>
        <div class="p-6 text-center">
          <svg class="w-16 h-16 mx-auto text-red-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <p class="text-gray-600 mb-4">Kein passender Artikel mit der eingegebenen Artikelnummer, EAN oder UD-ID gefunden.</p>
          <div class="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p class="font-semibold mb-2">Bitte überprüfen Sie:</p>
            <ul class="text-left space-y-1">
              <li>• Die Artikelnummer ist korrekt eingegeben</li>
              <li>• Die EAN-Nummer ist vollständig</li>
              <li>• Die UD-ID ist richtig geschrieben</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    return;
  }
  let pdfLinks = '';
  
  // PDF-Links aus Google Sheets (direkte Felder)
  if (artikel.pdf_de) {
    pdfLinks += `<a href="${artikel.pdf_de}" target="_blank" class="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium">
      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 18h12a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
      🇩🇪 DE PDF
    </a>`;
  }
  if (artikel.pdf_en) {
    pdfLinks += `<a href="${artikel.pdf_en}" target="_blank" class="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium">
      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 18h12a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
      🇬🇧 EN PDF
    </a>`;
  }
  if (artikel.pdf_fr) {
    pdfLinks += `<a href="${artikel.pdf_fr}" target="_blank" class="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium">
      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 18h12a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
      🇫🇷 FR PDF
    </a>`;
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
    <div class="bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
      <!-- Header mit Brandfarbe -->
      <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
        <h2 class="text-2xl font-bold text-white text-center">Konformitätserklärung</h2>
        <p class="text-orange-100 text-center text-sm mt-1">EU-Konformitätsdokumentation</p>
      </div>
      
      <!-- Produktbild (falls vorhanden) -->
      ${bildHTML ? `
        <div class="p-6 pb-0">
          <div class="flex justify-center">
            <img src="${artikel.bild}" alt="Produktbild" 
                 class="max-w-xs rounded-lg shadow-md border-2 border-gray-100"
                 onerror="this.style.display='none'">
          </div>
        </div>
      ` : ''}
      
      <!-- Produktdaten -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-bold text-gray-700 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Produktinformationen
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="font-semibold text-gray-600">Artikelname:</span>
                <span class="text-gray-800">${artikel.artikelname || 'N/A'}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold text-gray-600">Artikelnummer:</span>
                <span class="text-gray-800 font-mono">${artikel.artikelnummer || 'N/A'}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold text-gray-600">EAN:</span>
                <span class="text-gray-800 font-mono">${artikel.ean || 'N/A'}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold text-gray-600">UD-ID:</span>
                <span class="text-gray-800 font-mono">${artikel.udid || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-bold text-gray-700 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 18h12a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Beschreibung
            </h3>
            <p class="text-sm text-gray-700 leading-relaxed">${artikel.beschreibung || 'Keine Beschreibung verfügbar'}</p>
          </div>
        </div>
        
        <!-- PDF-Links -->
        ${pdfLinks ? `
          <div class="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 class="font-bold text-gray-700 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 18h12a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Konformitätserklärungen (PDF)
            </h3>
            <div class="flex flex-wrap gap-2">
              ${pdfLinks}
            </div>
          </div>
        ` : ''}
      </div>
      
      <!-- Hilfetext -->
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
        <div class="max-w-none">
          <h4 class="font-bold text-gray-700 mb-3 flex items-center">
            <svg class="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
            </svg>
            Anleitung zum Öffnen der PDF-Dateien
          </h4>
          <div class="text-sm text-gray-600 space-y-3">
            <p>Wir möchten Ihnen mitteilen, dass wir wichtige Informationen zur Konformitätserklärung zu diesem Produkt für Sie in einer PDF-Datei vorbereitet haben.</p>
            <p>Um diese Informationen anzuzeigen und herunterzuladen, bitten wir Sie, die folgenden Schritte zu befolgen:</p>
            <ol class="ml-4 list-decimal space-y-1">
              <li>Klicken Sie auf den oben stehenden Link, um die PDF-Datei in einem neuen Fenster zu öffnen.</li>
              <li>Stellen Sie sicher, dass Sie einen PDF-Viewer auf Ihrem Gerät installiert haben, um die Datei problemlos anzeigen zu können.</li>
            </ol>
            <p>Falls Sie noch keinen PDF-Viewer installiert haben, können Sie einen kostenlosen PDF-Viewer wie Adobe Acrobat Reader oder Foxit Reader herunterladen und installieren.</p>
            <ol class="ml-4 list-decimal space-y-1" start="3">
              <li>Sobald die PDF-Datei geöffnet ist, können Sie sie lesen, herunterladen oder ausdrucken, je nach Ihren individuellen Bedürfnissen.</li>
            </ol>
            <p>Falls Sie Fragen oder Probleme beim Öffnen der PDF-Datei haben, stehen wir Ihnen jederzeit zur Verfügung.</p>
            <p>Zögern Sie nicht, uns zu kontaktieren, und wir helfen Ihnen gerne weiter.</p>
            <div class="mt-4 pt-3 border-t border-gray-200">
              <p class="font-semibold text-gray-700">Vielen Dank für Ihr Verständnis und Ihre Aufmerksamkeit.</p>
              <p class="font-semibold text-gray-700">Ihr Team von Hatshats Handelsgesellschaft mbh</p>
            </div>
          </div>
        </div>
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