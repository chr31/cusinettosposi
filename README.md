# Cusinettosposi – Sito matrimonio (Next.js)

Un semplice sito in Next.js con:
- Countdown con slideshow di foto in background (fade)
- Agenda della giornata
- Modulo RSVP con salvataggio su file locale
- Lista nozze con IBAN e pulsante copia

## Avvio

1. Copia `.env.local.example` in `.env.local` e personalizza i valori.
2. Installa le dipendenze:

```bash
npm install
```

3. Avvia in sviluppo:

```bash
npm run dev
```

4. Apri `http://localhost:3000`.

## Foto dello slideshow

Sostituisci/aggiungi le tue foto in `public/photos/` e aggiorna la lista `IMAGES` in `src/app/page.tsx` se necessario.

## RSVP – Storage

Gli invii vengono salvati in `data/rsvps.json`. In ambienti serverless (es. Vercel) la scrittura su disco non è persistente: per la produzione conviene usare un DB o un servizio (es. Supabase, Google Sheets, Airtable). Posso integrare un backend a tua scelta.

## Build

```bash
npm run build
npm start
```

## Personalizzazioni rapide

- Data: `NEXT_PUBLIC_WEDDING_DATE` in `.env.local`
- IBAN: `NEXT_PUBLIC_IBAN` in `.env.local`
- Nomi: `NEXT_PUBLIC_COUPLE_NAMES` in `.env.local`

## Note

Questo progetto usa Next.js App Router, TypeScript e Tailwind CSS.

