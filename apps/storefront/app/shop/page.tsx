'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCommerce } from '@/components/CommerceContext';
import { ProductCard } from '@/components/ProductCard';
import { StoreSelectorModal } from '@/components/StoreSelectorModal';
import { BuyingAssistantModal } from '@/components/BuyingAssistantModal';
import {
  Search,
  Filter,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  RotateCcw,
  X,
  ArrowRight,
} from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialBrand = searchParams.get('brand') || 'ALL';

  const { products, selectedStore, selectedStoreId } = useCommerce();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedSeason, setSelectedSeason] = useState<string>('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'brand'>('featured');
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInitialQuery, setAssistantInitialQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const brands = useMemo(() => {
    const bSet = new Set(products.map((p) => p.brand));
    return ['ALL', ...Array.from(bSet)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Query search (name, size, model, vehicle reg)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(q);
          const matchSize = product.tyreSize.toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          if (!matchName && !matchSize && !matchBrand && !matchDesc) return false;
        }

        // Brand filter
        if (selectedBrand !== 'ALL' && product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }

        // Season filter
        if (selectedSeason !== 'ALL' && product.season !== selectedSeason) {
          return false;
        }

        // Vehicle type filter
        if (vehicleTypeFilter !== 'ALL' && product.vehicleType !== vehicleTypeFilter) {
          return false;
        }

        // Stock status filter per currently selected store
        const storeStock = product.stockByStore[selectedStoreId];
        const isOutOfStock = !storeStock || storeStock.state === 'Out of Stock' || storeStock.quantity === 0;

        if (stockFilter === 'IN_STOCK' && isOutOfStock) return false;
        if (stockFilter === 'OUT_OF_STOCK' && !isOutOfStock) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'brand') return a.brand.localeCompare(b.brand);
        return 0;
      });
  }, [products, searchQuery, selectedBrand, selectedSeason, vehicleTypeFilter, stockFilter, selectedStoreId, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('ALL');
    setSelectedSeason('ALL');
    setStockFilter('ALL');
    setVehicleTypeFilter('ALL');
    setSortBy('featured');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedBrand !== 'ALL' ||
    selectedSeason !== 'ALL' ||
    stockFilter !== 'ALL' ||
    vehicleTypeFilter !== 'ALL';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Store Quick Switch Bar */}
      <div className="cymbal-box-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="cymbal-stamp bg-[#38bdf8] text-[#020617]">DEPOT CATALOG</span>
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
              UCP FITMENT SCHEDULER
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase mt-1 tracking-tight">
            Tyre Catalog & Depot Hub
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing stock availability and bay scheduling for{' '}
            <strong className="text-white underline decoration-[#38bdf8]">{selectedStore.name}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsStoreModalOpen(true)}
          className="cymbal-box-md px-3.5 py-2 text-[#38bdf8] hover:border-[#38bdf8] transition-colors text-xs font-bold self-start sm:self-auto flex items-center gap-2"
        >
          <MapPin className="w-4 h-4 text-[#38bdf8]" />
          <span>Switch Depot: {selectedStore.city}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </button>
      </div>

      {/* Main Content Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar (Desktop) */}
        <aside className="hidden lg:block cymbal-box-lg p-5 space-y-6 sticky top-24">
          {/* AI Buying Assistant Quick Launcher Card */}
          <div className="cymbal-box-md p-4 text-white border-[#0284c7] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#38bdf8]">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Buying Assistant</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              100% web-grounded advice with plain English test comparisons.
            </p>
            <button
              type="button"
              onClick={() => {
                setAssistantInitialQuery(searchQuery || '');
                setIsAssistantOpen(true);
              }}
              className="cymbal-btn-primary w-full py-2 px-3 text-xs flex items-center justify-center gap-1.5"
            >
              <span>Ask Specialist AI</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center justify-between border-b pb-3 border-[#1e293b]">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-white">
              <Filter className="w-4 h-4 text-[#38bdf8]" />
              <span>Filter Catalog</span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="font-mono text-[10px] text-[#38bdf8] hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5">
              Search by Keyword / Size
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. 225/40 R18, Goodyear..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] text-white outline-none focus:border-[#38bdf8]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Stock Availability Filter */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-2">
              Stock Availability ({selectedStore.city})
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'ALL', label: 'All Products' },
                { id: 'IN_STOCK', label: 'In Stock & Ready' },
                { id: 'OUT_OF_STOCK', label: 'Out of Stock (Intent ready)' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-[#38bdf8]"
                >
                  <input
                    type="radio"
                    name="stockFilter"
                    checked={stockFilter === opt.id}
                    onChange={() => setStockFilter(opt.id as any)}
                    className="text-[#0284c7] focus:ring-[#38bdf8]"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-2">
              Tyre Manufacturer
            </label>
            <div className="space-y-1.5 text-xs">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-[#38bdf8]"
                >
                  <input
                    type="radio"
                    name="brandFilter"
                    checked={selectedBrand.toLowerCase() === brand.toLowerCase()}
                    onChange={() => setSelectedBrand(brand)}
                    className="text-[#0284c7] focus:ring-[#38bdf8]"
                  />
                  <span>{brand === 'ALL' ? 'All Brands' : brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-2">
              Vehicle Suitability
            </label>
            <div className="space-y-1.5 text-xs">
              {['ALL', 'Car', 'EV / Hybrid'].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-[#38bdf8]"
                >
                  <input
                    type="radio"
                    name="vehicleTypeFilter"
                    checked={vehicleTypeFilter === type}
                    onChange={() => setVehicleTypeFilter(type)}
                    className="text-[#0284c7] focus:ring-[#38bdf8]"
                  />
                  <span>{type === 'ALL' ? 'All Vehicle Types' : type}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Filter Toggle & Search Bar */}
        <div className="lg:hidden col-span-1 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tyres, size..."
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] text-white"
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="cymbal-box-md px-4 py-2.5 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#38bdf8]" />
              <span>Filters</span>
            </button>
          </div>

          {showMobileFilters && (
            <div className="cymbal-box-lg p-4 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#1e293b]">
                <span className="font-bold uppercase tracking-wider text-white">Active Filters</span>
                <button onClick={resetFilters} className="text-[#38bdf8] font-mono text-[10px]">
                  Reset
                </button>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block mb-1">Brand:</span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full p-2 rounded-t-sm rounded-br-sm rounded-bl-none border border-[#1e293b] bg-[#111a30] text-white"
                >
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block mb-1">Stock Status:</span>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className="w-full p-2 rounded-t-sm rounded-br-sm rounded-bl-none border border-[#1e293b] bg-[#111a30] text-white"
                >
                  <option value="ALL">All Products</option>
                  <option value="IN_STOCK">In Stock Only</option>
                  <option value="OUT_OF_STOCK">Out of Stock Only</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="cymbal-box-md flex items-center justify-between px-4 py-2.5 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              SHOWING <strong className="text-[#38bdf8]">{filteredProducts.length}</strong> MATCHING TYRES
            </span>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-mono text-[10px] uppercase hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#080d1a] border border-[#1e293b] text-slate-200 rounded-t-sm rounded-br-sm rounded-bl-none p-1.5 font-mono text-xs outline-none focus:border-[#38bdf8]"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="brand">Brand A-Z</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="cymbal-box-lg p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-t-lg rounded-br-lg rounded-bl-none bg-[#111a30] border border-[#1e293b] text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6 text-[#38bdf8]" />
              </div>
              <h3 className="font-bold text-white text-base uppercase">
                No matching tyres found
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try adjusting your search keywords, clearing brand filters, or switching to another fitting depot location.
              </p>
              <button
                onClick={resetFilters}
                className="cymbal-btn-primary px-4 py-2 text-xs"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <StoreSelectorModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
      />

      {/* Buying Assistant Modal */}
      <BuyingAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        initialQuery={assistantInitialQuery}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#0284c7] border-t-transparent rounded-full mx-auto" />
          <p className="text-xs text-slate-400 mt-3 font-mono">Loading Cymbal Tyres catalog...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
