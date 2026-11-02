import React from 'react';
import { Package, ArrowClockwise } from '@phosphor-icons/react';

interface FooterProps {
  onResetDemoData: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onResetDemoData }) => {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        
        {/* Brand & Concept */}
        <div className="flex items-center space-x-2.5">
          <Package size={18} className="text-stone-700" weight="duotone" />
          <span>
            <strong>Library of Things</strong> · Inspirasi <em>Mono no Toshokan (ものの図書館)</em>
          </span>
        </div>

        {/* Demo reset button */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onResetDemoData}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 transition-colors font-medium border border-stone-200/80"
            title="Kembalikan semua data barang dan peminjaman ke state demo awal"
          >
            <ArrowClockwise size={14} />
            <span>Reset Data Demo</span>
          </button>

          <span className="text-[11px] text-stone-400 hidden md:inline">
            Data tersimpan di penyimpanan lokal browser.
          </span>
        </div>

      </div>
    </footer>
  );
};
