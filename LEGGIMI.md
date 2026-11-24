# Studio Dentistico Euripide — sito one-page

Sito statico (HTML + CSS + JS vanilla, nessuna libreria). Si pubblica caricando l'intera cartella su qualsiasi hosting.

## Struttura
- `index.html` — il sito one-page
- `privacy.html` — informativa privacy e cookie policy (bozza da far verificare)
- `assets/css/style.css`, `assets/js/main.js`
- `assets/js/site-config.js` — **pannello dati** da compilare prima della pubblicazione
- `assets/img/` — logo, foto hero dello studio, ritratti del team, immagini dei servizi (480/800), favicon
- `assets/fonts/` — Playfair Display e Manrope ospitati in locale (nessuna chiamata a Google Fonts)
- `robots.txt`, `sitemap.xml`

## Da completare prima della pubblicazione
1. **site-config.js → legal**: P.IVA, ragione sociale, Direttore Sanitario, iscrizione all'Albo, autorizzazione sanitaria, PEC. I campi vuoti non compaiono sul sito.
2. **Dominio**: sostituire `DOMINIO-DEFINITIVO` in `robots.txt` e `sitemap.xml`, e de-commentare canonical / og:url in `index.html`.
3. **Modulo contatti**: il modulo è sempre visibile, ma invia le richieste solo quando `form.endpoint` è compilato con un servizio di inoltro (es. Formspree) collegato a un recapito email **autorizzato dallo studio**. Finché è vuoto, all'invio il modulo non simula nulla e invita a chiamare lo studio.
4. **Foto hero**: la foto fornita è 592×392 px; per una resa nitida su schermi grandi conviene sostituire `assets/img/hero-studio.webp` con l'originale ad alta risoluzione (almeno 1920 px di larghezza).
5. **Approvazione dello studio**: testi clinici, timeline "Come funziona" e informativa privacy.
6. **Recensioni**: la sezione "Cosa dicono di noi" è omessa (mancano recensioni autentiche con approvazione alla pubblicazione).

## Fotografie
La foto hero e i ritratti del team sono stati forniti dallo studio. Le immagini dei servizi sono fotografie illustrative da Unsplash (licenza Unsplash, uso commerciale gratuito); sono indicate come illustrative nel testo alternativo delle immagini. Non ritraggono lo studio né i suoi professionisti.

## Privacy
- Google Maps si carica solo dopo il clic su "Mostra la mappa".
- Nessun cookie di profilazione, nessun analytics: per questo non serve un banner cookie. Se in futuro si aggiungono analytics o pixel, va aggiunto un banner di consenso.
