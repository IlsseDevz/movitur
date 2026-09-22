import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-lg gap-0.5',
  md: 'text-2xl gap-1',
  lg: 'text-3xl gap-1',
};

export function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  const display = hover || value;

  return (
    <div
      className={`inline-flex items-center ${sizeClasses[size]}`}
      onMouseLeave={() => !readonly && setHover(0)}
      role={readonly ? 'img' : 'radiogroup'}
      aria-label={`Classificacao: ${value} de 5 estrelas`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            className={`transition-colors ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            } ${filled ? 'text-amber-400' : 'text-gray-300'}`}
            aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export function renderStars(estrelas: number, size: 'sm' | 'md' = 'sm') {
  return <StarRating value={estrelas} readonly size={size} />;
}
