import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CheckCircle2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types/product';
import { PrimeBadge } from './AmazonBadges';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  postalCode: string;
  onClose: () => void;
  onUpdateQty: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

const FREE_SHIPPING_THRESHOLD = 40;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  postalCode,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) => {
  const [orderPlacedId, setOrderPlacedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckout = () => {
    const orderNum = `SG-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderPlacedId(orderNum);
    onClearCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] bg-white h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#131921] text-white flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold">Shopping Cart</h2>
            <p className="text-[12px] text-[#cccccc]">
              Delivering to Singapore {postalCode}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOrderPlacedId(null);
              onClose();
            }}
            aria-label="Close cart"
            className="p-1.5 rounded hover:bg-white/10 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Confirmation State */}
        {orderPlacedId ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-[#067d62]" />
            <div>
              <h3 className="text-[18px] font-bold text-[#0f1111]">
                Order Confirmed — {orderPlacedId}
              </h3>
              <p className="text-[13px] text-[#565959] mt-1">
                Preparing shipment for delivery to Singapore {postalCode}. Estimated arrival: Thu, 21 Nov.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOrderPlacedId(null);
                onClose();
              }}
              className="px-6 py-2 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-[13px] font-medium text-[#0f1111]"
            >
              Continue shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-[#888c8c] stroke-[1.5]" />
            <h3 className="text-[16px] font-bold text-[#0f1111]">
              Your Amazon.sg Cart is empty
            </h3>
            <p className="text-[13px] text-[#565959]">
              Browse iPhone Duo Cases and click &ldquo;Add to cart&rdquo; to build your order.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-5 py-2 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-[13px] font-medium text-[#0f1111]"
            >
              Back to search results
            </button>
          </div>
        ) : (
          <>
            {/* Free Shipping Progress */}
            <div className="px-5 py-3 bg-[#f7fafa] border-b border-[#e7e7e7]">
              {remainingForFree === 0 ? (
                <p className="text-[12px] text-[#067d62] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Your order qualifies for FREE Delivery in Singapore!
                </p>
              ) : (
                <p className="text-[12px] text-[#0f1111]">
                  Add <strong className="tabular-nums">S${remainingForFree.toFixed(2)}</strong> more of eligible items for{' '}
                  <strong>FREE Delivery</strong>
                </p>
              )}
              <div className="w-full h-1.5 bg-[#e7e7e7] rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-[#067d62] transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#e7e7e7] px-5">
              {items.map((item, idx) => (
                <div key={`${item.product.id}-${item.selectedColor.name}-${item.selectedModel}`} className="py-4 flex gap-3.5">
                  <div className="w-[82px] h-[82px] bg-[#f7f7f7] rounded-[4px] p-1.5 shrink-0 flex items-center justify-center">
                    <img
                      src={item.selectedColor.image || item.product.image}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-medium text-[#0f1111] line-clamp-2 leading-snug">
                      {item.product.title}
                    </h3>
                    <p className="text-[12px] text-[#565959] mt-0.5">
                      {item.selectedModel} · {item.selectedColor.name}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[15px] font-bold text-[#0f1111] tabular-nums">
                        S${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      {item.product.isPrime && <PrimeBadge />}
                    </div>

                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="inline-flex items-center border border-[#d5d9d9] rounded-full bg-[#f0f2f2]">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(idx, -1)}
                          aria-label="Decrease quantity"
                          className="p-1.5 text-[#0f1111] hover:bg-[#e3e6e6] rounded-l-full"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-[13px] font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(idx, 1)}
                          aria-label="Increase quantity"
                          className="p-1.5 text-[#0f1111] hover:bg-[#e3e6e6] rounded-r-full"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(idx)}
                        className="inline-flex items-center gap-1 text-[12px] text-[#007185] hover:text-[#c7511f] hover:underline"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Checkout */}
            <div className="p-5 border-t border-[#e7e7e7] bg-[#fafafa] space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] text-[#0f1111]">
                  Subtotal ({totalCount} {totalCount === 1 ? 'item' : 'items'}):
                </span>
                <span className="text-[19px] font-bold text-[#0f1111] tabular-nums">
                  S${subtotal.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-2.5 px-4 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-[14px] font-medium text-[#0f1111] transition-colors"
              >
                Proceed to checkout
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3 px-5 rounded-full bg-[#ffa41c] hover:bg-[#fa8900] border border-[#ff8f00] text-[15px] font-bold text-[#0f1111] transition-colors"
              >
                Buy Now with 1-Click
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
