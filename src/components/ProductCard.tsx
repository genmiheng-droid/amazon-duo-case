import React, { useState } from 'react';
import { Check, Smartphone } from 'lucide-react';
import { ColorVariant, Product } from '../types/product';
import { StarRating } from './StarRating';
import { MerchandisingTag, PriceDisplay, PrimeBadge } from './AmazonBadges';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onSelectProduct: (product: Product, color: ColorVariant) => void;
  onAddToCart: (product: Product, color: ColorVariant) => void;
  onBuyNow: (product: Product, color: ColorVariant, voucherApplied: boolean) => void;
  postalCode: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  postalCode,
}) => {
  const [selectedColor, setSelectedColor] = useState<ColorVariant>(product.colors[0]);
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [justBought, setJustBought] = useState(false);
  const [imgError, setImgError] = useState(false);

  const activeImage = selectedColor.image || product.image;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedColor);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleOneClickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow(product, selectedColor, voucherApplied);
    setJustBought(true);
    setTimeout(() => setJustBought(false), 1600);
  };

  const savingsPercent =
    product.listPrice && product.listPrice > product.price
      ? Math.round(((product.listPrice - product.price) / product.listPrice) * 100)
      : null;

  if (viewMode === 'list') {
    return (
      <article className="border border-[#e7e7e7] rounded-[4px] bg-white hover:border-[#d5d9d9] transition-colors flex flex-col sm:flex-row overflow-hidden">
        {/* Image Box */}
        <button
          type="button"
          onClick={() => onSelectProduct(product, selectedColor)}
          className="sm:w-[240px] lg:w-[260px] shrink-0 bg-[#f7f7f7] p-5 flex items-center justify-center relative group focus:outline-none"
        >
          {product.badge && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <MerchandisingTag badge={product.badge} />
            </div>
          )}
          {!imgError ? (
            <img
              src={activeImage}
              alt={product.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-[200px] object-contain group-hover:scale-[1.03] transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-[200px] flex flex-col items-center justify-center text-[#565959] gap-2">
              <Smartphone className="w-10 h-10 stroke-[1.4]" />
              <span className="text-[12px] font-medium">{product.brand} Duo Case</span>
            </div>
          )}
        </button>

        {/* Details */}
        <div className="flex-1 p-4 flex flex-col justify-between gap-2">
          <div>
            <div className="text-[12px] text-[#565959] font-medium mb-0.5">{product.brand}</div>
            <h2 className="text-[16px] leading-[1.35] font-medium text-[#0f1111]">
              <button
                type="button"
                onClick={() => onSelectProduct(product, selectedColor)}
                className="text-left hover:text-[#c7511f] transition-colors"
              >
                {product.title}
              </button>
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <button
                type="button"
                onClick={() => onSelectProduct(product, selectedColor)}
                className="inline-flex items-center gap-1 hover:opacity-80"
              >
                <span className="text-[13px] font-medium text-[#0f1111] tabular-nums">
                  {product.rating.toFixed(1)}
                </span>
                <StarRating rating={product.rating} size="sm" />
              </button>
              <span className="text-[13px] text-[#007185] hover:text-[#c7511f] tabular-nums">
                ({product.reviewCount.toLocaleString()})
              </span>
            </div>

            <p className="text-[12px] text-[#565959] mt-0.5">{product.boughtLastMonth}</p>

            {/* Color Swatches */}
            <div className="flex items-center gap-2 mt-2.5">
              {product.colors.map((color) => {
                const isSelected = selectedColor.name === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    title={color.name}
                    aria-label={`Select colour ${color.name}`}
                    onClick={() => setSelectedColor(color)}
                    className={`w-[18px] h-[18px] rounded-full border transition-all ${
                      isSelected
                        ? 'ring-2 ring-[#007185] ring-offset-1 border-[#0f1111]'
                        : 'border-[#bbbfbf] hover:border-[#0f1111]'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
              <span className="text-[12px] text-[#565959] ml-1">{selectedColor.name}</span>
            </div>

            {/* Price & Voucher */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <PriceDisplay price={product.price} listPrice={product.listPrice} />
              {savingsPercent && (
                <span className="text-[12px] text-[#cc0c39] font-medium">
                  Save {savingsPercent}%
                </span>
              )}
            </div>

            {product.voucherDiscountPercent && (
              <label className="inline-flex items-center gap-1.5 mt-1.5 cursor-pointer text-[12px]">
                <input
                  type="checkbox"
                  checked={voucherApplied}
                  onChange={(e) => setVoucherApplied(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#007185]"
                />
                <span className="bg-[#7fda69] text-[#0f1111] font-semibold px-1.5 py-0.5 rounded-[2px]">
                  Save {product.voucherDiscountPercent}%
                </span>
                <span className="text-[#0f1111]">
                  {voucherApplied ? 'Voucher applied' : 'with voucher'}
                </span>
              </label>
            )}

            {/* Delivery */}
            <div className="mt-2 space-y-0.5 text-[12px] text-[#0f1111]">
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.isPrime && <PrimeBadge />}
                <span>
                  FREE delivery <strong>{product.deliveryDate}</strong> to {postalCode}
                </span>
              </div>
              {product.fastestDelivery && (
                <p className="text-[#565959]">
                  Or fastest delivery <strong className="text-[#0f1111]">{product.fastestDelivery}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-3 flex flex-col sm:w-[200px] gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className={`w-full px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors whitespace-nowrap ${
                justAdded
                  ? 'bg-[#067d62] border-[#067d62] text-white'
                  : 'bg-[#ffd814] hover:bg-[#f7ca00] border-[#fcd200] text-[#0f1111]'
              }`}
            >
              {justAdded ? (
                <span className="inline-flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Added to cart
                </span>
              ) : (
                'Add to cart'
              )}
            </button>
            <button
              type="button"
              onClick={handleOneClickBuy}
              className={`w-full px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors whitespace-nowrap ${
                justBought
                  ? 'bg-[#067d62] border-[#067d62] text-white'
                  : 'bg-[#ffa41c] hover:bg-[#fa8900] border-[#ff8f00] text-[#0f1111]'
              }`}
            >
              {justBought ? (
                <span className="inline-flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Order placed
                </span>
              ) : (
                'Buy Now with 1-Click'
              )}
            </button>
            <button
              type="button"
              onClick={() => onSelectProduct(product, selectedColor)}
              className="w-full px-3.5 py-1.5 rounded-full text-[13px] font-medium bg-white hover:bg-[#f7fafa] border border-[#d5d9d9] text-[#0f1111] whitespace-nowrap"
            >
              See options
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="border border-[#e7e7e7] rounded-[4px] bg-white flex flex-col overflow-hidden hover:border-[#d5d9d9] transition-colors h-full">
      {/* Image Well */}
      <button
        type="button"
        onClick={() => onSelectProduct(product, selectedColor)}
        className="w-full aspect-square bg-[#f7f7f7] p-4 flex items-center justify-center relative group focus:outline-none overflow-hidden"
      >
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <MerchandisingTag badge={product.badge} />
          </div>
        )}
        {!imgError ? (
          <img
            src={activeImage}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#565959] gap-2">
            <Smartphone className="w-10 h-10 stroke-[1.4]" />
            <span className="text-[12px] font-medium">{product.brand} Duo Case</span>
          </div>
        )}
      </button>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <div className="text-[11px] font-medium text-[#565959] mb-0.5">{product.brand}</div>

          <h2 className="text-[14px] leading-[1.35] font-medium text-[#0f1111] line-clamp-3">
            <button
              type="button"
              onClick={() => onSelectProduct(product, selectedColor)}
              className="text-left hover:text-[#c7511f] transition-colors"
            >
              {product.title}
            </button>
          </h2>

          {/* Color Dots */}
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.map((color) => {
              const isSelected = selectedColor.name === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  title={color.name}
                  aria-label={`Select colour ${color.name}`}
                  onClick={() => setSelectedColor(color)}
                  className={`w-[16px] h-[16px] rounded-full border transition-all ${
                    isSelected
                      ? 'ring-2 ring-[#007185] ring-offset-1 border-[#0f1111]'
                      : 'border-[#bbbfbf] hover:border-[#0f1111]'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
            <span className="text-[11px] text-[#565959] truncate ml-0.5">
              {selectedColor.name}
            </span>
          </div>

          {/* Rating & Bought Count */}
          <div className="flex items-center gap-1 mt-2">
            <StarRating rating={product.rating} size="sm" />
            <button
              type="button"
              onClick={() => onSelectProduct(product, selectedColor)}
              className="text-[12px] text-[#007185] hover:text-[#c7511f] tabular-nums ml-0.5"
            >
              {product.reviewCount.toLocaleString()}
            </button>
          </div>
          <p className="text-[12px] text-[#565959] mt-0.5">{product.boughtLastMonth}</p>

          {/* Price */}
          <div className="mt-2">
            <PriceDisplay price={product.price} listPrice={product.listPrice} />
            {savingsPercent && (
              <p className="text-[12px] text-[#cc0c39] font-medium mt-0.5">
                Save {savingsPercent}%
              </p>
            )}
          </div>

          {/* Voucher */}
          {product.voucherDiscountPercent && (
            <label className="inline-flex items-center gap-1.5 mt-1.5 cursor-pointer text-[11px]">
              <input
                type="checkbox"
                checked={voucherApplied}
                onChange={(e) => setVoucherApplied(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#007185]"
              />
              <span className="bg-[#7fda69] text-[#0f1111] font-semibold px-1.5 py-0.5 rounded-[2px]">
                Save {product.voucherDiscountPercent}%
              </span>
              <span className="text-[#565959]">
                {voucherApplied ? 'Applied' : 'voucher'}
              </span>
            </label>
          )}

          {/* Delivery */}
          <div className="mt-2 text-[12px] leading-[1.35] text-[#0f1111]">
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.isPrime && <PrimeBadge />}
              <span>
                FREE delivery <strong>{product.deliveryDate}</strong>
              </span>
            </div>
            {!product.isPrime && product.freeShippingEligible && (
              <p className="text-[#565959] text-[11px] mt-0.5">
                FREE delivery on S$40+ orders shipped by Amazon
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart & 1-Click Buy */}
        <div className="pt-1 space-y-2">
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full py-1.5 px-3 rounded-full text-[13px] font-medium border transition-colors whitespace-nowrap ${
              justAdded
                ? 'bg-[#067d62] border-[#067d62] text-white'
                : 'bg-[#ffd814] hover:bg-[#f7ca00] border-[#fcd200] text-[#0f1111]'
            }`}
          >
            {justAdded ? (
              <span className="inline-flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5" /> Added to cart
              </span>
            ) : (
              'Add to cart'
            )}
          </button>
          <button
            type="button"
            onClick={handleOneClickBuy}
            className={`w-full py-1.5 px-3 rounded-full text-[13px] font-medium border transition-colors whitespace-nowrap ${
              justBought
                ? 'bg-[#067d62] border-[#067d62] text-white'
                : 'bg-[#ffa41c] hover:bg-[#fa8900] border-[#ff8f00] text-[#0f1111]'
            }`}
          >
            {justBought ? (
              <span className="inline-flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5" /> Order placed
              </span>
            ) : (
              'Buy Now with 1-Click'
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
