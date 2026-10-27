import { useCallback, useEffect, useState } from 'react';

export async function api<T = unknown>(path: string, method = 'GET', body?: unknown): Promise<T> {
  if (import.meta.env.VITE_DEMO) return (await import('./demo/api')).demoApi<T>(path, method);
  const res = await fetch(`/api${path}`, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    const msg = Array.isArray(erro.message) ? erro.message.join('; ') : erro.message;
    throw Object.assign(new Error(msg ?? `Erro ${res.status}`), { status: res.status });
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export function useApi<T>(path: string | null) {
  const [dados, setDados] = useState<T>();
  const [erro, setErro] = useState<string>();

  const recarregar = useCallback(() => {
    if (!path) return;
    api<T>(path).then(setDados, (e: Error) => setErro(e.message));
  }, [path]);

  useEffect(recarregar, [recarregar]);
  return { dados, erro, recarregar };
}

export async function enviar(acao: () => Promise<unknown>, depois?: () => void) {
  try {
    await acao();
    depois?.();
  } catch (e) {
    window.alert((e as Error).message);
  }
}
