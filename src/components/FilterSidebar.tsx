import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { DepartmentOption, FilterState } from '../types/product';
import { StarRating } from './StarRating';
import { PrimeBadge } from './AmazonBadges';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

const DEPARTMENTS: DepartmentOption[] = [
  'Mobile Phone Cases',
  'Basic Cases',
  'Flip & Wallet Cases',
  'Heavy Duty Cases',
  'Bumper Cases',
];

const BRANDS = ['Spigen', 'TORRAS', 'OtterBox', 'CASETiFY', 'ESR', 'Ringke', 'UAG', 'JETech'];

const PHONE_MODELS = [
  'iPhone 16 Pro Max',
  'iPhone 16 Pro',
  'iPhone 16',
  'iPhone 15 Pro Max',
  'iPhone 15 Pro',
  'iPhone 14',
];

const FEATURES = [
  'MagSafe Compatible',
  'Dual-Layer Protection',
  'Built-in Kickstand',
  'Clear / Anti-Yellowing',
  'Detachable Wallet',
];

const COLOR_SWATCHES = [
  { name: 'Black', hex: '#18181b' },
  { name: 'Clear', hex: '#e5e7eb' },
  { name: 'Navy', hex: '#1e3a5f' },
  { name: 'Titanium', hex: '#787772' },
  { name: 'Pine', hex: '#2d5342' },
  { name: 'Tan', hex: '#9a5428' },
  { name: 'Smoke', hex: '#4b5563' },
];

const PRICE_RANGES: { label: string; min: number | null; max: number | null }[] = [
  { label: 'Under S$25', min: null, max: 25 },
  { label: 'S$25 to S$50', min: 25, max: 50 },
  { label: 'S$50 to S$75', min: 50, max: 75 },
  { label: 'S$75 & Above', min: 75, max: null },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onClearAll,
  hasActiveFilters,
}) => {
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');

  const toggleArrayItem = (key: 'selectedBrands' | 'selectedModels' | 'selectedFeatures', item: string) => {
    const current = filters[key];
    const next = current.includes(item)
      ? current.filter((v) => v !== item)
      : [...current, item];
    onChange({ [key]: next });
  };

  const handleCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = minInput.trim() ? Number(minInput) : null;
    const maxVal = maxInput.trim() ? Number(maxInput) : null;
    onChange({ priceRange: [minVal, maxVal] });
  };

  return (
    <aside aria-label="Search filters" className="text-[13px] text-[#0f1111] space-y-5">
      {hasActiveFilters && (
        <div className="pb-3 border-b border-[#e7e7e7]">
          <button
            type="button"
            onClick={() => {
              setMinInput('');
              setMaxInput('');
              onClearAll();
            }}
            className="text-[12px] text-[#007185] hover:text-[#c7511f] hover:underline font-medium"
          >
            &lsaquo; Clear all filters
          </button>
        </div>
      )}

      {/* Delivery */}
      <div>
        <h3 className="font-bold text-[14px] mb-2">Delivery</h3>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.primeOnly}
              onChange={(e) => onChange({ primeOnly: e.target.checked })}
              className="w-4 h-4 rounded-[2px] accent-[#007185] cursor-pointer"
            />
            <PrimeBadge />
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.freeShippingOnly}
              onChange={(e) => onChange({ freeShippingOnly: e.target.checked })}
              className="w-4 h-4 rounded-[2px] accent-[#007185] cursor-pointer"
            />
            <span className="group-hover:text-[#c7511f]">Free Shipping by Amazon</span>
          </label>
        </div>
      </div>

      {/* Department */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Department</h3>
        <ul className="space-y-1">
          {filters.department !== 'All Departments' && (
            <li>
              <button
                type="button"
                onClick={() => onChange({ department: 'All Departments' })}
                className="text-[#0f1111] hover:text-[#c7511f] text-left flex items-center gap-1"
              >
                <span>&lsaquo;</span>
                <span>All Departments</span>
              </button>
            </li>
          )}
          {DEPARTMENTS.map((dept) => {
            const active = filters.department === dept;
            return (
              <li key={dept} className={filters.department !== 'All Departments' ? 'pl-3' : ''}>
                <button
                  type="button"
                  onClick={() =>
                    onChange({ department: active ? 'All Departments' : dept })
                  }
                  className={`text-left hover:text-[#c7511f] transition-colors ${
                    active ? 'font-bold text-[#0f1111]' : 'text-[#0f1111]'
                  }`}
                >
                  {dept}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Customer Reviews */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Customer Reviews</h3>
        <div className="space-y-1">
          {[4, 3, 2, 1].map((stars) => {
            const active = filters.minRating === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() => onChange({ minRating: active ? null : stars })}
                className={`flex items-center gap-1.5 w-full text-left py-0.5 hover:text-[#c7511f] ${
                  active ? 'font-bold' : ''
                }`}
              >
                <StarRating rating={stars} size="sm" />
                <span className="text-[12px]">&amp; Up</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Brands</h3>
        <div className="space-y-1.5">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.selectedBrands.includes(brand)}
                onChange={() => toggleArrayItem('selectedBrands', brand)}
                className="w-4 h-4 rounded-[2px] accent-[#007185] cursor-pointer"
              />
              <span className="group-hover:text-[#c7511f]">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Price</h3>
        <ul className="space-y-1 mb-2.5">
          {PRICE_RANGES.map((range) => {
            const active =
              filters.priceRange[0] === range.min && filters.priceRange[1] === range.max;
            return (
              <li key={range.label}>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      priceRange: active ? [null, null] : [range.min, range.max],
                    })
                  }
                  className={`text-left hover:text-[#c7511f] ${
                    active ? 'font-bold text-[#0f1111]' : 'text-[#0f1111]'
                  }`}
                >
                  {range.label}
                </button>
              </li>
            );
          })}
        </ul>
        <form onSubmit={handleCustomPrice} className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-[#565959]">S$</span>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              className="w-full h-[30px] pl-6 pr-1.5 border border-[#888c8c] rounded-[3px] text-[12px] focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]"
            />
          </div>
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-[#565959]">S$</span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              className="w-full h-[30px] pl-6 pr-1.5 border border-[#888c8c] rounded-[3px] text-[12px] focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]"
            />
          </div>
          <button
            type="submit"
            className="h-[30px] px-2.5 bg-white hover:bg-[#f7fafa] border border-[#d5d9d9] rounded-[7px] text-[12px] shadow-2xs"
          >
            Go
          </button>
        </form>
      </div>

      {/* Compatible Phone Models */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Compatible Phone Models</h3>
        <div className="space-y-1.5">
          {PHONE_MODELS.map((model) => (
            <label key={model} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.selectedModels.includes(model)}
                onChange={() => toggleArrayItem('selectedModels', model)}
                className="w-4 h-4 rounded-[2px] accent-[#007185] cursor-pointer"
              />
              <span className="group-hover:text-[#c7511f]">{model}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Case Features */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Case Features</h3>
        <div className="space-y-1.5">
          {FEATURES.map((feat) => (
            <label key={feat} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.selectedFeatures.includes(feat)}
                onChange={() => toggleArrayItem('selectedFeatures', feat)}
                className="w-4 h-4 rounded-[2px] accent-[#007185] cursor-pointer"
              />
              <span className="group-hover:text-[#c7511f]">{feat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colour */}
      <div>
        <h3 className="font-bold text-[14px] mb-2">Colour</h3>
        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((swatch) => {
            const active = filters.selectedColor === swatch.name;
            return (
              <button
                key={swatch.name}
                type="button"
                title={swatch.name}
                aria-label={`Filter by colour ${swatch.name}`}
                onClick={() =>
                  onChange({ selectedColor: active ? null : swatch.name })
                }
                className={`w-6 h-6 rounded-[3px] border flex items-center justify-center transition-all ${
                  active
                    ? 'border-[#007185] ring-2 ring-[#007185] ring-offset-1'
                    : 'border-[#bbbfbf] hover:border-[#0f1111]'
                }`}
                style={{ backgroundColor: swatch.hex }}
              >
                {active && (
                  <Check
                    className={`w-3.5 h-3.5 ${
                      swatch.name === 'Clear' ? 'text-[#0f1111]' : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
