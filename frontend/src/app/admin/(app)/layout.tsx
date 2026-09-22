'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminLayout } from '@/components/layout/AdminLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute role="ADMIN">
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
