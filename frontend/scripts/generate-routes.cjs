const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'src', 'app');

const routes = [
  ['page.tsx', "export { HomePage as default } from '@/views/HomePage';"],
  ['cliente/page.tsx', "export { ClienteLandingPage as default } from '@/views/ClienteLandingPage';"],
  ['cliente/login/page.tsx', "export { LoginPage as default } from '@/views/LoginPage';"],
  ['cliente/registo/page.tsx', "export { RegistoPage as default } from '@/views/RegistoPage';"],
  ['cliente/recuperar-senha/page.tsx', "export { RecuperarSenhaPage as default } from '@/views/RecuperarSenhaPage';"],
  ['cliente/redefinir-senha/page.tsx', "export { RedefinirSenhaPage as default } from '@/views/RedefinirSenhaPage';"],
  ['cliente/categorias/page.tsx', "export { CategoriasPage as default } from '@/views/CategoriasPage';"],
  ['cliente/destinos/page.tsx', "export { DestinosPage as default } from '@/views/DestinosPage';"],
  ['cliente/destinos/mapa/page.tsx', "export { DestinosMapPage as default } from '@/views/DestinosMapPage';"],
  ['cliente/destinos/[id]/page.tsx', "export { DestinoDetalhePage as default } from '@/views/DestinoDetalhePage';"],
  ['cliente/guias/page.tsx', "export { GuiasPage as default } from '@/views/GuiasPage';"],
  ['cliente/guias/[id]/page.tsx', "export { GuiaDetalhePage as default } from '@/views/GuiaDetalhePage';"],
  ['cliente/hoteis/page.tsx', "export { HoteisPage as default } from '@/views/HoteisPage';"],
  ['cliente/restaurantes/page.tsx', "export { RestaurantesPage as default } from '@/views/RestaurantesPage';"],
  ['cliente/estabelecimentos/[id]/page.tsx', "export { EstabelecimentoDetalhePage as default } from '@/views/EstabelecimentoDetalhePage';"],
  ['cliente/inicio/page.tsx', "export { PainelClientePage as default } from '@/views/PainelClientePage';"],
  ['cliente/simulador/page.tsx', "export { SimuladorPage as default } from '@/views/SimuladorPage';"],
  ['cliente/reservas/page.tsx', "export { ReservasPage as default } from '@/views/ReservasPage';"],
  ['cliente/poupancas/page.tsx', "export { PoupancasPage as default } from '@/views/PoupancasPage';"],
  ['cliente/favoritos/page.tsx', "export { FavoritosPage as default } from '@/views/FavoritosPage';"],
  ['cliente/conta/page.tsx', "export { ClienteContaPage as default } from '@/views/ClienteContaPage';"],
  ['admin/login/page.tsx', "export { AdminLoginPage as default } from '@/views/AdminLoginPage';"],
  ['admin/page.tsx', "export { AdminDashboardPage as default } from '@/views/AdminDashboardPage';"],
  ['admin/usuarios/page.tsx', "export { AdminPage as default } from '@/views/AdminPage';"],
  ['admin/categorias/page.tsx', "export { AdminCategoriasPage as default } from '@/views/AdminCategoriasPage';"],
  ['admin/destinos/page.tsx', "export { AdminDestinosPage as default } from '@/views/AdminDestinosPage';"],
  ['admin/guias/page.tsx', "export { AdminGuiasPage as default } from '@/views/AdminGuiasPage';"],
  ['admin/reservas/page.tsx', "export { AdminReservasPage as default } from '@/views/AdminReservasPage';"],
  ['admin/pagamentos/page.tsx', "export { AdminPagamentosPage as default } from '@/views/AdminPagamentosPage';"],
  ['admin/relatorios/page.tsx', "export { AdminRelatoriosPage as default } from '@/views/AdminRelatoriosPage';"],
  ['admin/estabelecimentos/page.tsx', "export { AdminEstabelecimentosPage as default } from '@/views/AdminEstabelecimentosPage';"],
  ['admin/feedback/page.tsx', "export { AdminFeedbackPage as default } from '@/views/AdminFeedbackPage';"],
];

const layouts = [
  ['cliente/(auth)/layout.tsx', `import { ClienteAuthLayout } from '@/components/layout/ClienteAuthLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClienteAuthLayout>{children}</ClienteAuthLayout>;
}
`],
  ['cliente/(explorar)/layout.tsx', `import { ExplorarLayout } from '@/components/layout/ExplorarLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ExplorarLayout>{children}</ExplorarLayout>;
}
`],
  ['cliente/(app)/layout.tsx', `'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ClienteLayout } from '@/components/layout/ClienteLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute role="CLIENTE">
      <ClienteLayout>{children}</ClienteLayout>
    </ProtectedRoute>
  );
}
`],
  ['admin/(auth)/layout.tsx', `import { AdminAuthLayout } from '@/components/layout/AdminAuthLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminAuthLayout>{children}</AdminAuthLayout>;
}
`],
  ['admin/(app)/layout.tsx', `'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminLayout } from '@/components/layout/AdminLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute role="ADMIN">
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
`],
];

// Move routes into route groups
const groupMap = {
  'cliente/login/page.tsx': 'cliente/(auth)/login/page.tsx',
  'cliente/registo/page.tsx': 'cliente/(auth)/registo/page.tsx',
  'cliente/recuperar-senha/page.tsx': 'cliente/(auth)/recuperar-senha/page.tsx',
  'cliente/redefinir-senha/page.tsx': 'cliente/(auth)/redefinir-senha/page.tsx',
  'cliente/categorias/page.tsx': 'cliente/(explorar)/categorias/page.tsx',
  'cliente/destinos/page.tsx': 'cliente/(explorar)/destinos/page.tsx',
  'cliente/destinos/mapa/page.tsx': 'cliente/(explorar)/destinos/mapa/page.tsx',
  'cliente/destinos/[id]/page.tsx': 'cliente/(explorar)/destinos/[id]/page.tsx',
  'cliente/guias/page.tsx': 'cliente/(explorar)/guias/page.tsx',
  'cliente/guias/[id]/page.tsx': 'cliente/(explorar)/guias/[id]/page.tsx',
  'cliente/hoteis/page.tsx': 'cliente/(explorar)/hoteis/page.tsx',
  'cliente/restaurantes/page.tsx': 'cliente/(explorar)/restaurantes/page.tsx',
  'cliente/estabelecimentos/[id]/page.tsx': 'cliente/(explorar)/estabelecimentos/[id]/page.tsx',
  'cliente/inicio/page.tsx': 'cliente/(app)/inicio/page.tsx',
  'cliente/simulador/page.tsx': 'cliente/(app)/simulador/page.tsx',
  'cliente/reservas/page.tsx': 'cliente/(app)/reservas/page.tsx',
  'cliente/poupancas/page.tsx': 'cliente/(app)/poupancas/page.tsx',
  'cliente/favoritos/page.tsx': 'cliente/(app)/favoritos/page.tsx',
  'cliente/conta/page.tsx': 'cliente/(app)/conta/page.tsx',
  'admin/login/page.tsx': 'admin/(auth)/login/page.tsx',
  'admin/page.tsx': 'admin/(app)/page.tsx',
  'admin/usuarios/page.tsx': 'admin/(app)/usuarios/page.tsx',
  'admin/categorias/page.tsx': 'admin/(app)/categorias/page.tsx',
  'admin/destinos/page.tsx': 'admin/(app)/destinos/page.tsx',
  'admin/guias/page.tsx': 'admin/(app)/guias/page.tsx',
  'admin/reservas/page.tsx': 'admin/(app)/reservas/page.tsx',
  'admin/pagamentos/page.tsx': 'admin/(app)/pagamentos/page.tsx',
  'admin/relatorios/page.tsx': 'admin/(app)/relatorios/page.tsx',
  'admin/estabelecimentos/page.tsx': 'admin/(app)/estabelecimentos/page.tsx',
  'admin/feedback/page.tsx': 'admin/(app)/feedback/page.tsx',
};

function write(filePath, content) {
  const full = path.join(appDir, filePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.endsWith('\n') ? content : content + '\n');
}

for (const [route, exportLine] of routes) {
  const target = groupMap[route] || route;
  write(target, exportLine);
}

for (const [layoutPath, content] of layouts) {
  write(layoutPath, content);
}

console.log('App routes generated');
