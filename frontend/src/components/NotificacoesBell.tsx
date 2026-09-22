'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notificacaoService } from '@/services';
import type { Notificacao } from '@/types';

interface NotificacoesBellProps {
  dark?: boolean;
}

export function NotificacoesBell({ dark = false }: NotificacoesBellProps) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [lista, setLista] = useState<Notificacao[]>([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    try {
      const [items, total] = await Promise.all([
        notificacaoService.listar(),
        notificacaoService.contarNaoLidas(),
      ]);
      setLista(items.slice(0, 8));
      setNaoLidas(total);
    } catch {
      /* ignore when session expired */
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30000);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    if (aberto) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [aberto]);

  async function abrirPainel() {
    setAberto((v) => !v);
    if (!aberto) {
      setLoading(true);
      await refresh();
      setLoading(false);
    }
  }

  async function clicarNotificacao(n: Notificacao) {
    if (!n.lida) {
      await notificacaoService.marcarLida(n.id);
      setNaoLidas((c) => Math.max(0, c - 1));
      setLista((prev) => prev.map((x) => (x.id === n.id ? { ...x, lida: true } : x)));
    }
    setAberto(false);
    if (n.link) router.push(n.link);
  }

  async function marcarTodas() {
    await notificacaoService.marcarTodasLidas();
    setNaoLidas(0);
    setLista((prev) => prev.map((n) => ({ ...n, lida: true })));
  }

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleString('pt-MZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={abrirPainel}
        className={`relative p-2 rounded-lg transition-colors ${dark ? 'hover:bg-slate-700' : 'hover:bg-black/5'}`}
        aria-label="Notificacoes"
      >
        <span className="text-xl">🔔</span>
        {naoLidas > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {naoLidas > 9 ? '9+' : naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="font-semibold text-sm text-gray-800">Notificacoes</span>
            {naoLidas > 0 && (
              <button type="button" onClick={marcarTodas} className="text-xs text-primary hover:underline">
                Marcar todas lidas
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="text-sm text-gray-500 text-center py-6">A carregar...</p>
            ) : lista.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">Sem notificacoes.</p>
            ) : (
              lista.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => clicarNotificacao(n)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    !n.lida ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex justify-between gap-2 mb-0.5">
                    <span className={`text-sm ${!n.lida ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {n.titulo}
                    </span>
                    {!n.lida && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{n.mensagem}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{formatDate(n.criadoEm)}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
