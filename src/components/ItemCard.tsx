import React from 'react';
import type { Item } from '../types';
import { 
  User, 
  MapPin, 
  ArrowRight,
  Clock
} from '@phosphor-icons/react';

interface ItemCardProps {
  item: Item;
  onViewDetail: (item: Item) => void;
  onQuickBorrow?: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onViewDetail,
  onQuickBorrow,
}) => {
  const isAvailable = item.status === 'Tersedia';

  // Condition color styling
  const getConditionStyle = (condition: string) => {
    switch (condition) {
      case 'Sangat Baik':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Baik':
        return 'text-sky-700 bg-sky-50 border-sky-200';
      default:
        return 'text-stone-700 bg-stone-100 border-stone-200';
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback image if unsplash link fails
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {/* Category Pill */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-stone-800 shadow-xs border border-white/60">
            {item.category}
          </span>

          {/* Availability Status */}
          <span
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-xs border ${
              isAvailable
                ? 'bg-emerald-50/95 text-emerald-800 border-emerald-200/90'
                : 'bg-amber-50/95 text-amber-800 border-amber-200/90'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAvailable ? 'bg-emerald-600' : 'bg-amber-500'
              }`}
            />
            <span>{item.status}</span>
          </span>
        </div>

        {/* Return dueDate notice if currently borrowed */}
        {!isAvailable && item.returnDueDate && (
          <div className="absolute bottom-2.5 inset-x-3">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-medium">
              <Clock size={13} className="text-amber-400 shrink-0" />
              <span className="truncate">
                Dipinjam s/d {new Date(item.returnDueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Item Name */}
          <h3 className="font-bold text-base sm:text-lg text-stone-900 leading-snug line-clamp-2 mb-2">
            {item.name}
          </h3>

          {/* Condition & Owner Info */}
          <div className="space-y-2 mb-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Kondisi barang:</span>
              <span className={`px-2 py-0.5 rounded-md font-semibold border ${getConditionStyle(item.condition)}`}>
                {item.condition}
              </span>
            </div>

            <div className="flex items-center justify-between text-stone-600">
              <span className="text-stone-500">Pemilik:</span>
              <span className="font-medium text-stone-800 flex items-center space-x-1">
                <User size={13} className="text-stone-400" />
                <span>{item.ownerName}</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-stone-600">
              <span className="text-stone-500">Lokasi:</span>
              <span className="font-medium text-stone-700 flex items-center space-x-1">
                <MapPin size={13} className="text-stone-400" />
                <span>{item.ownerLocation}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetail(item)}
            className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors"
          >
            <span>Lihat Detail</span>
            <ArrowRight size={14} />
          </button>

          {isAvailable && onQuickBorrow && (
            <button
              type="button"
              onClick={() => onQuickBorrow(item)}
              className="inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-bold bg-[#1E3A2B] text-white hover:bg-[#162c20] transition-colors shadow-xs"
              title="Ajukan pinjam barang ini sekarang"
            >
              <span>Pinjam</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
