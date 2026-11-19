import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, ShoppingCart, Menu, ChevronDown, X } from 'lucide-react';
import { DepartmentOption } from '../types/product';
import { SEARCH_SUGGESTIONS } from '../data/products';

interface AmazonHeaderProps {
  searchQuery: string;
  onSearchSubmit: (query: string) => void;
  selectedDepartment: DepartmentOption;
  onDepartmentChange: (dept: DepartmentOption) => void;
  cartCount: number;
  onOpenCart: () => void;
  postalCode: string;
  onOpenLocation: () => void;
  onResetHome: () => void;
  onOpenAllMenu: () => void;
  onQuickNavFilter: (action: 'prime' | 'bestsellers' | 'deals' | 'electronics' | 'mobiles') => void;
  activeQuickNav: string | null;
}

const DEPARTMENTS: DepartmentOption[] = [
  'All Departments',
  'Mobile Phone Cases',
  'Basic Cases',
  'Flip & Wallet Cases',
  'Heavy Duty Cases',
  'Bumper Cases',
];

export const AmazonHeader: React.FC<AmazonHeaderProps> = ({
  searchQuery,
  onSearchSubmit,
  selectedDepartment,
  onDepartmentChange,
  cartCount,
  onOpenCart,
  postalCode,
  onOpenLocation,
  onResetHome,
  onOpenAllMenu,
  onQuickNavFilter,
  activeQuickNav,
}) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showOrdersToast, setShowOrdersToast] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = SEARCH_SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(inputValue.trim().toLowerCase())
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearchSubmit(inputValue.trim() || 'iphone duo case');
  };

  return (
    <header className="w-full select-none z-30 relative">
      {/* Main Top Navigation Bar */}
      <div className="bg-[#131921] text-white px-3 lg:px-4 h-[60px] flex items-center gap-2 lg:gap-3">
        {/* Amazon.sg Logo */}
        <button
          type="button"
          onClick={onResetHome}
          className="flex items-start px-2 py-1.5 border border-transparent hover:border-white rounded-[2px] shrink-0 transition-colors"
          aria-label="Amazon.sg Home"
        >
          <span className="flex flex-col items-start leading-none">
            <span className="flex items-baseline">
              <span className="text-[21px] font-bold tracking-tight text-white">amazon</span>
              <span className="text-[13px] font-medium text-white ml-[1px]">.sg</span>
            </span>
            <svg width="78" height="10" viewBox="0 0 80 12" fill="none" className="-mt-[1px]" aria-hidden="true">
              <path
                d="M4 3C22 11 46 11.5 68 4.5"
                stroke="#ff9900"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M64 2L70 4L67.5 9.5"
                stroke="#ff9900"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {/* Deliver to Singapore */}
        <button
          type="button"
          onClick={onOpenLocation}
          className="hidden sm:flex items-end gap-1 px-2 py-1.5 border border-transparent hover:border-white rounded-[2px] shrink-0 text-left transition-colors"
        >
          <MapPin className="w-4 h-4 text-white mb-[2px] shrink-0" />
          <div className="leading-tight">
            <div className="text-[11px] text-[#cccccc] whitespace-nowrap">Delivering to Singapore {postalCode}</div>
            <div className="text-[13px] font-bold text-white whitespace-nowrap">Update location</div>
          </div>
        </button>

        {/* Search Bar */}
        <div ref={searchWrapperRef} className="flex-1 min-w-0 relative">
          <form
            onSubmit={handleFormSubmit}
            className="flex items-stretch h-[40px] rounded-[4px] overflow-hidden focus-within:ring-2 focus-within:ring-[#f90] bg-white"
          >
            <div className="hidden md:flex relative bg-[#e6e6e6] hover:bg-[#d4d4d4] border-r border-[#cdcdcd] transition-colors">
              <select
                aria-label="Search in department"
                value={selectedDepartment}
                onChange={(e) => onDepartmentChange(e.target.value as DepartmentOption)}
                className="appearance-none bg-transparent text-[#555555] hover:text-[#0f1111] text-[12px] pl-2.5 pr-6 h-full focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'All Departments' ? 'All' : dept}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#555555] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="flex-1 relative flex items-center bg-white">
              <input
                type="text"
                value={inputValue}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search Amazon.sg"
                aria-label="Search Amazon.sg"
                className="w-full h-full px-3 text-[14px] text-[#0f1111] placeholder-[#767676] focus:outline-none"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue('');
                    onSearchSubmit('');
                  }}
                  aria-label="Clear search"
                  className="p-1.5 text-[#767676] hover:text-[#0f1111]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              aria-label="Go"
              className="w-[45px] bg-[#febd69] hover:bg-[#f3a847] text-[#111111] flex items-center justify-center transition-colors shrink-0"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>
          </form>

          {/* Search Autocomplete Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-[41px] bg-white border border-[#d5d9d9] rounded-b-[4px] shadow-lg z-50 py-1">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setInputValue(suggestion);
                    setShowSuggestions(false);
                    onSearchSubmit(suggestion);
                  }}
                  className="w-full px-3 py-2 text-left text-[14px] text-[#0f1111] hover:bg-[#f0f2f2] flex items-center gap-2.5"
                >
                  <Search className="w-3.5 h-3.5 text-[#767676] shrink-0" />
                  <span className="truncate font-medium">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1 lg:gap-2 shrink-0">
          {/* Language / Region */}
          <button
            type="button"
            onClick={onOpenLocation}
            className="hidden xl:flex items-center gap-1 px-2 py-2 border border-transparent hover:border-white rounded-[2px]"
            aria-label="Language and Country: Singapore English"
          >
            <span className="inline-flex items-center justify-center w-5 h-3.5 rounded-[1px] overflow-hidden border border-white/30 bg-white relative">
              <span className="absolute top-0 left-0 right-0 h-1/2 bg-[#ef3340]" />
              <span className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
            </span>
            <span className="text-[13px] font-bold text-white">EN</span>
            <ChevronDown className="w-3 h-3 text-[#a7acb2]" />
          </button>

          {/* Account & Lists */}
          <div ref={accountRef} className="relative">
            <button
              type="button"
              onClick={() => setShowAccountMenu((prev) => !prev)}
              className="hidden sm:flex flex-col items-start px-2 py-1 border border-transparent hover:border-white rounded-[2px] text-left leading-tight"
            >
              <span className="text-[11px] text-[#cccccc] whitespace-nowrap">Hello, sign in</span>
              <span className="text-[13px] font-bold text-white flex items-center gap-0.5 whitespace-nowrap">
                Account &amp; Lists
                <ChevronDown className="w-3 h-3 text-[#a7acb2]" />
              </span>
            </button>

            {showAccountMenu && (
              <div className="absolute right-0 top-[48px] w-[260px] bg-white text-[#0f1111] border border-[#d5d9d9] rounded-[4px] shadow-xl p-4 z-50">
                <button
                  type="button"
                  onClick={() => setShowAccountMenu(false)}
                  className="w-full py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-[8px] text-[13px] font-medium text-[#0f1111] shadow-xs"
                >
                  Sign in to Amazon.sg
                </button>
                <p className="text-[11px] text-[#565959] text-center mt-2 pb-3 border-b border-[#e7e7e7]">
                  New customer? <span className="text-[#007185] hover:underline cursor-pointer">Start here.</span>
                </p>
                <div className="pt-3 grid grid-cols-1 gap-1.5 text-[13px]">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountMenu(false);
                      onQuickNavFilter('prime');
                    }}
                    className="text-left hover:text-[#c7511f] hover:underline"
                  >
                    Your Prime Membership
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountMenu(false);
                      onOpenCart();
                    }}
                    className="text-left hover:text-[#c7511f] hover:underline"
                  >
                    Shopping Cart ({cartCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountMenu(false);
                      onOpenLocation();
                    }}
                    className="text-left hover:text-[#c7511f] hover:underline"
                  >
                    Singapore Delivery Addresses
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Returns & Orders */}
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => {
                setShowOrdersToast(true);
                setTimeout(() => setShowOrdersToast(false), 3000);
              }}
              className="flex flex-col items-start px-2 py-1 border border-transparent hover:border-white rounded-[2px] text-left leading-tight"
            >
              <span className="text-[11px] text-[#cccccc] whitespace-nowrap">Returns</span>
              <span className="text-[13px] font-bold text-white whitespace-nowrap">&amp; Orders</span>
            </button>
            {showOrdersToast && (
              <div className="absolute right-0 top-[48px] w-[240px] bg-white text-[#0f1111] border border-[#d5d9d9] rounded-[4px] shadow-lg p-3 text-[12px] z-50">
                <p className="font-semibold mb-1">Recent Orders</p>
                <p className="text-[#565959]">Sign in to track your Amazon.sg packages or initiate a 15-day return.</p>
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-end gap-1 px-2 py-1.5 border border-transparent hover:border-white rounded-[2px] relative"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <div className="relative flex items-center">
              <ShoppingCart className="w-7 h-7 text-white stroke-[1.75]" />
              <span className="absolute -top-1.5 left-[11px] min-w-[18px] text-center text-[14px] font-bold text-[#f08804] bg-[#131921] px-0.5 leading-none tabular-nums">
                {cartCount}
              </span>
            </div>
            <span className="hidden sm:inline text-[13px] font-bold text-white mb-[1px]">Cart</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Bar */}
      <nav
        aria-label="Primary categories"
        className="bg-[#232f3e] text-white px-3 lg:px-4 h-[39px] flex items-center gap-1 overflow-x-auto no-scrollbar text-[13px]"
      >
        <button
          type="button"
          onClick={onOpenAllMenu}
          className="flex items-center gap-1 px-2 py-1.5 font-bold border border-transparent hover:border-white rounded-[2px] whitespace-nowrap shrink-0"
        >
          <Menu className="w-4 h-4" />
          <span>All</span>
        </button>

        {[
          { id: 'prime', label: 'Prime' },
          { id: 'bestsellers', label: 'Best Sellers' },
          { id: 'deals', label: "Today's Deals" },
          { id: 'electronics', label: 'Electronics' },
          { id: 'mobiles', label: 'Mobiles' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              onQuickNavFilter(item.id as 'prime' | 'bestsellers' | 'deals' | 'electronics' | 'mobiles')
            }
            className={`px-2 py-1.5 border rounded-[2px] whitespace-nowrap shrink-0 transition-colors ${
              activeQuickNav === item.id
                ? 'border-white bg-white/10 font-semibold'
                : 'border-transparent hover:border-white'
            }`}
          >
            {item.label}
          </button>
        ))}

        <button
          type="button"
          onClick={onResetHome}
          className="px-2 py-1.5 border border-transparent hover:border-white rounded-[2px] whitespace-nowrap shrink-0"
        >
          Fresh
        </button>
        <button
          type="button"
          onClick={onOpenLocation}
          className="px-2 py-1.5 border border-transparent hover:border-white rounded-[2px] whitespace-nowrap shrink-0"
        >
          Customer Service
        </button>
        <button
          type="button"
          onClick={onResetHome}
          className="px-2 py-1.5 border border-transparent hover:border-white rounded-[2px] whitespace-nowrap shrink-0"
        >
          Gift Cards
        </button>
      </nav>
    </header>
  );
};
