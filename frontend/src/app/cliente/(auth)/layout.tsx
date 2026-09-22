import { ClienteAuthLayout } from '@/components/layout/ClienteAuthLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClienteAuthLayout>{children}</ClienteAuthLayout>;
}
