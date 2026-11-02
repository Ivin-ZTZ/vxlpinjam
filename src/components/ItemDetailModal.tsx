import React, { useEffect } from 'react';
import type { Item } from '../types';
import { 
  X, 
  MapPin, 
  User, 
  ShieldCheck, 
  HandHeart, 
  CalendarCheck,
  Clock,
  Sparkle
} from '@phosphor-icons/react';

interface ItemDetailModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestBorrow: (item: Item) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onRequestBorrow,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const isAvailable = item.status === 'Tersedia';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="relative bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-stone-200 transform transition-all">
          
          {/* Header Image & Close Button */}
          <div className="relative aspect-[16/9] w-full bg-stone-100">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white flex items-center justify-center backdrop-blur-md transition-colors"
              aria-label="Tutup jendela detail"
            >
              <X size={18} weight="bold" />
            </button>

            {/* Badges Overlay */}
            <div className="absolute bottom-3 inset-x-3 sm:inset-x-4 flex items-center justify-between pointer-events-none">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-stone-800 shadow-xs border border-white/80">
                {item.category}
              </span>
              <span
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-xs border ${
                  isAvailable
                    ? 'bg-emerald-50/95 text-emerald-800 border-emerald-200/90'
                    : 'bg-amber-50/95 text-amber-800 border-amber-200/90'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAvailable ? 'bg-emerald-600' : 'bg-amber-500'
                  }`}
                />
                <span>{item.status}</span>
              </span>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Title & Description */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mb-2">
                {item.name}
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Borrowed Notice if active */}
            {!isAvailable && (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-3">
                <Clock size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <p className="font-semibold mb-0.5">Barang Saat Ini Sedang Dipinjam</p>
                  <p className="text-amber-800">
                    Sedang dipinjam oleh <span className="font-medium">{item.currentBorrowerName || 'Warga'}</span>.
                    {item.returnDueDate && (
                      <span> Diperkirakan kembali pada <span className="font-medium">{new Date(item.returnDueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>.</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Grid Information: Kondisi & Pemilik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Kondisi Box */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs text-stone-500 font-medium">
                  <ShieldCheck size={16} className="text-stone-700" />
                  <span>Kondisi Barang</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-stone-900">{item.condition}</span>
                </div>
                <p className="text-xs text-stone-600 leading-normal">
                  {item.conditionNote}
                </p>
              </div>

              {/* Pemilik Box */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs text-stone-500 font-medium">
                  <User size={16} className="text-stone-700" />
                  <span>Pemilik & Pengambilan</span>
                </div>
                <div className="font-bold text-sm text-stone-900">
                  {item.ownerName}
                </div>
                <p className="text-xs text-stone-600 flex items-center space-x-1">
                  <MapPin size={14} className="text-stone-400 shrink-0" />
                  <span>{item.ownerLocation}</span>
                </p>
              </div>
            </div>

            {/* Care instructions / Petunjuk Perawatan */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900">
                <HandHeart size={16} className="text-emerald-700" />
                <span>Petunjuk Pemakaian & Perawatan</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {item.careInstructions}
              </p>
            </div>

            {/* Community Pledge Note */}
            <div className="text-[11px] text-stone-500 border-t border-stone-100 pt-3 flex items-center space-x-2">
              <Sparkle size={14} className="text-amber-500 shrink-0" />
              <span>Semangat <em>Mono no Toshokan</em>: Merawat barang bersama untuk keberlanjutan komunitas.</span>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 transition-colors"
            >
              Tutup
            </button>

            {isAvailable ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestBorrow(item);
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#1E3A2B] text-white hover:bg-[#162c20] transition-colors shadow-sm"
              >
                <CalendarCheck size={16} weight="bold" />
                <span>Ajukan Peminjaman</span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300"
              >
                <span>Barang Sedang Dipinjam</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
