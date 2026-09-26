# renderAgent-Fe

Frontend di RenderAgent: un'intervista con un'interior designer virtuale costruisce il "Design DNA" dell'utente e genera il render della stanza con i materiali del magazzino.

Stack: Vite + React + Tailwind CSS v4 + lucide-react.

## Avvio

```bash
npm install
cp .env.example .env   # URL del backend (default http://localhost:3000)
npm run dev            # http://localhost:5173
```

Il backend (`renderAgent-Be`) deve essere avviato e avere `http://localhost:5173` in `ALLOWED_ORIGINS`.

## Schermate

| Route | Schermata |
|---|---|
| `#/` | Landing |
| `#/intervista` | Chat con fasi, risposte visuali (card, chip, palette) e pannello Design DNA |
| `#/progetto/<id>` | Risultato: render e varianti, identikit, scelte per area, prodotti di magazzino, modifiche, PDF, preventivo. Il link è condivisibile |

## Struttura

| Percorso | Contenuto |
|---|---|
| `src/App.jsx` | Stato dell'intervista, routing, render e modifiche |
| `src/components/` | Landing, Experience, OptionPicker, DnaPanel, Result, ui |
| `src/lib/api.js` | Client del backend |
| `src/index.css` | Design token (chiaro/scuro), utility di brand, stili di stampa |
| `legacy/index.html` | Versione precedente, conservata come riferimento |
