import { useId } from 'react';
import { Dna, House, Layers, Lightbulb, Sparkles, Wallet, Heart, Sofa } from 'lucide-react';
import { FURNITURE_MODE_LABELS, TAG_COLORS } from '../lib/phases.js';
import { Eyebrow } from './ui.jsx';

function ProgressRing({ value }) {
  const id = `ring${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const r = 20;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-14">
      <svg viewBox="0 0 48 48" className="size-14 -rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--a1)" />
            <stop offset="0.55" stopColor="var(--a2)" />
            <stop offset="1" stopColor="var(--a3)" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r={r} fill="none" stroke="var(--color-line)" strokeWidth="4" />
        <circle
          cx="24" cy="24" r={r} fill="none" stroke={`url(#${id})`} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - value)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-xs font-semibold">{Math.round(value * 100)}%</span>
    </div>
  );
}

function Row({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-3 animate-rise">
      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted"><Icon className="size-4" /></span>
      <div className="min-w-0 pt-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
        <div className="mt-0.5 text-sm leading-snug">{children}</div>
      </div>
    </div>
  );
}

export default function DnaPanel({ profile, progress }) {
  const empty = !profile.archetype && !profile.keywords.length && !profile.palette.length && !profile.room_type;
  const materials = [...profile.materials, ...profile.finishes];
  const furnitureMode = FURNITURE_MODE_LABELS[profile.furniture_mode];
  const furnitureTraits = profile.furniture_traits ?? [];

  return (
    <div className="rounded-[28px] border border-line bg-surface/85 p-5 shadow-soft backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow className="flex items-center gap-1.5"><Dna className="size-3.5" /> Il tuo Design DNA</Eyebrow>
          {profile.archetype ? (
            <p key={profile.archetype} className="text-gradient mt-2 font-display text-[28px] font-semibold leading-tight animate-rise">
              {profile.archetype}
            </p>
          ) : (
            <p className="mt-2 font-display text-2xl font-semibold leading-tight text-muted/70 italic">In evoluzione…</p>
          )}
          {profile.mood && <p className="mt-1.5 text-sm italic text-muted animate-rise">“{profile.mood}”</p>}
        </div>
        <ProgressRing value={progress} />
      </div>

      {empty ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line p-5 text-center">
          <Sparkles className="mx-auto size-6 text-muted" />
          <p className="mt-2 text-sm text-muted">Rispondi alle domande: qui prenderà forma il tuo identikit di stile, con colori, materiali e atmosfera.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {profile.palette.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Palette</p>
              <div className="mt-2 flex h-16 overflow-hidden rounded-2xl shadow-soft">
                {profile.palette.map((c, i) => (
                  <div
                    key={`${c.hex}-${i}`}
                    title={`${c.name} · ${c.hex}`}
                    className="group relative flex-1 transition-[flex] duration-300 hover:flex-[2.2] animate-rise"
                    style={{ background: c.hex, animationDelay: `${i * 60}ms` }}
                  >
                    <span className="absolute inset-x-1 bottom-1 truncate rounded-md bg-black/35 px-1 py-0.5 text-center text-[10px] text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                      {c.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {profile.keywords.map((k, i) => {
                const color = TAG_COLORS[i % TAG_COLORS.length];
                return (
                  <span
                    key={k}
                    className="rounded-full px-2.5 py-1 text-xs font-semibold animate-rise"
                    style={{ color, background: `color-mix(in srgb, ${color} 14%, transparent)`, animationDelay: `${i * 50}ms` }}
                  >
                    {k}
                  </span>
                );
              })}
            </div>
          )}

          <div className="space-y-3.5 border-t border-line pt-4">
            {profile.room_type && <Row icon={House} label="Ambiente">{profile.room_type}</Row>}
            {materials.length > 0 && <Row icon={Layers} label="Materiali e finiture">{materials.join(' · ')}</Row>}
            {furnitureMode && (
              <Row icon={Sofa} label="Arredo">
                {furnitureMode.emoji} {furnitureMode.label}
                {furnitureTraits.length > 0 && <span className="mt-0.5 block text-muted">{furnitureTraits.join(' · ')}</span>}
              </Row>
            )}
            {profile.lighting && <Row icon={Lightbulb} label="Luce">{profile.lighting}</Row>}
            {profile.constraints.length > 0 && <Row icon={Heart} label="Da non dimenticare">{profile.constraints.join(' · ')}</Row>}
            {profile.budget && <Row icon={Wallet} label="Budget">{profile.budget}</Row>}
          </div>
        </div>
      )}
    </div>
  );
}
