import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  currentPostalCode: string;
  onSelectPostalCode: (code: string) => void;
  onClose: () => void;
}

const PRESET_LOCATIONS = [
  { code: '018956', label: 'Marina Bay / Central Business District' },
  { code: '238839', label: 'Orchard Road / Tanglin' },
  { code: '529510', label: 'Tampines Regional Centre' },
  { code: '608526', label: 'Jurong East / Westgate' },
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  currentPostalCode,
  onSelectPostalCode,
  onClose,
}) => {
  const [customCode, setCustomCode] = useState(currentPostalCode);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = customCode.trim();
    if (!/^\d{6}$/.test(cleaned)) {
      setError('Please enter a valid 6-digit Singapore postal code.');
      return;
    }
    setError('');
    onSelectPostalCode(cleaned);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Choose your Singapore delivery location"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[8px] max-w-[390px] w-full overflow-hidden border border-[#d5d9d9] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3.5 bg-[#f0f2f2] border-b border-[#d5d9d9] flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-[#0f1111]">Choose your location</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close location modal"
            className="p-1 rounded hover:bg-[#e3e6e6] text-[#0f1111]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-[12px] text-[#565959] leading-relaxed">
            Delivery options and delivery speeds may vary for different Singapore districts.
          </p>

          <div className="space-y-2">
            {PRESET_LOCATIONS.map((loc) => (
              <button
                key={loc.code}
                type="button"
                onClick={() => {
                  onSelectPostalCode(loc.code);
                  onClose();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-[4px] border text-[13px] flex items-center gap-2.5 transition-colors ${
                  currentPostalCode === loc.code
                    ? 'border-[#e77600] bg-[#fefaf6] font-semibold'
                    : 'border-[#d5d9d9] hover:border-[#0f1111]'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#007185] shrink-0" />
                <div>
                  <div className="text-[#0f1111] tabular-nums">Singapore {loc.code}</div>
                  <div className="text-[11px] text-[#565959] font-normal">{loc.label}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-[#e7e7e7] pt-3">
            <form onSubmit={handleApply} className="space-y-2">
              <label htmlFor="sg-postal" className="block text-[12px] font-medium text-[#0f1111]">
                Or enter a Singapore postal code
              </label>
              <div className="flex gap-2">
                <input
                  id="sg-postal"
                  type="text"
                  maxLength={6}
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="e.g. 018956"
                  className="flex-1 h-[34px] px-3 border border-[#888c8c] rounded-[3px] text-[13px] tabular-nums focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]"
                />
                <button
                  type="submit"
                  className="h-[34px] px-4 rounded-[7px] bg-white hover:bg-[#f7fafa] border border-[#d5d9d9] text-[13px] font-medium text-[#0f1111]"
                >
                  Apply
                </button>
              </div>
              {error && <p className="text-[12px] text-[#c40000]">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
