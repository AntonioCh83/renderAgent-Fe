import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronDown, RotateCcw, SendHorizontal, TriangleAlert } from 'lucide-react';
import { PHASES, phaseIndex } from '../lib/phases.js';
import { BrandMark, Button } from './ui.jsx';
import OptionPicker from './OptionPicker.jsx';
import DnaPanel from './DnaPanel.jsx';

function PhaseStepper({ phase, progress }) {
  const current = phaseIndex(phase);
  return (
    <div className="w-full">
      <ol className="hidden items-center gap-1 md:flex">
        {PHASES.map((p, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={p.id} className="flex items-center gap-1">
              <span
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${active ? 'text-white shadow-soft' : done ? 'text-ink' : 'text-muted'}`}
                style={active ? { background: p.color } : undefined}
              >
                <span
                  className="grid size-4 place-items-center rounded-full text-[9px] text-white"
                  style={{ background: done || active ? (active ? 'rgb(255 255 255 / 0.3)' : p.color) : 'var(--color-line)' }}
                >
                  {done ? <Check className="size-2.5" strokeWidth={3.5} /> : i + 1}
                </span>
                <span className={active ? '' : 'hidden xl:inline'}>{p.label}</span>
              </span>
              {i < PHASES.length - 1 && <span className="h-px w-3 bg-line" />}
            </li>
          );
        })}
      </ol>
      <p className="text-xs font-semibold md:hidden" style={{ color: PHASES[Math.min(current, PHASES.length - 1)].color }}>
        {current < PHASES.length ? `Fase ${current + 1} di ${PHASES.length} · ${PHASES[current].label}` : 'Intervista completata'}
      </p>
    </div>
  );
}

function AssistantAvatar({ brand }) {
  return (
    <span className="bg-accent-gradient grid size-8 shrink-0 place-items-center rounded-full font-display text-sm font-semibold text-white shadow-soft">
      {brand.assistantName.charAt(0)}
    </span>
  );
}

function TypingBubble({ brand }) {
  return (
    <div className="flex items-end gap-2.5 animate-rise">
      <AssistantAvatar brand={brand} />
      <div className="flex items-center gap-1 rounded-3xl rounded-bl-md border border-line bg-surface px-4 py-3.5 shadow-soft" aria-label={`${brand.assistantName} sta scrivendo`}>
        {[0, 1, 2].map(i => <span key={i} className="typing-dot size-1.5 rounded-full bg-muted" />)}
      </div>
    </div>
  );
}

function Message({ message, brand }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end animate-rise">
        <p className="bg-accent-gradient max-w-[85%] whitespace-pre-line rounded-3xl rounded-br-md px-4 py-2.5 text-[15px] leading-relaxed text-white shadow-soft">
          {message.content}
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2.5 animate-rise">
      <AssistantAvatar brand={brand} />
      <p className="max-w-[85%] whitespace-pre-line rounded-3xl rounded-bl-md border border-line bg-surface px-4 py-3 text-[15px] leading-relaxed shadow-soft">
        {message.content}
      </p>
    </div>
  );
}

function Composer({ disabled, placeholder, onSend }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus({ preventScroll: true });
  }, [disabled]);

  const submit = e => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText('');
  };

  return (
    <form onSubmit={submit} className="flex items-end gap-2 rounded-[28px] border border-line bg-surface p-1.5 pl-5 shadow-soft transition focus-within:border-ink/30">
      <textarea
        ref={inputRef}
        rows={1}
        value={text}
        maxLength={1000}
        disabled={disabled}
        placeholder={placeholder}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) submit(e);
        }}
        className="max-h-32 min-h-11 flex-1 resize-none bg-transparent py-2.5 text-[15px] outline-none placeholder:text-muted/80 disabled:opacity-60"
        aria-label="La tua risposta"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="bg-accent-gradient grid size-11 shrink-0 place-items-center rounded-full text-white shadow-soft transition hover:scale-105 disabled:scale-100 disabled:opacity-40"
        aria-label="Invia"
      >
        <SendHorizontal className="size-5" />
      </button>
    </form>
  );
}

export default function Experience({ brand, messages, profile, progress, phase, chat, completedDesignId, onSend, onRetry, onShowResult, onRestart }) {
  const scrollRef = useRef(null);
  const [dnaOpen, setDnaOpen] = useState(false);
  const loading = chat.status === 'loading';
  const last = messages[messages.length - 1];
  const awaitingAnswer = last?.role === 'assistant' && !loading && !completedDesignId;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, loading, chat.status]);

  return (
    <div className="bg-glow flex h-dvh flex-col">
      <header className="shrink-0 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <a href="#/" aria-label="Torna alla home"><BrandMark brand={brand} compact /></a>
          <div className="min-w-0 flex-1"><PhaseStepper phase={phase} progress={progress} /></div>
          <Button variant="ghost" size="sm" icon={RotateCcw} onClick={onRestart} className="max-sm:px-2.5">
            <span className="max-sm:hidden">Ricomincia</span>
          </Button>
        </div>
        <div className="h-1 bg-line/60">
          <div className="bg-accent-gradient h-full transition-[width] duration-700 ease-out" style={{ width: `${Math.max(4, progress * 100)}%` }} />
        </div>
      </header>

      <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:py-6">
        {/* Colonna chat */}
        <section className="flex min-h-0 flex-col">
          {/* DNA compatto su mobile */}
          <div className="mb-3 lg:hidden">
            <button
              type="button"
              onClick={() => setDnaOpen(o => !o)}
              className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-2.5 text-left shadow-soft"
              aria-expanded={dnaOpen}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">DNA</span>
              <span className="min-w-0 flex-1 truncate font-display font-semibold">{profile.archetype || 'In evoluzione…'}</span>
              <span className="flex -space-x-1.5">
                {profile.palette.slice(0, 5).map(c => <span key={c.hex} className="size-5 rounded-full border-2 border-surface" style={{ background: c.hex }} />)}
              </span>
              <ChevronDown className={`size-4 text-muted transition ${dnaOpen ? 'rotate-180' : ''}`} />
            </button>
            {dnaOpen && <div className="mt-2 max-h-[45dvh] overflow-y-auto scroll-thin"><DnaPanel profile={profile} progress={progress} /></div>}
          </div>

          <div ref={scrollRef} className="scroll-thin min-h-0 flex-1 space-y-5 overflow-y-auto pb-4 pr-1" aria-live="polite">
            {messages.map((m, i) => (
              <div key={m.id} className="space-y-3">
                <Message message={m} brand={brand} />
                {i === messages.length - 1 && awaitingAnswer && m.options?.length > 0 && (
                  <div className="pl-10.5">
                    <OptionPicker message={m} onSelect={onSend} />
                  </div>
                )}
              </div>
            ))}

            {loading && <TypingBubble brand={brand} />}

            {chat.status === 'error' && (
              <div className="flex items-center gap-3 rounded-2xl border border-[#f2705a]/40 bg-[#f2705a]/10 px-4 py-3 text-sm animate-rise" role="alert">
                <TriangleAlert className="size-4 shrink-0 text-[#d9482b]" />
                <span className="flex-1">{chat.error}</span>
                <Button size="sm" variant="secondary" onClick={onRetry}>Riprova</Button>
              </div>
            )}

            {completedDesignId && (
              <div className="bg-accent-gradient rounded-3xl p-[1.5px] shadow-lift animate-rise">
                <div className="flex flex-col items-start gap-4 rounded-[22px] bg-surface p-5 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <p className="font-display text-xl font-semibold">Il tuo progetto è pronto ✨</p>
                    <p className="mt-1 text-sm text-muted">Stiamo già preparando il render con i materiali selezionati per te.</p>
                  </div>
                  <Button onClick={onShowResult}>Scopri il risultato <ArrowRight className="size-4" /></Button>
                </div>
              </div>
            )}
          </div>

          {!completedDesignId && (
            <div className="shrink-0 pt-2">
              <Composer
                disabled={loading || last?.role !== 'assistant'}
                placeholder={last?.options?.length ? 'Oppure rispondi con parole tue…' : 'Scrivi la tua risposta…'}
                onSend={onSend}
              />
            </div>
          )}
        </section>

        {/* Pannello DNA desktop */}
        <aside className="hidden min-h-0 overflow-y-auto scroll-thin lg:block">
          <DnaPanel profile={profile} progress={progress} />
        </aside>
      </div>
    </div>
  );
}
