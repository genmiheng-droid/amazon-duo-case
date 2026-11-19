import React from 'react';

export const PrimeBadge: React.FC = () => (
  <span className="inline-flex items-center select-none whitespace-nowrap" aria-label="Amazon Prime">
    <svg width="13" height="12" viewBox="0 0 16 14" fill="none" className="mr-0.5" aria-hidden="true">
      <path
        d="M2 7.5L6 11.5L14 2.5"
        stroke="#ff9900"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="text-[13px] font-bold tracking-tight text-[#00a8e1]">prime</span>
  </span>
);

interface PriceDisplayProps {
  price: number;
  listPrice?: number;
  size?: 'md' | 'lg';
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, listPrice, size = 'md' }) => {
  const whole = Math.floor(price);
  const cents = Math.round((price - whole) * 100)
    .toString()
    .padStart(2, '0');

  const wholeSize = size === 'lg' ? 'text-[28px]' : 'text-[22px]';

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 tabular-nums">
      <span className="inline-flex items-start text-[#0f1111] leading-none">
        <span className="text-[12px] font-medium mt-[2px] mr-[1px]">S$</span>
        <span className={`${wholeSize} font-medium tracking-tight`}>{whole}</span>
        <span className="text-[12px] font-medium mt-[2px]">{cents}</span>
      </span>
      {listPrice && listPrice > price && (
        <span className="text-[12px] text-[#565959]">
          List: <span className="line-through">S${listPrice.toFixed(2)}</span>
        </span>
      )}
    </div>
  );
};

interface MerchandisingTagProps {
  badge?: 'Overall Pick' | 'Best Seller' | 'Limited time deal';
}

export const MerchandisingTag: React.FC<MerchandisingTagProps> = ({ badge }) => {
  if (!badge) return null;

  if (badge === 'Best Seller') {
    return (
      <span className="inline-block bg-[#e67a00] text-white text-[11px] font-semibold px-2 py-0.5 rounded-[2px] leading-tight whitespace-nowrap">
        Best Seller
      </span>
    );
  }

  if (badge === 'Overall Pick') {
    return (
      <span className="inline-block bg-[#232f3e] text-white text-[11px] font-semibold px-2 py-0.5 rounded-[2px] leading-tight whitespace-nowrap">
        Amazon&apos;s <span className="text-[#ff9900]">Choice</span>
      </span>
    );
  }

  return (
    <span className="inline-block bg-[#cc0c39] text-white text-[11px] font-semibold px-2 py-0.5 rounded-[2px] leading-tight whitespace-nowrap">
      Limited time deal
    </span>
  );
};
