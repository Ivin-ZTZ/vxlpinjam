import React from 'react';
import type { UserRole } from '../types';
import { 
  Package, 
  User, 
  GearSix
} from '@phosphor-icons/react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  pendingLoansCount: number;
  availableItemsCount: number;
  totalItemsCount: number;
  onNewItemClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  pendingLoansCount,
  availableItemsCount,
  totalItemsCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FCFBF9]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center shadow-sm">
              <Package size={24} weight="duotone" className="text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-stone-900 tracking-tight">
                  Library of Things
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                  ものの図書館
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Peminjaman Barang Komunitas · Rukun Warga & Hobi
              </p>
            </div>
          </div>

          {/* Availability Status Badge & Role Switcher */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Quick Community Stats - visible on medium+ screens */}
            <div className="hidden md:flex items-center space-x-2 text-xs text-stone-600 bg-stone-100/80 px-3 py-1.5 rounded-lg border border-stone-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-stone-800">{availableItemsCount}</span>
              <span>dari</span>
              <span className="font-medium text-stone-800">{totalItemsCount}</span>
              <span>barang siap dipinjam</span>
            </div>

            {/* Role Switcher Pill */}
            <div className="inline-flex p-1 bg-stone-200/70 rounded-xl border border-stone-300/60 shadow-inner">
              <button
                type="button"
                onClick={() => onRoleChange('member')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentRole === 'member'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                aria-label="Mode Anggota Komunitas"
              >
                <User size={15} weight={currentRole === 'member' ? 'bold' : 'regular'} />
                <span>Anggota</span>
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('admin')}
                className={`relative inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentRole === 'admin'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                aria-label="Mode Pengelola / Admin"
              >
                <GearSix size={15} weight={currentRole === 'admin' ? 'bold' : 'regular'} />
                <span>Pengelola</span>
                {pendingLoansCount > 0 && (
                  <span className={`inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    currentRole === 'admin' 
                      ? 'bg-emerald-500 text-stone-950' 
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {pendingLoansCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
