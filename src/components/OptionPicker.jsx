import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button, moodGradient } from './ui.jsx';

// Le opzioni compaiono in sequenza per un effetto più vivo
const stagger = i => ({ animationDelay: `${i * 70}ms` });

function VisualChoice({ options, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
      {options.map((o, i) => (
        <button
          key={o.label}
          type="button"
          onClick={() => onSelect(o.label)}
          style={stagger(i)}
          className="group animate-rise flex flex-col overflow-hidden rounded-3xl border border-line bg-surface text-left shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-accent"
        >
          <div className="relative grid h-24 place-items-center sm:h-28" style={{ background: moodGradient(o.colors) }}>
            <span className="text-4xl drop-shadow-sm transition duration-300 group-hover:scale-110 sm:text-5xl">{o.emoji}</span>
          </div>
          <div className="px-3.5 py-3">
            <p className="text-sm font-semibold leading-snug">{o.label}</p>
            {o.hint && <p className="mt-0.5 text-xs leading-snug text-muted">{o.hint}</p>}
          </div>
        </button>
      ))}
    </div>
  );
}

function PaletteChoice({ options, onSelect }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((o, i) => (
        <button
          key={o.label}
          type="button"
          onClick={() => onSelect(`${o.label} (${o.colors.join(', ')})`)}
          style={stagger(i)}
          className="animate-rise flex flex-col rounded-3xl border border-line bg-surface p-3 text-left shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-accent"
        >
          <div className="flex h-16 overflow-hidden rounded-2xl">
            {o.colors.map((c, j) => <span key={`${c}-${j}`} className="flex-1 transition-[flex] duration-300 hover:flex-[1.8]" style={{ background: c }} />)}
          </div>
          <p className="mt-2.5 px-1 text-sm font-semibold">{o.emoji} {o.label}</p>
          {o.hint && <p className="px-1 text-xs text-muted">{o.hint}</p>}
        </button>
      ))}
    </div>
  );
}

function Chip({ option, selected, onClick, index }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      style={stagger(index)}
      className={`animate-rise inline-flex items-center gap-2 rounded-full border py-2 pl-2 pr-4 text-sm font-medium shadow-soft transition duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent ${selected ? 'border-transparent bg-ink text-canvas' : 'border-line bg-surface hover:border-ink/30'}`}
    >
      <span className="grid size-7 place-items-center rounded-full text-base" style={{ background: moodGradient(option.colors) }}>
        {selected ? <Check className="size-4 text-ink" strokeWidth={3} /> : option.emoji}
      </span>
      <span className="text-left leading-tight">
        {option.label}
        {option.hint && <span className={`block text-[11px] font-normal ${selected ? 'text-canvas/70' : 'text-muted'}`}>{option.hint}</span>}
      </span>
    </button>
  );
}

function SingleChoice({ options, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o, i) => <Chip key={o.label} option={o} index={i} onClick={() => onSelect(o.label)} />)}
    </div>
  );
}

function MultiChoice({ options, onSelect }) {
  const [picked, setPicked] = useState([]);
  const toggle = label => setPicked(p => (p.includes(label) ? p.filter(l => l !== label) : [...p, label]));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => (
          <Chip key={o.label} option={o} index={i} selected={picked.includes(o.label)} onClick={() => toggle(o.label)} />
        ))}
      </div>
      <Button size="sm" disabled={picked.length === 0} onClick={() => onSelect(picked.join(', '))}>
        Conferma{picked.length > 0 && ` (${picked.length})`}
      </Button>
    </div>
  );
}

export default function OptionPicker({ message, onSelect }) {
  const { input_type: type, options } = message;
  if (type === 'visual_choice') return <VisualChoice options={options} onSelect={onSelect} />;
  if (type === 'palette') return <PaletteChoice options={options} onSelect={onSelect} />;
  if (type === 'multi_choice') return <MultiChoice options={options} onSelect={onSelect} />;
  return <SingleChoice options={options} onSelect={onSelect} />;
}
