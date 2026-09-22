interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'info' | 'warning';
}

const variants = {
  success: 'bg-green-100 text-green-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-primary/10 text-primary',
  warning: 'bg-yellow-100 text-yellow-700',
};

export function Badge({ children, variant = 'info' }: BadgeProps) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}
