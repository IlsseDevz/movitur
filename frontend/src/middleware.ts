import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const REDIRECTS: Record<string, string> = {
  '/login': '/cliente/login',
  '/registo': '/cliente/registo',
  '/painel': '/cliente/inicio',
  '/categorias': '/cliente/categorias',
  '/destinos': '/cliente/destinos',
  '/guias': '/cliente/guias',
  '/simulador': '/cliente/simulador',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (REDIRECTS[pathname]) {
    return NextResponse.redirect(new URL(REDIRECTS[pathname], request.url));
  }

  if (pathname.startsWith('/painel/')) {
    return NextResponse.redirect(new URL('/cliente/inicio', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/registo', '/painel/:path*', '/categorias', '/destinos', '/guias', '/simulador'],
};
