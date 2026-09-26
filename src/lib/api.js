export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error('Impossibile contattare il server. Controlla la connessione e riprova.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Errore del server (${res.status}).`);
  return data;
}

export const api = {
  config: () => request('/api/config'),
  chat: (messages, profile) => request('/api/chat', { method: 'POST', body: { messages, profile } }),
  getDesign: id => request(`/api/designs/${encodeURIComponent(id)}`),
  render: id => request(`/api/designs/${encodeURIComponent(id)}/render`, { method: 'POST' }),
  refine: (id, instruction) => request(`/api/designs/${encodeURIComponent(id)}/refine`, { method: 'POST', body: { instruction } })
};

// I render sono serviti dal BE con percorso relativo (/renders/...)
export const assetUrl = path => (/^https?:\/\//.test(path) ? path : `${API_BASE_URL}${path}`);

// Accetta solo link http(s) provenienti dal catalogo
export const safeUrl = url => (typeof url === 'string' && /^https?:\/\//i.test(url) ? url : null);
