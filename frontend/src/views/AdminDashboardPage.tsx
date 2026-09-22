'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components';
import { adminService, categoriaService, destinoService, guiaService, relatorioAdminService } from '@/services';

export function AdminDashboardPage() {
  const [stats, setStats] = useState({ clientes: 0, reservasPendentes: 0, pagamentosPendentes: 0 });
  const [catalogo, setCatalogo] = useState({ categorias: 0, destinos: 0, guias: 0 });

  useEffect(() => {
    Promise.all([
      adminService.listarUsuarios('APROVADO'),
      relatorioAdminService.resumo(),
    ]).then(([usuarios, resumo]) => {
      setStats({
        clientes: usuarios.filter((u) => u.role === 'CLIENTE').length,
        reservasPendentes: resumo.reservasPendentes,
        pagamentosPendentes: resumo.pagamentosPendentes,
      });
    }).catch(console.error);

    Promise.all([
      categoriaService.listar(),
      destinoService.listar(),
      guiaService.listar(),
    ]).then(([categorias, destinos, guias]) => {
      setCatalogo({
        categorias: categorias.length,
        destinos: destinos.length,
        guias: guias.length,
      });
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Dashboard</h2>
        <p className="text-slate-400">Visao geral do back office MoviTur</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/usuarios">
          <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
            <div className="text-3xl font-bold text-emerald-400">{stats.clientes}</div>
            <div className="text-slate-400 mt-1">Clientes registados</div>
          </Card>
        </Link>
        <Link href="/admin/reservas">
          <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
            <div className="text-3xl font-bold text-amber-400">{stats.reservasPendentes}</div>
            <div className="text-slate-400 mt-1">Reservas pendentes</div>
          </Card>
        </Link>
        <Link href="/admin/pagamentos">
          <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
            <div className="text-3xl font-bold text-orange-400">{stats.pagamentosPendentes}</div>
            <div className="text-slate-400 mt-1">Pagamentos a verificar</div>
          </Card>
        </Link>
      </div>

      {stats.reservasPendentes > 0 && (
        <Card className="bg-amber-900/20 border-amber-700/50">
          <p className="text-amber-200 text-sm">
            Existem <strong>{stats.reservasPendentes}</strong> reserva(s) a aguardar confirmacao.{' '}
            <Link href="/admin/reservas" className="underline font-medium">Rever agora</Link>
          </p>
        </Card>
      )}

      {stats.pagamentosPendentes > 0 && (
        <Card className="bg-orange-900/20 border-orange-700/50">
          <p className="text-orange-200 text-sm">
            Existem <strong>{stats.pagamentosPendentes}</strong> pagamento(s) M-Pesa/transferencia a verificar.{' '}
            <Link href="/admin/pagamentos" className="underline font-medium">Verificar agora</Link>
          </p>
        </Card>
      )}

      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Catalogo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Categorias', value: catalogo.categorias, to: '/admin/categorias' },
            { label: 'Destinos', value: catalogo.destinos, to: '/admin/destinos' },
            { label: 'Guias', value: catalogo.guias, to: '/admin/guias' },
          ].map((s) => (
            <Link key={s.label} href={s.to}>
              <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                <div className="text-3xl font-bold text-sky-400">{s.value}</div>
                <div className="text-slate-400 mt-1">{s.label}</div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
