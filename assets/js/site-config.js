/* =====================================================================
   PANNELLO DATI — STUDIO DENTISTICO EURIPIDE
   ---------------------------------------------------------------------
   Compilare SOLO con dati reali e confermati dallo studio, prima della
   pubblicazione. I campi lasciati vuoti ("") non vengono mostrati sul
   sito: nessun placeholder è visibile ai visitatori.
   ===================================================================== */
window.SITE_CONFIG = {

  /* Dominio definitivo, senza slash finale (es. "https://www.dominio.it").
     Usato per canonical e Open Graph. Aggiornare anche sitemap.xml e robots.txt. */
  domain: "",

  /* ---------- Informazioni professionali e legali (footer + privacy) ---------- */
  legal: {
    ragioneSociale: "",          // es. denominazione / ragione sociale
    partitaIva: "",              // P.IVA
    codiceFiscale: "",
    direttoreSanitario: "",      // nome e cognome del Direttore Sanitario
    iscrizioneAlbo: "",          // es. "Iscritto all'Albo degli Odontoiatri di … n. …"
    autorizzazioneSanitaria: "", // estremi dell'autorizzazione sanitaria
    pec: "",                     // PEC, se da pubblicare
    emailPrivacy: ""             // recapito per l'esercizio dei diritti privacy
  },

  /* ---------- Modulo contatti ----------
     Le richieste vengono inviate SOLO se è configurato un endpoint reale che
     le inoltri a un recapito autorizzato dallo studio
     (es. Formspree, Getform, Basin o uno script server dello studio).
     L'endpoint deve accettare POST JSON e rispondere 2xx in caso di successo.
     Finché è vuoto, il modulo non simula l'invio: all'invio invita a
     telefonare allo studio. */
  form: {
    endpoint: ""
  }
};
