'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  end?: boolean;
  className?: string | ((props: { isActive: boolean }) => string);
  children: ReactNode;
  onClick?: () => void;
}

export function NavLink({ href, end, className, children, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  const resolvedClass = typeof className === 'function' ? className({ isActive }) : className;

  return (
    <Link href={href} className={resolvedClass} onClick={onClick}>
      {children}
    </Link>
  );
}
