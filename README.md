# Konformitätserklärungs-Konfigurator

## Projektbeschreibung
Ein responsiver Web-Konfigurator (HTML, TailwindCSS, JavaScript), mit dem Kunden durch Eingabe einer Artikelnummer, EAN oder UD-ID die passende Konformitätserklärung (PDF-Download) und Produktbeschreibung angezeigt bekommen.

## Nutzung
1. Projekt entpacken oder auf Webspace/Netlify/GitHub Pages hochladen
2. Im Browser `index.html` öffnen
3. Suche nach Artikelnummer, EAN oder UD-ID nutzen

## Datenpflege (`data.json`)
- Die Datei `data.json` enthält alle Artikel als Array von Objekten.
- Jeder Artikel hat folgende Felder:
  - `artikelnummer` (z.B. "HAT12345")
  - `ean` (z.B. "1234567890123")
  - `udid` (z.B. "UD001")
  - `beschreibung` (Kurzbeschreibung)
  - `pdfs` (Objekt mit Sprachkürzeln als Schlüssel und PDF-Pfaden als Wert)

**Beispiel:**
```json
{
  "artikelnummer": "HAT12345",
  "ean": "1234567890123",
  "udid": "UD001",
  "beschreibung": "Warmer Winterhandschuh mit Fleece",
  "pdfs": {
    "de": "/pdf/DE_KonformitaetserklaerungHAT12345.pdf",
    "en": "/pdf/EN_KonformitaetserklaerungHAT12345.pdf",
    "fr": "/pdf/FR_KonformitaetserklaerungHAT12345.pdf"
  }
}
```
- Weitere Sprachen können einfach ergänzt werden (z.B. `it`, `es` usw.).
- Neue Artikel werden als neues Objekt im Array hinzugefügt.

## PDF-Dateien
- Die PDF-Dateien liegen im Ordner `/pdf/`.
- Die Dateinamen müssen mit den Pfaden in `data.json` übereinstimmen.
- Für neue Artikel/Sprachen einfach neue PDFs im Ordner ablegen.

## Einbindung per iframe (z.B. in WordPress)
```html
<iframe src="https://deine-domain.de/konfigurator/index.html" width="100%" height="600" style="border:none;"></iframe>
```
- Die Höhe kann je nach Bedarf angepasst werden.

## Anpassung
- Farben und Design können in `index.html` (Tailwind-Klassen) angepasst werden.
- Schriftarten: Standard ist Open Sans (Text) und Montserrat (Überschriften) via Google Fonts.

## Support
Bei Fragen oder Erweiterungswünschen gerne melden! 