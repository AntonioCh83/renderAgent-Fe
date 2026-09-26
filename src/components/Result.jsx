import { useEffect, useMemo, useState } from 'react';
import {
  Check, Download, ExternalLink, ImageOff, Link as LinkIcon, Mail, Plus, RefreshCw, TriangleAlert, WandSparkles
} from 'lucide-react';
import { assetUrl, safeUrl } from '../lib/api.js';
import { FURNITURE_MODE_LABELS, TAG_COLORS } from '../lib/phases.js';
import { BrandMark, Button, Eyebrow, SwatchStrip } from './ui.jsx';

const RENDER_STEPS = [
  'Misuro la stanza…', 'Poso il pavimento…', 'Applico i rivestimenti…',
  'Posiziono gli arredi…', 'Regolo la luce naturale…', 'Ultimi ritocchi…'
];

const CATEGORY_LABELS = {
  pavimento: 'Pavimenti', rivestimento: 'Rivestimenti', mobili: 'Arredo', sanitari: 'Sanitari',
  illuminazione: 'Illuminazione', complementi: 'Complementi'
};

const REFINE_SUGGESTIONS = ['Pavimento più scuro', 'Più luce naturale', 'Aggiungi qualche pianta', 'Stile più minimal', 'Colori più caldi'];

const priceFormat = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

// ---------- Render ----------

function RenderProgress() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % RENDER_STEPS.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 grid place-items-center bg-surface-2/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-gradient grid size-14 place-items-center rounded-2xl text-white shadow-lift">
          <WandSparkles className="size-6 animate-pulse" />
        </span>
        <p key={step} className="font-display text-xl font-semibold animate-rise">{RENDER_STEPS[step]}</p>
        <p className="text-sm text-muted">Il render richiede circa 10-20 secondi</p>
      </div>
    </div>
  );
}

function RenderViewer({ renders, render, onRender, title }) {
  const ordered = useMemo(() => [...renders].reverse(), [renders]);
  const [selected, setSelected] = useState(0);
  useEffect(() => setSelected(0), [renders.length]);

  const current = ordered[selected];
  const loading = render.status === 'loading';

  return (
    <div className="print-break">
      <div className="relative aspect-[3/2] overflow-hidden rounded-[28px] border border-line bg-surface-2 shadow-lift">
        {current ? (
          <img src={assetUrl(current.url)} alt={`Render: ${title}`} className="size-full object-cover animate-rise" key={current.url} />
        ) : (
          <div className="skeleton size-full" />
        )}
        {loading && <RenderProgress />}
        {!loading && render.status === 'error' && (
          <div className="absolute inset-0 grid place-items-center bg-surface/80 p-6 backdrop-blur-sm">
            <div className="max-w-sm text-center">
              <ImageOff className="mx-auto size-8 text-muted" />
              <p className="mt-3 font-semibold">Non siamo riusciti a generare il render</p>
              <p className="mt-1 text-sm text-muted">{render.error}</p>
              <Button className="mt-4" size="sm" icon={RefreshCw} onClick={onRender}>Riprova</Button>
            </div>
          </div>
        )}
      </div>

      <div className="no-print mt-3 flex items-center gap-2.5">
        <div className="scroll-thin flex flex-1 gap-2 overflow-x-auto pb-1">
          {ordered.map((r, i) => (
            <button
              key={r.url}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative aspect-[3/2] h-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${i === selected ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'}`}
              aria-label={`Variante ${ordered.length - i}`}
            >
              <img src={assetUrl(r.url)} alt="" className="size-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
        <Button variant="secondary" size="sm" icon={RefreshCw} loading={loading} onClick={onRender}>
          Nuove varianti
        </Button>
      </div>
    </div>
  );
}

// ---------- Identikit ----------

function Identikit({ design }) {
  const { final, profile } = design;
  return (
    <div className="print-break rounded-[28px] border border-line bg-surface p-6 shadow-soft">
      <Eyebrow>Il tuo identikit</Eyebrow>
      <p className="text-gradient mt-2 font-display text-3xl font-semibold leading-tight">{final.archetype}</p>
      <p className="mt-3 leading-relaxed text-muted">{final.summary}</p>

      <div className="mt-5 grid grid-cols-5 gap-2">
        {final.palette.map(c => (
          <div key={c.hex} className="min-w-0">
            <div className="aspect-square rounded-2xl border border-black/5 shadow-soft" style={{ background: c.hex }} />
            <p className="mt-1.5 truncate text-[11px] font-medium" title={c.name}>{c.name}</p>
            <p className="text-[10px] uppercase text-muted">{c.hex}</p>
          </div>
        ))}
      </div>

      {profile.keywords.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {profile.keywords.map((k, i) => {
            const color = TAG_COLORS[i % TAG_COLORS.length];
            return (
              <span key={k} className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ color, background: `color-mix(in srgb, ${color} 14%, transparent)` }}>
                {k}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------- Prodotti ----------

function ProductCard({ product, color }) {
  const url = safeUrl(product.url);
  const lowStock = Number(product.giacenza) < 10;
  return (
    <article className="print-break flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative h-32" style={{ background: `linear-gradient(135deg, ${product.colore_hex || '#e7e0d6'}, color-mix(in srgb, ${product.colore_hex || '#e7e0d6'} 70%, #000))` }}>
        {safeUrl(product.immagine) && <img src={product.immagine} alt="" className="size-full object-cover" loading="lazy" />}
        <span className="absolute left-3 top-3 rounded-full bg-black/35 px-2.5 py-1 font-mono text-[11px] font-medium text-white backdrop-blur">{product.id}</span>
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-black backdrop-blur">
          <span className="size-1.5 rounded-full" style={{ background: color }} />
          {CATEGORY_LABELS[product.categoria] ?? product.categoria}
        </span>
        <span className={`absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${lowStock ? 'bg-[#e0a23b]/90 text-black' : 'bg-white/85 text-[#2f7a55]'}`}>
          {lowStock ? 'Ultimi pezzi' : <><Check className="size-3" strokeWidth={3} /> Disponibile</>}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold leading-snug">{product.nome}</h3>
        <p className="mt-1 text-xs text-muted">{[product.finitura, product.formato].filter(Boolean).join(' · ')}</p>
        {product.reason && <p className="mt-3 border-l-2 border-accent/60 pl-3 text-sm italic leading-snug text-muted">{product.reason}</p>}
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            {product.prezzo != null && (
              <p className="font-display text-lg font-semibold">
                {priceFormat.format(product.prezzo)}
                <span className="ml-1 font-sans text-xs font-normal text-muted">{product.unita?.replace('€', '')}</span>
              </p>
            )}
            {product.fornitore && <p className="text-[11px] text-muted">{product.fornitore}</p>}
          </div>
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="no-print inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
              Scheda <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function ProductGrid({ products }) {
  // Un'unica griglia ordinata per categoria: il colore del badge identifica la categoria
  const { sorted, colorOf } = useMemo(() => {
    const categories = [...new Set(products.map(p => p.categoria))];
    return {
      sorted: [...products].sort((a, b) => categories.indexOf(a.categoria) - categories.indexOf(b.categoria)),
      colorOf: cat => TAG_COLORS[categories.indexOf(cat) % TAG_COLORS.length]
    };
  }, [products]);

  if (!products.length) {
    return <p className="rounded-3xl border border-dashed border-line p-6 text-center text-sm text-muted">Nessun prodotto di magazzino associato a questo progetto.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {sorted.map(p => <ProductCard key={p.id} product={p} color={colorOf(p.categoria)} />)}
    </div>
  );
}

// ---------- Modifica ----------

function RefineBox({ refine, onRefine, busy }) {
  const [text, setText] = useState('');
  const loading = refine.status === 'loading';
  const submit = value => {
    const clean = value.trim();
    if (!clean || loading || busy) return;
    onRefine(clean);
    setText('');
  };

  return (
    <div className="no-print rounded-[28px] bg-accent-gradient p-[1.5px] shadow-soft">
      <div className="rounded-[26.5px] bg-surface p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <WandSparkles className="size-5 text-accent" />
          <h2 className="font-display text-xl font-semibold">Vuoi cambiare qualcosa?</h2>
        </div>
        <p className="mt-1 text-sm text-muted">Descrivi la modifica: aggiorno materiali, prodotti e render.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {REFINE_SUGGESTIONS.map(s => (
            <button
              key={s}
              type="button"
              disabled={loading || busy}
              onClick={() => submit(s)}
              className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium transition hover:border-ink/30 disabled:opacity-50"
            >
              <Plus className="size-3" /> {s}
            </button>
          ))}
        </div>

        <form onSubmit={e => { e.preventDefault(); submit(text); }} className="mt-4 flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={500}
            placeholder="Es. vorrei un pavimento in legno a spina di pesce"
            className="h-11 min-w-0 flex-1 rounded-full border border-line bg-canvas px-4 text-sm outline-none transition focus:border-ink/30"
            aria-label="Modifica richiesta"
          />
          <Button type="submit" loading={loading} disabled={busy || !text.trim()}>Applica</Button>
        </form>

        {refine.message && <p className="mt-3 flex items-start gap-2 text-sm text-[#2f7a55] animate-rise"><Check className="mt-0.5 size-4 shrink-0" /> {refine.message}</p>}
        {refine.status === 'error' && <p className="mt-3 flex items-start gap-2 text-sm text-[#d9482b]" role="alert"><TriangleAlert className="mt-0.5 size-4 shrink-0" /> {refine.error}</p>}
      </div>
    </div>
  );
}

// ---------- Pagina ----------

function quoteMailto(brand, design) {
  const lines = design.products.map(p => `- ${p.id} · ${p.nome}`).join('\n');
  const body = `Buongiorno,\nvorrei ricevere un preventivo per il progetto "${design.final.title}".\n\nProdotti selezionati:\n${lines}\n\nLink al progetto: ${window.location.href}\n\nGrazie`;
  return `mailto:${brand.contactEmail}?subject=${encodeURIComponent(`Richiesta preventivo · ${design.final.title}`)}&body=${encodeURIComponent(body)}`;
}

function ResultSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.55fr_1fr]">
      <div className="skeleton aspect-[3/2] rounded-[28px]" />
      <div className="space-y-4">
        <div className="skeleton h-8 w-2/3 rounded-full" />
        <div className="skeleton h-40 rounded-[28px]" />
        <div className="skeleton h-24 rounded-[28px]" />
      </div>
    </div>
  );
}

export default function Result({ brand, design, loadError, render, refine, onRender, onRefine, onNewProject }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copia il link del progetto:', window.location.href);
    }
  };

  return (
    <div className="bg-glow min-h-dvh">
      <header className="no-print sticky top-0 z-10 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a href="#/" aria-label="Torna alla home"><BrandMark brand={brand} /></a>
          <Button variant="secondary" size="sm" icon={Plus} onClick={onNewProject}>
            <span className="max-sm:hidden">Nuovo progetto</span>
          </Button>
        </div>
      </header>

      {loadError ? (
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <ImageOff className="mx-auto size-10 text-muted" />
          <h1 className="mt-4 font-display text-2xl font-semibold">Progetto non disponibile</h1>
          <p className="mt-2 text-muted">{loadError}</p>
          <Button className="mt-6" onClick={onNewProject}>Crea un nuovo progetto</Button>
        </div>
      ) : !design ? (
        <ResultSkeleton />
      ) : (
        <main className="mx-auto max-w-7xl space-y-14 px-4 py-8 sm:px-6 lg:py-10">
          <section>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 animate-rise">
              <div>
                <Eyebrow>
                  {design.final.room_type} · {FURNITURE_MODE_LABELS[design.final.furniture_mode]?.label ?? 'progetto su misura'}
                </Eyebrow>
                <h1 className="mt-2 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">{design.final.title}</h1>
              </div>
              <div className="no-print flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" icon={copied ? Check : LinkIcon} onClick={copyLink}>{copied ? 'Link copiato' : 'Condividi'}</Button>
                <Button variant="secondary" size="sm" icon={Download} onClick={() => window.print()}>Scarica PDF</Button>
                {brand.contactEmail && (
                  <a href={quoteMailto(brand, design)} className="bg-accent-gradient inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-px hover:shadow-lift">
                    <Mail className="size-4" /> Richiedi preventivo
                  </a>
                )}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
              <RenderViewer renders={design.renders} render={render} onRender={onRender} title={design.final.title} />
              <div className="space-y-6">
                <Identikit design={design} />
              </div>
            </div>
          </section>

          <RefineBox refine={refine} onRefine={onRefine} busy={render.status === 'loading'} />

          <section>
            <Eyebrow>Il progetto, area per area</Eyebrow>
            <h2 className="mt-2 font-display text-3xl font-semibold">Le scelte di design</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {design.final.sections.map((s, i) => (
                <div key={`${s.area}-${i}`} className="print-break flex gap-4 rounded-3xl border border-line bg-surface p-5 shadow-soft">
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl font-display font-semibold text-white" style={{ background: TAG_COLORS[i % TAG_COLORS.length] }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-semibold">{s.area}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{s.choice}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <Eyebrow>Disponibili nel nostro magazzino</Eyebrow>
                <h2 className="mt-2 font-display text-3xl font-semibold">I materiali scelti per te</h2>
              </div>
              <SwatchStrip colors={design.products.map(p => p.colore_hex).filter(Boolean)} className="h-3 w-48" />
            </div>
            <div className="mt-6"><ProductGrid products={design.products} /></div>
          </section>

          {design.final.inspiration_pieces?.length > 0 && (
            <section>
              <Eyebrow>Per completare la scena</Eyebrow>
              <h2 className="mt-2 font-display text-3xl font-semibold">Ispirazione</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Pezzi pensati per il tuo stile e presenti nel render, ma non a catalogo: il nostro team può proporti alternative simili.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {design.final.inspiration_pieces.map((p, i) => {
                  const color = TAG_COLORS[(i + 2) % TAG_COLORS.length];
                  return (
                    <article key={`${p.name}-${i}`} className="print-break flex gap-4 rounded-3xl border border-dashed border-line bg-surface/60 p-5">
                      <span
                        className="grid size-14 shrink-0 place-items-center rounded-2xl text-2xl"
                        style={{ background: `color-mix(in srgb, ${color} 16%, transparent)` }}
                      >
                        {p.emoji}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-semibold leading-snug">{p.name}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{p.description}</p>
                        <span className="mt-2 inline-block rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">Ispirazione · non a catalogo</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          <footer className="border-t border-line pt-6 pb-4 text-xs text-muted">
            Render indicativo generato con intelligenza artificiale: colori e proporzioni possono differire dai prodotti reali. Prezzi e disponibilità da verificare con {brand.companyName}.
          </footer>
        </main>
      )}
    </div>
  );
}
