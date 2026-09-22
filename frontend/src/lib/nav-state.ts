const KEY = 'movitur_nav_state';

export function setNavState(state: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(KEY, JSON.stringify(state));
}

export function peekNavState<T extends Record<string, unknown>>(): T | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function consumeNavState<T extends Record<string, unknown>>(): T | null {
  const state = peekNavState<T>();
  if (state && typeof window !== 'undefined') {
    sessionStorage.removeItem(KEY);
  }
  return state;
}
