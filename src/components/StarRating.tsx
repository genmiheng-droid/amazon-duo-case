import React from 'react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, size = 'sm' }) => {
  const px = size === 'lg' ? 18 : size === 'md' ? 16 : 15;
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const effectiveFull = rating - fullStars >= 0.75 ? fullStars + 1 : fullStars;

  return (
    <span className="inline-flex items-center gap-[1px]" aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((idx) => {
        const isFull = idx < effectiveFull;
        const isHalf = idx === effectiveFull && hasHalf;
        const clipId = `half-star-${idx}-${Math.round(rating * 10)}`;

        return (
          <svg
            key={idx}
            width={px}
            height={px}
            viewBox="0 0 24 24"
            fill="none"
            className="shrink-0"
            aria-hidden="true"
          >
            {isHalf && (
              <defs>
                <linearGradient id={clipId}>
                  <stop offset="50%" stopColor="#ffa41c" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
            )}
            <path
              d="M12 2.25l2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.15l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95L12 2.25z"
              fill={isFull ? '#ffa41c' : isHalf ? `url(#${clipId})` : '#ffffff'}
              stroke="#de7921"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </span>
  );
};
