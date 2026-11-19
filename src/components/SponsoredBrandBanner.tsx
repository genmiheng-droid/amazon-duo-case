import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ColorVariant, Product } from '../types/product';
import { StarRating } from './StarRating';

interface SponsoredBrandBannerProps {
  products: Product[];
  onFilterBrand: (brand: string) => void;
  onSelectProduct: (product: Product, color: ColorVariant) => void;
}

export const SponsoredBrandBanner: React.FC<SponsoredBrandBannerProps> = ({
  products,
  onFilterBrand,
  onSelectProduct,
}) => {
  const featured = products.slice(0, 3);

  return (
    <section
      aria-label="Sponsored brand showcase"
      className="border border-[#e7e7e7] rounded-[4px] bg-[#fafafa] p-3.5 lg:p-4 mb-5"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Brand Intro */}
        <div className="lg:w-[230px] shrink-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#565959]">Sponsored</span>
            <span className="text-[#d5d9d9]" aria-hidden="true">·</span>
            <span className="text-[12px] font-bold tracking-tight text-[#0f1111]">
              SPIGEN OFFICIAL
            </span>
          </div>
          <h3 className="text-[16px] font-bold text-[#0f1111] leading-snug">
            Dual-Layer MagFit Protection for iPhone 16 Series
          </h3>
          <button
            type="button"
            onClick={() => onFilterBrand('Spigen')}
            className="inline-flex items-center text-[13px] font-medium text-[#007185] hover:text-[#c7511f] hover:underline pt-0.5"
          >
            Shop Spigen Duo Cases
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        {/* 3 Mini Product Previews */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {featured.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectProduct(item, item.colors[0])}
              className="flex items-center gap-3 bg-white border border-[#e7e7e7] hover:border-[#007185] rounded-[4px] p-2.5 text-left transition-colors group"
            >
              <div className="w-[68px] h-[68px] bg-[#f7f7f7] rounded-[3px] p-1.5 shrink-0 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-[#0f1111] line-clamp-2 group-hover:text-[#c7511f]">
                  {item.title}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <StarRating rating={item.rating} size="sm" />
                  <span className="text-[11px] text-[#007185] tabular-nums">
                    ({item.reviewCount.toLocaleString()})
                  </span>
                </div>
                <p className="text-[13px] font-bold text-[#0f1111] mt-0.5 tabular-nums">
                  S${item.price.toFixed(2)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
