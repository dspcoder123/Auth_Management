// Lightweight auth helper to centralize localStorage access and auth update events
type AuthUser = any;

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setAuth(token: string | null, user: AuthUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch (e) {}
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch (e) {}
  // notify listeners
  dispatchAuthUpdate({ user, loggedIn: !!user });
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
  try { localStorage.removeItem(USER_KEY); } catch (e) {}
  dispatchAuthUpdate({ loggedIn: false });
}

export function dispatchAuthUpdate(detail: any) {
  try {
    window.dispatchEvent(new CustomEvent('auth:update', { detail }));
  } catch (e) {
    // ignore
  }
}

export function subscribeAuth(cb: (detail: any) => void) {
  const handler = (e: Event) => {
    try { cb((e as CustomEvent).detail); } catch (err) {}
  };
  if (typeof window !== 'undefined') window.addEventListener('auth:update', handler as EventListener);
  return () => { if (typeof window !== 'undefined') window.removeEventListener('auth:update', handler as EventListener); };
}

export default {
  getToken,
  getUser,
  setAuth,
  clearAuth,
  dispatchAuthUpdate,
  subscribeAuth,
};
