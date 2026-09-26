import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './lib/api.js';
import { welcomeMessage } from './lib/phases.js';
import { loadSession, saveSession, clearSession } from './lib/storage.js';
import Landing from './components/Landing.jsx';
import Experience from './components/Experience.jsx';
import Result from './components/Result.jsx';

const DEFAULT_BRAND = { companyName: 'Casa Materia', assistantName: 'Lia', contactEmail: '' };
const EMPTY_PROFILE = {
  archetype: '', room_type: '', mood: '', keywords: [], palette: [],
  materials: [], finishes: [], furniture_mode: '', furniture_traits: [],
  lighting: '', constraints: [], budget: ''
};

// Routing minimale via hash: #/  ·  #/intervista  ·  #/progetto/<id>
function parseRoute() {
  const hash = window.location.hash.replace(/^#/, '');
  const match = hash.match(/^\/progetto\/([0-9a-f-]{36})$/i);
  if (match) return { screen: 'result', designId: match[1] };
  if (hash === '/intervista') return { screen: 'experience' };
  return { screen: 'landing' };
}
const navigate = path => { window.location.hash = path; };

let messageSeq = 0;
const newId = () => `m${Date.now()}-${messageSeq++}`;

export default function App() {
  const saved = useRef(loadSession()).current;

  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [route, setRoute] = useState(parseRoute);

  const [messages, setMessages] = useState(saved?.messages ?? []);
  const [profile, setProfile] = useState({ ...EMPTY_PROFILE, ...saved?.profile });
  const [progress, setProgress] = useState(saved?.progress ?? 0);
  const [phase, setPhase] = useState(saved?.phase ?? 'ambiente');
  const [completedDesignId, setCompletedDesignId] = useState(saved?.completedDesignId ?? null);
  const [chat, setChat] = useState({ status: 'idle', error: null });

  const [design, setDesign] = useState(null);
  // L'errore è legato all'id del progetto: un 404 vecchio non deve coprire un progetto nuovo
  const [designError, setDesignError] = useState({ id: null, message: null });
  const [render, setRender] = useState({ status: 'idle', error: null });
  const [refine, setRefine] = useState({ status: 'idle', error: null, message: null });
  const autoRendered = useRef(new Set());

  useEffect(() => {
    api.config().then(cfg => setBrand({ ...DEFAULT_BRAND, ...cfg })).catch(() => {});
  }, []);

  useEffect(() => {
    document.title = `${brand.companyName} · Design Studio`;
  }, [brand.companyName]);

  useEffect(() => {
    const onHash = () => {
      setRoute(parseRoute());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    saveSession({ messages, profile, progress, phase, completedDesignId });
  }, [messages, profile, progress, phase, completedDesignId]);

  // Arrivando direttamente sull'intervista (refresh o link) serve il messaggio di benvenuto
  useEffect(() => {
    if (route.screen === 'experience' && messages.length === 0) {
      setMessages([welcomeMessage(brand.assistantName)]);
    }
  }, [route.screen, messages.length, brand.assistantName]);

  // ---------- Render ----------

  const startRender = useCallback(async designId => {
    setRender({ status: 'loading', error: null });
    try {
      setDesign(await api.render(designId));
      setRender({ status: 'idle', error: null });
    } catch (err) {
      setRender({ status: 'error', error: err.message });
    }
  }, []);

  // ---------- Progetto (schermata risultato) ----------

  useEffect(() => {
    if (route.screen !== 'result' || design?.id === route.designId) return;
    const id = route.designId;
    setDesignError({ id: null, message: null });
    api.getDesign(route.designId)
      .then(setDesign)
      .catch(err => setDesignError({ id, message: err.message }));
  }, [route, design?.id]);

  // Primo render automatico per i progetti che non ne hanno ancora
  useEffect(() => {
    if (!design || design.renders.length > 0 || autoRendered.current.has(design.id)) return;
    autoRendered.current.add(design.id);
    startRender(design.id);
  }, [design, startRender]);

  // ---------- Intervista ----------

  const askNext = useCallback(async history => {
    setChat({ status: 'loading', error: null });
    try {
      const payload = history.map(m => ({
        role: m.role,
        content: m.content,
        options: m.options?.map(o => o.label) ?? []
      }));
      const turn = await api.chat(payload, profile);

      setMessages(prev => [...prev, {
        id: newId(),
        role: 'assistant',
        content: turn.message,
        phase: turn.phase,
        input_type: turn.input_type,
        options: turn.options,
        allow_free_text: turn.allow_free_text
      }]);
      setProfile(turn.profile);
      setProgress(turn.progress);
      setPhase(turn.phase);

      if (turn.type === 'complete' && turn.design) {
        setCompletedDesignId(turn.design.id);
        setDesign(turn.design);
      }
      setChat({ status: 'idle', error: null });
    } catch (err) {
      setChat({ status: 'error', error: err.message });
    }
  }, [profile]);

  const sendAnswer = useCallback(text => {
    const clean = text.trim();
    if (!clean || chat.status === 'loading' || completedDesignId) return;
    const next = [...messages, { id: newId(), role: 'user', content: clean }];
    setMessages(next);
    askNext(next);
  }, [messages, chat.status, completedDesignId, askNext]);

  const retryChat = useCallback(() => askNext(messages), [askNext, messages]);

  const startInterview = () => {
    if (messages.length === 0) setMessages([welcomeMessage(brand.assistantName)]);
    navigate(completedDesignId ? `/progetto/${completedDesignId}` : '/intervista');
  };

  const newProject = () => {
    clearSession();
    setMessages([welcomeMessage(brand.assistantName)]);
    setProfile(EMPTY_PROFILE);
    setProgress(0);
    setPhase('ambiente');
    setCompletedDesignId(null);
    setChat({ status: 'idle', error: null });
    setRefine({ status: 'idle', error: null, message: null });
    setRender({ status: 'idle', error: null });
    navigate('/intervista');
  };

  // ---------- Modifica del progetto ----------

  const refineDesign = useCallback(async instruction => {
    if (!design) return;
    setRefine({ status: 'loading', error: null, message: null });
    try {
      const result = await api.refine(design.id, instruction);
      setDesign(result.design);
      setRefine({ status: 'idle', error: null, message: result.message });
      startRender(result.design.id);
    } catch (err) {
      setRefine({ status: 'error', error: err.message, message: null });
    }
  }, [design, startRender]);

  if (route.screen === 'result') {
    return (
      <Result
        brand={brand}
        design={design?.id === route.designId ? design : null}
        loadError={designError.id === route.designId ? designError.message : null}
        render={render}
        refine={refine}
        onRender={() => startRender(route.designId)}
        onRefine={refineDesign}
        onNewProject={newProject}
      />
    );
  }

  if (route.screen === 'experience') {
    return (
      <Experience
        brand={brand}
        messages={messages}
        profile={profile}
        progress={progress}
        phase={phase}
        chat={chat}
        completedDesignId={completedDesignId}
        onSend={sendAnswer}
        onRetry={retryChat}
        onShowResult={() => navigate(`/progetto/${completedDesignId}`)}
        onRestart={newProject}
      />
    );
  }

  return (
    <Landing
      brand={brand}
      hasSession={messages.length > 1}
      onStart={startInterview}
      onRestart={newProject}
    />
  );
}
