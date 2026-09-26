import { ArrowRight, MessageCircleHeart, Dna, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { BrandMark, Button, Eyebrow, SwatchStrip } from './ui.jsx';

const SAMPLES = [
  { name: 'Rovere naturale', finish: 'Opaco', colors: ['#d9b98f', '#c9a57a', '#a8845c'], r: '-6deg', pos: 'left-0 top-8', delay: '0s' },
  { name: 'Zellige salvia', finish: 'Lucido', colors: ['#b7c7ad', '#9dae93', '#7f9477'], r: '5deg', pos: 'right-2 top-0', delay: '1.2s' },
  { name: 'Marmo Carrara', finish: 'Lucido', colors: ['#f4f3f0', '#e3e1dc', '#c9c7c2'], r: '4deg', pos: 'left-10 bottom-4', delay: '2.1s' },
  { name: 'Cotto toscano', finish: 'Naturale', colors: ['#d27d52', '#b8653e', '#94502f'], r: '-4deg', pos: 'right-0 bottom-14', delay: '0.6s' }
];

const STEPS = [
  { icon: MessageCircleHeart, color: 'var(--color-ph-emozioni)', title: 'Raccontati', text: 'Luoghi che ami, sensazioni e scelte concrete: lucido o opaco, caldo o freddo.' },
  { icon: Dna, color: 'var(--color-ph-stile)', title: 'Il tuo Design DNA', text: 'Mentre rispondi prende forma il tuo identikit: palette, materiali, atmosfera.' },
  { icon: ImageIcon, color: 'var(--color-ph-ambiente)', title: 'Vedi la tua stanza', text: 'Un render fotorealistico con i materiali reali del nostro showroom.' }
];

export default function Landing({ brand, hasSession, onStart, onRestart }) {
  return (
    <div className="bg-glow min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <BrandMark brand={brand} />
        {hasSession && (
          <Button variant="ghost" size="sm" icon={RotateCcw} onClick={onRestart}>Ricomincia</Button>
        )}
      </header>

      <main className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-14">
        <section className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted shadow-soft backdrop-blur">
            <span className="bg-accent-gradient size-2 rounded-full" />
            Interior design su misura, in pochi minuti
          </span>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,4.4rem)] font-semibold leading-[1.02] tracking-tight">
            Scopri il tuo stile.<br />
            <span className="text-gradient italic">Guardalo prendere forma.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {brand.assistantName}, la nostra interior designer virtuale, ti fa qualche domanda sui luoghi che ami e sui materiali che
            preferisci. Poi progetta la tua stanza con pavimenti, rivestimenti e arredi disponibili da {brand.companyName}.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={onStart}>
              {hasSession ? 'Riprendi il tuo progetto' : 'Inizia il tuo progetto'}
              <ArrowRight className="size-5" />
            </Button>
            <span className="text-sm text-muted">Circa 3 minuti · nessuna registrazione</span>
          </div>
        </section>

        <section aria-hidden="true" className="relative mx-auto h-[420px] w-full max-w-[460px] sm:h-[480px]">
          {SAMPLES.map(s => (
            <div
              key={s.name}
              className={`animate-float absolute ${s.pos} w-44 rounded-3xl border border-line bg-surface p-2.5 shadow-lift sm:w-52`}
              style={{ '--r': s.r, animationDelay: s.delay }}
            >
              <div
                className="h-28 rounded-2xl sm:h-32"
                style={{ background: `linear-gradient(135deg, ${s.colors[0]}, ${s.colors[1]} 55%, ${s.colors[2]})` }}
              />
              <div className="px-1.5 pb-1 pt-2.5">
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="text-xs text-muted">Finitura {s.finish}</p>
              </div>
            </div>
          ))}

          <div className="absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-line bg-surface/85 p-5 shadow-lift backdrop-blur-xl">
            <Eyebrow>Il tuo Design DNA</Eyebrow>
            <p className="mt-2 font-display text-2xl font-semibold leading-tight">Mediterraneo Materico</p>
            <SwatchStrip colors={['#e9e1d3', '#c9a57a', '#9dae93', '#b8653e', '#3f3a34']} className="mt-4 h-5" />
            <div className="mt-4 flex flex-wrap gap-1.5">
              {['calce', 'luce calda', 'opaco', 'mare'].map(k => (
                <span key={k} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium">{k}</span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <article key={s.title} className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl text-white" style={{ background: s.color }}>
                  <s.icon className="size-5" />
                </span>
                <span className="font-display text-sm text-muted">0{i + 1}</span>
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
