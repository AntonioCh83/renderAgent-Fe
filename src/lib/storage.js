// Salvataggio della sessione in corso (per non perdere l'intervista con un refresh).
// Lo storage può non essere disponibile (navigazione privata, cookie bloccati): mai bloccare l'app.
const KEY = 'renderagent.session.v1';

export function loadSession() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // ignorato
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignorato
  }
}
