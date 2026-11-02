import React, { useState, useMemo } from 'react';
import type { Item, ItemCategory } from '../types';
import { ItemCard } from './ItemCard';
import { 
  MagnifyingGlass, 
  X, 
  Package, 
  CheckCircle,
  Plant
} from '@phosphor-icons/react';

interface CatalogViewProps {
  items: Item[];
  onViewDetail: (item: Item) => void;
  onRequestBorrow: (item: Item) => void;
}

const CATEGORIES: ItemCategory[] = [
  'Semua',
  'Pertukangan',
  'Rumah Tangga',
  'Elektronik',
  'Camping & Outdoor',
  'Olahraga & Hobi',
];

export const CatalogView: React.FC<CatalogViewProps> = ({
  items,
  onViewDetail,
  onRequestBorrow,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('Semua');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search filter
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = 
        selectedCategory === 'Semua' || item.category === selectedCategory;

      // Availability filter
      const matchesAvailability = !onlyAvailable || item.status === 'Tersedia';

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [items, searchQuery, selectedCategory, onlyAvailable]);

  // Counts for each category
  const getCategoryCount = (cat: ItemCategory) => {
    if (cat === 'Semua') return items.length;
    return items.filter((item) => item.category === cat).length;
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setOnlyAvailable(false);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner — Restrained Japanese-Minimalist Concept */}
      <section className="bg-stone-900 text-stone-50 rounded-3xl p-6 sm:p-10 relative overflow-hidden border border-stone-800 shadow-md">
        {/* Subtle decorative background motif */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-950/40 pointer-events-none blur-2xl" />
        <div className="absolute right-8 top-8 opacity-10 select-none text-right hidden sm:block pointer-events-none">
          <span className="font-serif text-6xl tracking-widest block text-stone-300">物の図書館</span>
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-semibold border border-emerald-700/50">
            <Plant size={14} weight="fill" />
            <span>Konsep Mono no Toshokan (ものの図書館)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Pinjam Saat Butuh, Rawat Bersama
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            Katalog perkakas dan perlengkapan warga untuk berbagi manfaat tanpa harus selalu membeli baru.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-stone-400">
            <span className="inline-flex items-center space-x-1.5">
              <CheckCircle size={15} className="text-emerald-400" />
              <span>Gratis antarwarga</span>
            </span>
            <span className="inline-flex items-center space-x-1.5">
              <CheckCircle size={15} className="text-emerald-400" />
              <span>Perawatan saling percaya</span>
            </span>
            <span className="inline-flex items-center space-x-1.5">
              <CheckCircle size={15} className="text-emerald-400" />
              <span>Hemat ruang penyimpanan</span>
            </span>
          </div>
        </div>
      </section>

      {/* Search and Filters Control Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <MagnifyingGlass size={18} />
            </div>
            <input
              type="text"
              placeholder="Cari bor listrik, proyektor, tangga, camping..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700"
                aria-label="Bersihkan pencarian"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center self-start sm:self-auto">
            <label className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-700 bg-white px-3.5 py-2.5 rounded-xl border border-stone-300 shadow-2xs cursor-pointer hover:bg-stone-50 select-none transition-colors">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded text-[#1E3A2B] focus:ring-[#1E3A2B]"
              />
              <span>Tampilkan Hanya yang Tersedia</span>
            </label>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = getCategoryCount(cat);

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#1E3A2B] text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200/90 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Menampilkan <strong className="text-stone-900">{filteredItems.length}</strong> barang
          {selectedCategory !== 'Semua' && ` dalam kategori ${selectedCategory}`}
          {searchQuery && ` untuk "${searchQuery}"`}
        </span>
        {(searchQuery || selectedCategory !== 'Semua' || onlyAvailable) && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-stone-600 hover:text-stone-900 font-semibold underline underline-offset-2"
          >
            Reset Semua Filter
          </button>
        )}
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onViewDetail={onViewDetail}
              onQuickBorrow={onRequestBorrow}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-8 sm:p-14 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center">
            <Package size={28} />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-base mb-1">
              Barang Tidak Ditemukan
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Tidak ada barang yang cocok dengan kata kunci atau filter saat ini. Coba gunakan istilah pencarian lain atau setel ulang filter.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            Reset Filter & Cari Lagi
          </button>
        </div>
      )}
    </div>
  );
};
