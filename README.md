# NeuroBrain Nexus Web App

Pacchetto pronto per Netlify.

## Pubblicazione

1. Vai su Netlify.
2. Crea un nuovo sito e carica questo ZIP.
3. Build command: `npm run build`
4. Publish directory: `dist`

## Collegamento OpenAI

Su Netlify vai in:
Site configuration -> Environment variables

Aggiungi:
OPENAI_API_KEY = la tua chiave OpenAI

Non mettere mai la chiave dentro il codice pubblico.

## Incluso

- Volto AI
- Carica il mio volto
- Modalità Casentino Shopping AI
- Endpoint `/api/chat`
- Fallback demo se l'API non è collegata
