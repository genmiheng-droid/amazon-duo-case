import React, { useMemo, useState } from 'react';
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { PRODUCTS, RELATED_SEARCHES } from './data/products';
import {
  CartItem,
  ColorVariant,
  DepartmentOption,
  FilterState,
  Product,
  SortOption,
} from './types/product';
import { AmazonHeader } from './components/AmazonHeader';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductCard } from './components/ProductCard';
import { SponsoredBrandBanner } from './components/SponsoredBrandBanner';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { LocationModal } from './components/LocationModal';
import { AmazonFooter } from './components/AmazonFooter';

const INITIAL_FILTERS: FilterState = {
  query: 'iphone duo case',
  department: 'All Departments',
  primeOnly: false,
  freeShippingOnly: false,
  minRating: null,
  selectedBrands: [],
  priceRange: [null, null],
  selectedModels: [],
  selectedFeatures: [],
  selectedColor: null,
};

const PAGE_SIZE = 12;

export default function App() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeQuickNav, setActiveQuickNav] = useState<string | null>(null);

  const [postalCode, setPostalCode] = useState<string>('018956');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isAllMenuOpen, setIsAllMenuOpen] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<{
    product: Product;
    color: ColorVariant;
  } | null>(null);
  const [expressOrderBanner, setExpressOrderBanner] = useState<string | null>(null);

  const updateFilters = (patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSortBy('featured');
    setActiveQuickNav(null);
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.department !== 'All Departments' ||
      filters.primeOnly ||
      filters.freeShippingOnly ||
      filters.minRating !== null ||
      filters.selectedBrands.length > 0 ||
      filters.priceRange[0] !== null ||
      filters.priceRange[1] !== null ||
      filters.selectedModels.length > 0 ||
      filters.selectedFeatures.length > 0 ||
      filters.selectedColor !== null
    );
  }, [filters]);

  const filteredAndSortedProducts = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const genericDefault = q === '' || q === 'iphone duo case';

    const list = PRODUCTS.filter((p) => {
      if (!genericDefault) {
        const tokens = q.split(/\s+/).filter(Boolean);
        const searchable = `${p.brand} ${p.title} ${p.department} ${p.models.join(' ')} ${p.features.join(' ')}`.toLowerCase();
        const matchesQuery = tokens.every((tok) => searchable.includes(tok));
        if (!matchesQuery) return false;
      }

      if (filters.department !== 'All Departments' && p.department !== filters.department) {
        return false;
      }
      if (filters.primeOnly && !p.isPrime) return false;
      if (filters.freeShippingOnly && !p.freeShippingEligible) return false;
      if (filters.minRating !== null && p.rating < filters.minRating) return false;
      if (
        filters.selectedBrands.length > 0 &&
        !filters.selectedBrands.includes(p.brand)
      ) {
        return false;
      }
      const [minPrice, maxPrice] = filters.priceRange;
      if (minPrice !== null && p.price < minPrice) return false;
      if (maxPrice !== null && p.price > maxPrice) return false;

      if (
        filters.selectedModels.length > 0 &&
        !filters.selectedModels.some((m) => p.models.includes(m))
      ) {
        return false;
      }
      if (
        filters.selectedFeatures.length > 0 &&
        !filters.selectedFeatures.every((f) => p.features.includes(f))
      ) {
        return false;
      }
      if (filters.selectedColor) {
        const target = filters.selectedColor.toLowerCase();
        const hasColor = p.colors.some((c) => c.name.toLowerCase().includes(target));
        if (!hasColor) return false;
      }
      return true;
    });

    const sorted = [...list];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        sorted.sort((a, b) => b.releaseOrder - a.releaseOrder);
        break;
      case 'featured':
      default:
        sorted.sort((a, b) => a.releaseOrder - b.releaseOrder);
        break;
    }

    return sorted;
  }, [filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const addToCart = (
    product: Product,
    color: ColorVariant,
    model = product.models[0],
    qty = 1
  ) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor.name === color.name &&
          item.selectedModel === model
      );
      if (idx > -1) {
        return prev.map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { product, selectedColor: color, selectedModel: model, quantity: qty }];
    });
  };

  const handleBuyNow = (
    product: Product,
    color: ColorVariant,
    model: string,
    qty: number
  ) => {
    setSelectedDetail(null);
    const total = (product.price * qty).toFixed(2);
    setExpressOrderBanner(
      `Express Order Confirmed: ${qty}× ${product.brand} (${model}, ${color.name}) — S$${total} arriving ${product.deliveryDate} to Singapore ${postalCode}.`
    );
    setTimeout(() => setExpressOrderBanner(null), 6000);
  };

  const handleQuickNavFilter = (
    action: 'prime' | 'bestsellers' | 'deals' | 'electronics' | 'mobiles'
  ) => {
    if (activeQuickNav === action) {
      resetAllFilters();
      return;
    }
    setActiveQuickNav(action);
    setCurrentPage(1);
    if (action === 'prime') {
      setFilters({ ...INITIAL_FILTERS, primeOnly: true });
    } else if (action === 'bestsellers') {
      setFilters(INITIAL_FILTERS);
      setSortBy('rating-desc');
    } else if (action === 'deals') {
      setFilters({ ...INITIAL_FILTERS, priceRange: [null, 45] });
    } else if (action === 'electronics') {
      setFilters({ ...INITIAL_FILTERS, department: 'Mobile Phone Cases' });
    } else if (action === 'mobiles') {
      setFilters({ ...INITIAL_FILTERS, selectedModels: ['iPhone 16 Pro Max', 'iPhone 16 Pro'] });
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const startIdx = filteredAndSortedProducts.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(safePage * PAGE_SIZE, filteredAndSortedProducts.length);

  const spigenShowcase = PRODUCTS.filter((p) => p.brand === 'Spigen').concat(
    PRODUCTS.filter((p) => p.id === 'p5')
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0f1111]">
      <AmazonHeader
        searchQuery={filters.query}
        onSearchSubmit={(query) => updateFilters({ query })}
        selectedDepartment={filters.department}
        onDepartmentChange={(department: DepartmentOption) => updateFilters({ department })}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        postalCode={postalCode}
        onOpenLocation={() => setIsLocationOpen(true)}
        onResetHome={resetAllFilters}
        onOpenAllMenu={() => setIsAllMenuOpen(true)}
        onQuickNavFilter={handleQuickNavFilter}
        activeQuickNav={activeQuickNav}
      />

      {/* Express Buy-Now Notification */}
      {expressOrderBanner && (
        <div className="bg-[#f0f9f4] border-b border-[#067d62]/30 px-4 py-2.5 text-[13px] text-[#0f1111] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#067d62] shrink-0" />
            <span>{expressOrderBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setExpressOrderBanner(null)}
            className="text-[#565959] hover:text-[#0f1111]"
            aria-label="Dismiss order confirmation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Result Status Bar */}
      <div className="border-b border-[#e7e7e7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1500px] mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[14px]">
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#d5d9d9] rounded-[6px] text-[13px] font-medium bg-[#f0f2f2] hover:bg-[#e3e6e6]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <span className="tabular-nums text-[#0f1111]">
              {!hasActiveFilters && filters.query.toLowerCase() === 'iphone duo case'
                ? `${startIdx}-${endIdx} of over 1,000 results for `
                : `${startIdx}-${endIdx} of ${filteredAndSortedProducts.length} results for `}
              <strong className="text-[#c45500]">
                &ldquo;{filters.query || 'iphone duo case'}&rdquo;
              </strong>
            </span>
          </div>

          {/* Sort & View Controls */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center border border-[#d5d9d9] rounded-[6px] overflow-hidden bg-[#f0f2f2]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={`p-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#0f1111] shadow-2xs'
                    : 'text-[#565959] hover:text-[#0f1111]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`p-1.5 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-[#0f1111] shadow-2xs'
                    : 'text-[#565959] hover:text-[#0f1111]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[12px]">
              <label htmlFor="sort-select" className="text-[#565959] hidden sm:inline">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-[29px] px-2.5 bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] rounded-[7px] text-[12px] text-[#0f1111] font-medium focus:outline-none focus:border-[#007185] shadow-2xs"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Avg. Customer Review</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 py-4 flex gap-6">
        {/* Desktop Left Filter Sidebar */}
        <div className="hidden lg:block w-[225px] shrink-0">
          <FilterSidebar
            filters={filters}
            onChange={updateFilters}
            onClearAll={resetAllFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Right Results Column */}
        <div className="flex-1 min-w-0">
          {/* Active Filter Removers */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4 text-[12px]">
              <span className="text-[#565959]">Active filters:</span>
              {filters.primeOnly && (
                <button
                  type="button"
                  onClick={() => updateFilters({ primeOnly: false })}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] rounded-[4px]"
                >
                  <span>Prime Eligible</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.department !== 'All Departments' && (
                <button
                  type="button"
                  onClick={() => updateFilters({ department: 'All Departments' })}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] rounded-[4px]"
                >
                  <span>{filters.department}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.selectedBrands.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() =>
                    updateFilters({
                      selectedBrands: filters.selectedBrands.filter((b) => b !== brand),
                    })
                  }
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] rounded-[4px]"
                >
                  <span>Brand: {brand}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
              {filters.selectedModels.map((model) => (
                <button
                  key={model}
                  type="button"
                  onClick={() =>
                    updateFilters({
                      selectedModels: filters.selectedModels.filter((m) => m !== model),
                    })
                  }
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] rounded-[4px]"
                >
                  <span>{model}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
              {filters.selectedFeatures.map((feat) => (
                <button
                  key={feat}
                  type="button"
                  onClick={() =>
                    updateFilters({
                      selectedFeatures: filters.selectedFeatures.filter((f) => f !== feat),
                    })
                  }
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] rounded-[4px]"
                >
                  <span>{feat}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
              {filters.selectedColor && (
                <button
                  type="button"
                  onClick={() => updateFilters({ selectedColor: null })}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] rounded-[4px]"
                >
                  <span>Colour: {filters.selectedColor}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {(filters.priceRange[0] !== null || filters.priceRange[1] !== null) && (
                <button
                  type="button"
                  onClick={() => updateFilters({ priceRange: [null, null] })}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] rounded-[4px]"
                >
                  <span>
                    Price: {filters.priceRange[0] !== null ? `S$${filters.priceRange[0]}` : 'S$0'} –{' '}
                    {filters.priceRange[1] !== null ? `S$${filters.priceRange[1]}` : 'Any'}
                  </span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Sponsored Brand Banner (shown on page 1 when not filtered out) */}
          {safePage === 1 && !hasActiveFilters && (
            <SponsoredBrandBanner
              products={spigenShowcase}
              onFilterBrand={(brand) => updateFilters({ selectedBrands: [brand] })}
              onSelectProduct={(product, color) => setSelectedDetail({ product, color })}
            />
          )}

          {/* Results Heading */}
          <div className="mb-3">
            <h1 className="text-[20px] font-bold text-[#0f1111] leading-tight">Results</h1>
            <p className="text-[13px] text-[#565959] mt-0.5">
              Check each product page for other buying options. Price and other details may vary based on product size and colour.
            </p>
          </div>

          {/* Product Grid / List or Empty State */}
          {paginatedProducts.length === 0 ? (
            <div className="border border-[#e7e7e7] rounded-[4px] p-10 text-center space-y-3 my-4">
              <h2 className="text-[18px] font-bold text-[#0f1111]">
                No results for &ldquo;{filters.query}&rdquo; with the selected filters
              </h2>
              <p className="text-[14px] text-[#565959]">
                Try removing one or more filters or broadening your search query.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-5 py-2 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-[13px] font-medium text-[#0f1111]"
              >
                Reset all filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode="grid"
                  postalCode={postalCode}
                  onSelectProduct={(p, color) => setSelectedDetail({ product: p, color })}
                  onAddToCart={(p, color) => addToCart(p, color)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode="list"
                  postalCode={postalCode}
                  onSelectProduct={(p, color) => setSelectedDetail({ product: p, color })}
                  onAddToCart={(p, color) => addToCart(p, color)}
                />
              ))}
            </div>
          )}

          {/* Related Searches */}
          <section aria-label="Related searches" className="mt-8 pt-6 border-t border-[#e7e7e7]">
            <h2 className="text-[18px] font-bold text-[#0f1111] mb-3">Related searches</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {RELATED_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    updateFilters({ query: term });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 border border-[#e7e7e7] hover:border-[#007185] rounded-[4px] text-left text-[13px] text-[#0f1111] hover:text-[#c7511f] bg-white transition-colors"
                >
                  <Search className="w-3.5 h-3.5 text-[#565959] shrink-0" />
                  <span className="truncate font-medium">{term}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Amazon Pagination Strip */}
          {totalPages > 1 && (
            <nav
              aria-label="Search results pagination"
              className="mt-8 flex items-center justify-center"
            >
              <div className="inline-flex items-center border border-[#d5d9d9] rounded-[8px] overflow-hidden shadow-2xs bg-white text-[13px]">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 flex items-center gap-1 border-r border-[#e7e7e7] disabled:text-[#a7acb2] disabled:cursor-not-allowed hover:bg-[#f7fafa]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-4 py-2 border-r border-[#e7e7e7] tabular-nums transition-colors ${
                      safePage === pageNum
                        ? 'font-bold bg-white border-b-2 border-b-[#0f1111] text-[#0f1111]'
                        : 'hover:bg-[#f7fafa] text-[#0f1111]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 flex items-center gap-1 disabled:text-[#a7acb2] disabled:cursor-not-allowed hover:bg-[#f7fafa]"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </nav>
          )}
        </div>
      </main>

      <AmazonFooter
        onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onResetHome={resetAllFilters}
      />

      {/* Mobile Filter Drawer */}
      {isMobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-black/50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile search filters"
          onClick={() => setIsMobileFiltersOpen(false)}
        >
          <div
            className="w-[290px] bg-white h-full overflow-y-auto p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e7e7e7]">
              <h2 className="text-[16px] font-bold text-[#0f1111]">Filters</h2>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-1 text-[#0f1111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onChange={updateFilters}
              onClearAll={resetAllFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </div>
      )}

      {/* All Category Hamburger Drawer */}
      {isAllMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-label="Browse all categories"
          onClick={() => setIsAllMenuOpen(false)}
        >
          <div
            className="w-[310px] bg-white h-full overflow-y-auto shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#232f3e] text-white px-5 py-3.5 flex items-center justify-between">
              <span className="text-[16px] font-bold">Hello, sign in</span>
              <button
                type="button"
                onClick={() => setIsAllMenuOpen(false)}
                aria-label="Close menu"
                className="p-1 text-white hover:bg-white/10 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-5 text-[14px] text-[#0f1111]">
              <div>
                <h3 className="font-bold text-[15px] mb-2">Shop by Case Type</h3>
                <ul className="space-y-2">
                  {(
                    [
                      'All Departments',
                      'Mobile Phone Cases',
                      'Basic Cases',
                      'Flip & Wallet Cases',
                      'Heavy Duty Cases',
                      'Bumper Cases',
                    ] as DepartmentOption[]
                  ).map((dept) => (
                    <li key={dept}>
                      <button
                        type="button"
                        onClick={() => {
                          updateFilters({ department: dept });
                          setIsAllMenuOpen(false);
                        }}
                        className="w-full text-left py-1 hover:text-[#c7511f]"
                      >
                        {dept}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-[#e7e7e7]">
                <h3 className="font-bold text-[15px] mb-2">Popular Brands</h3>
                <ul className="space-y-2">
                  {['Spigen', 'TORRAS', 'OtterBox', 'CASETiFY', 'ESR', 'Ringke'].map((brand) => (
                    <li key={brand}>
                      <button
                        type="button"
                        onClick={() => {
                          updateFilters({ selectedBrands: [brand] });
                          setIsAllMenuOpen(false);
                        }}
                        className="w-full text-left py-1 hover:text-[#c7511f]"
                      >
                        {brand}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedDetail && (
        <ProductDetailModal
          product={selectedDetail.product}
          initialColor={selectedDetail.color}
          postalCode={postalCode}
          onClose={() => setSelectedDetail(null)}
          onAddToCart={(p, c, m, q) => addToCart(p, c, m, q)}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        postalCode={postalCode}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={(idx, delta) => {
          setCart((prev) =>
            prev
              .map((item, i) =>
                i === idx ? { ...item, quantity: item.quantity + delta } : item
              )
              .filter((item) => item.quantity > 0)
          );
        }}
        onRemoveItem={(idx) => setCart((prev) => prev.filter((_, i) => i !== idx))}
        onClearCart={() => setCart([])}
      />

      {/* Singapore Location Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        currentPostalCode={postalCode}
        onSelectPostalCode={(code) => setPostalCode(code)}
        onClose={() => setIsLocationOpen(false)}
      />
    </div>
  );
}
