import { AdminAuthLayout } from '@/components/layout/AdminAuthLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminAuthLayout>{children}</AdminAuthLayout>;
}
