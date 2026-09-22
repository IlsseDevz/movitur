import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-100 p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-primary-dark mb-4">{title}</h3>}
      {children}
    </div>
  );
}
