import React, { useState } from 'react';
import { X, ShieldCheck, Check, Truck } from 'lucide-react';
import { ColorVariant, Product } from '../types/product';
import { StarRating } from './StarRating';
import { MerchandisingTag, PriceDisplay, PrimeBadge } from './AmazonBadges';

interface ProductDetailModalProps {
  product: Product;
  initialColor: ColorVariant;
  postalCode: string;
  onClose: () => void;
  onAddToCart: (product: Product, color: ColorVariant, model: string, qty: number) => void;
  onBuyNow: (product: Product, color: ColorVariant, model: string, qty: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialColor,
  postalCode,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedColor, setSelectedColor] = useState<ColorVariant>(initialColor);
  const [selectedModel, setSelectedModel] = useState<string>(product.models[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const activeImage = selectedColor.image || product.image;

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedModel, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[8px] shadow-2xl max-w-[940px] w-full overflow-hidden border border-[#d5d9d9] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#f0f2f2] border-b border-[#d5d9d9]">
          <div className="text-[12px] text-[#565959] truncate">
            {product.department} &rsaquo; <span className="text-[#0f1111] font-medium">{product.brand}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="p-1 rounded hover:bg-[#e3e6e6] text-[#0f1111]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 lg:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[82vh] overflow-y-auto">
          {/* Left Image */}
          <div className="md:col-span-5 bg-[#f7f7f7] rounded-[6px] p-6 flex items-center justify-center min-h-[280px] relative">
            {product.badge && (
              <div className="absolute top-3 left-3">
                <MerchandisingTag badge={product.badge} />
              </div>
            )}
            <img
              src={activeImage}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[340px] object-contain"
            />
          </div>

          {/* Center Details */}
          <div className="md:col-span-4 space-y-3">
            <div>
              <span className="text-[13px] font-medium text-[#007185]">
                Visit the {product.brand} Store
              </span>
              <h2
                id="product-modal-title"
                className="text-[18px] font-medium text-[#0f1111] leading-snug mt-1"
              >
                {product.title}
              </h2>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 pb-2.5 border-b border-[#e7e7e7]">
              <span className="text-[14px] font-medium text-[#0f1111] tabular-nums">
                {product.rating.toFixed(1)}
              </span>
              <StarRating rating={product.rating} size="md" />
              <span className="text-[13px] text-[#007185] tabular-nums">
                {product.reviewCount.toLocaleString()} ratings
              </span>
            </div>

            {/* Price */}
            <div>
              <PriceDisplay price={product.price} listPrice={product.listPrice} size="lg" />
              <p className="text-[12px] text-[#565959] mt-0.5">All prices include GST.</p>
            </div>

            {/* Color Selector */}
            <div>
              <p className="text-[13px] text-[#565959] mb-1.5">
                Colour: <strong className="text-[#0f1111]">{selectedColor.name}</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => {
                  const active = selectedColor.name === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-2.5 py-1.5 rounded-[4px] border text-[12px] flex items-center gap-1.5 transition-colors ${
                        active
                          ? 'border-[#e77600] bg-[#fefaf6] font-semibold'
                          : 'border-[#d5d9d9] hover:border-[#0f1111]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model Selector */}
            <div>
              <p className="text-[13px] text-[#565959] mb-1.5">
                Size: <strong className="text-[#0f1111]">{selectedModel}</strong>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.models.map((model) => {
                  const active = selectedModel === model;
                  return (
                    <button
                      key={model}
                      type="button"
                      onClick={() => setSelectedModel(model)}
                      className={`px-2.5 py-1 rounded-[4px] border text-[12px] transition-colors ${
                        active
                          ? 'border-[#e77600] bg-[#fefaf6] font-semibold text-[#0f1111]'
                          : 'border-[#d5d9d9] text-[#0f1111] hover:border-[#0f1111]'
                      }`}
                    >
                      {model}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bulleted Specs */}
            <div className="pt-2 border-t border-[#e7e7e7]">
              <h3 className="text-[14px] font-bold text-[#0f1111] mb-1.5">About this item</h3>
              <ul className="list-disc pl-4 space-y-1 text-[13px] text-[#0f1111] leading-relaxed">
                {product.specs.map((spec, idx) => (
                  <li key={idx}>{spec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Purchase Box */}
          <div className="md:col-span-3">
            <div className="border border-[#d5d9d9] rounded-[8px] p-4 space-y-3 bg-white">
              <PriceDisplay price={product.price} size="lg" />

              {product.isPrime && <PrimeBadge />}

              <div className="text-[13px] text-[#0f1111] space-y-1">
                <p>
                  FREE delivery <strong>{product.deliveryDate}</strong> to Singapore{' '}
                  <span className="text-[#007185]">{postalCode}</span>
                </p>
                {product.fastestDelivery && (
                  <p className="text-[12px] text-[#565959]">
                    Or fastest delivery <strong className="text-[#0f1111]">{product.fastestDelivery}</strong>
                  </p>
                )}
              </div>

              <p className="text-[16px] font-medium text-[#007600]">In Stock</p>

              {/* Quantity */}
              <div className="flex items-center gap-2 text-[13px]">
                <label htmlFor="modal-qty" className="text-[#0f1111]">
                  Quantity:
                </label>
                <select
                  id="modal-qty"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-[#d5d9d9] bg-[#f0f2f2] rounded-[6px] px-2.5 py-1 text-[13px] focus:outline-none focus:border-[#007185]"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`w-full py-2 px-4 rounded-full text-[13px] font-medium border transition-colors ${
                    addedFeedback
                      ? 'bg-[#067d62] border-[#067d62] text-white'
                      : 'bg-[#ffd814] hover:bg-[#f7ca00] border-[#fcd200] text-[#0f1111]'
                  }`}
                >
                  {addedFeedback ? (
                    <span className="inline-flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" /> Added to Cart
                    </span>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onBuyNow(product, selectedColor, selectedModel, quantity)}
                  className="w-full py-2 px-4 rounded-full text-[13px] font-medium bg-[#ffa41c] hover:bg-[#fa8900] border border-[#ff8f00] text-[#0f1111] transition-colors"
                >
                  Buy Now
                </button>
              </div>

              <div className="pt-2 border-t border-[#e7e7e7] text-[12px] text-[#565959] space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 shrink-0" />
                  <span>Ships from Amazon SG</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>15-day hassle-free returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
