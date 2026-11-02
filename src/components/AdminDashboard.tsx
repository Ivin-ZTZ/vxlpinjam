import React, { useState, useMemo } from 'react';
import type { Item, LoanRequest, LoanStatus } from '../types';
import { 
  Package, 
  Handshake, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowClockwise, 
  Plus, 
  PencilSimple, 
  Trash, 
  MagnifyingGlass,
  UserCheck
} from '@phosphor-icons/react';

interface AdminDashboardProps {
  items: Item[];
  loans: LoanRequest[];
  onApproveLoan: (loanId: string) => void;
  onRejectLoan: (loanId: string) => void;
  onHandoverItem: (loanId: string) => void;
  onReturnItem: (loanId: string) => void;
  onAddNewItem: () => void;
  onEditItem: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  items,
  loans,
  onApproveLoan,
  onRejectLoan,
  onHandoverItem,
  onReturnItem,
  onAddNewItem,
  onEditItem,
  onDeleteItem,
}) => {
  // Tab state: 'loans' | 'inventory'
  const [activeTab, setActiveTab] = useState<'loans' | 'inventory'>('loans');

  // Loans filter
  const [loanStatusFilter, setLoanStatusFilter] = useState<string>('Semua');

  // Inventory search
  const [inventorySearch, setInventorySearch] = useState('');

  // Delete confirmation modal state
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  // Stats calculation
  const totalItems = items.length;
  const availableItems = items.filter((i) => i.status === 'Tersedia').length;
  const borrowedItems = items.filter((i) => i.status === 'Sedang Dipinjam').length;
  const pendingLoans = loans.filter((l) => l.status === 'Menunggu Persetujuan').length;

  // Filtered loans
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      if (loanStatusFilter === 'Semua') return true;
      return loan.status === loanStatusFilter;
    });
  }, [loans, loanStatusFilter]);

  // Filtered inventory
  const filteredInventory = useMemo(() => {
    return items.filter((item) => {
      const match = 
        item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.category.toLowerCase().includes(inventorySearch.toLowerCase());
      return match;
    });
  }, [items, inventorySearch]);

  // Helper for loan status badges
  const getLoanStatusBadge = (status: LoanStatus) => {
    switch (status) {
      case 'Menunggu Persetujuan':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          icon: Clock,
        };
      case 'Disetujui':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
          icon: CheckCircle,
        };
      case 'Sedang Dipinjam':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          icon: ArrowClockwise,
        };
      case 'Dikembalikan':
        return {
          bg: 'bg-stone-100 text-stone-700 border-stone-200',
          dot: 'bg-stone-500',
          icon: CheckCircle,
        };
      case 'Ditolak':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          icon: XCircle,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Title & Quick Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Dashboard Pengelola
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Kelola persetujuan peminjaman, serah-terima fisik, dan inventaris barang komunitas.
          </p>
        </div>

        {activeTab === 'inventory' && (
          <button
            type="button"
            onClick={onAddNewItem}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1E3A2B] text-white hover:bg-[#162c20] transition-colors shadow-xs"
          >
            <Plus size={16} weight="bold" />
            <span>Tambah Barang Baru</span>
          </button>
        )}
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-stone-500 text-xs font-medium mb-1">Total Barang</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900">{totalItems}</div>
          <div className="text-[11px] text-stone-400 mt-1">Terdaftar di katalog</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-emerald-700 text-xs font-medium mb-1">Siap Dipinjam</div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-800">{availableItems}</div>
          <div className="text-[11px] text-stone-400 mt-1">Status Tersedia</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-amber-700 text-xs font-medium mb-1">Aktif Dipinjam</div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-800">{borrowedItems}</div>
          <div className="text-[11px] text-stone-400 mt-1">Di tangan warga</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-blue-700 text-xs font-medium mb-1">Perlu Persetujuan</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-800">{pendingLoans}</div>
          <div className="text-[11px] text-stone-400 mt-1">Menunggu review</div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="border-b border-stone-200 flex space-x-2">
        <button
          type="button"
          onClick={() => setActiveTab('loans')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'loans'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Handshake size={18} />
          <span>Daftar Permintaan Peminjaman</span>
          {pendingLoans > 0 && (
            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              {pendingLoans} baru
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'inventory'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package size={18} />
          <span>Inventaris & Katalog ({totalItems})</span>
        </button>
      </div>

      {/* TAB 1: DAFTAR PERMINTAAN PEMINJAMAN */}
      {activeTab === 'loans' && (
        <div className="space-y-4">
          {/* Status Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
            <span className="text-stone-500 font-medium mr-1 text-[11px]">Filter:</span>
            {['Semua', 'Menunggu Persetujuan', 'Disetujui', 'Sedang Dipinjam', 'Dikembalikan', 'Ditolak'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setLoanStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  loanStatusFilter === status
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Loans List Table / Cards */}
          {filteredLoans.length > 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Peminjam</th>
                      <th className="py-3 px-4">Barang</th>
                      <th className="py-3 px-4">Jadwal Pinjam</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Catatan</th>
                      <th className="py-3 px-4 text-right">Tindakan Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredLoans.map((loan) => {
                      const badge = getLoanStatusBadge(loan.status);
                      const BadgeIcon = badge.icon;
                      const relatedItem = items.find((i) => i.id === loan.itemId);
                      const isItemBusyByOther = relatedItem && relatedItem.status === 'Sedang Dipinjam' && loan.status !== 'Sedang Dipinjam';

                      return (
                        <tr key={loan.id} className="hover:bg-stone-50/70 transition-colors">
                          {/* Borrower */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="font-bold text-stone-900">{loan.borrowerName}</div>
                            <div className="text-[11px] text-stone-500">{loan.borrowerContact}</div>
                          </td>

                          {/* Item */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="font-semibold text-stone-900">{loan.itemName}</div>
                            <div className="text-[11px] text-stone-500">{loan.itemCategory}</div>
                          </td>

                          {/* Schedule */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="text-stone-800">
                              {new Date(loan.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} — {new Date(loan.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            <div className="text-[11px] text-stone-400">
                              Diajukan: {new Date(loan.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-4 align-top">
                            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full font-bold border text-[11px] ${badge.bg}`}>
                              <BadgeIcon size={13} className="shrink-0" />
                              <span>{loan.status}</span>
                            </span>
                          </td>

                          {/* Notes */}
                          <td className="py-3.5 px-4 align-top max-w-xs">
                            {loan.notes && (
                              <p className="text-stone-600 line-clamp-2 italic mb-0.5">
                                "{loan.notes}"
                              </p>
                            )}
                            {loan.adminNote && (
                              <p className="text-[11px] text-stone-500">
                                <strong>Admin:</strong> {loan.adminNote}
                              </p>
                            )}
                            {!loan.notes && !loan.adminNote && (
                              <span className="text-stone-400">-</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 align-top text-right">
                            {/* Workflow Actions */}
                            {loan.status === 'Menunggu Persetujuan' && (
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => onApproveLoan(loan.id)}
                                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-2xs"
                                  title="Setujui permohonan pinjam ini"
                                >
                                  <CheckCircle size={14} weight="bold" />
                                  <span>Setujui</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onRejectLoan(loan.id)}
                                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 text-rose-700 hover:bg-rose-50 border border-stone-200 transition-colors"
                                  title="Tolak permohonan"
                                >
                                  <XCircle size={14} weight="bold" />
                                  <span>Tolak</span>
                                </button>
                              </div>
                            )}

                            {loan.status === 'Disetujui' && (
                              <div className="flex items-center justify-end space-x-1.5">
                                {isItemBusyByOther ? (
                                  <span className="text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                                    Tunggu barang selesai dipinjam
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => onHandoverItem(loan.id)}
                                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-700 text-white hover:bg-indigo-800 transition-colors shadow-2xs"
                                    title="Barang sudah diserahkan fisik ke peminjam"
                                  >
                                    <UserCheck size={14} weight="bold" />
                                    <span>Serahkan Barang</span>
                                  </button>
                                )}
                              </div>
                            )}

                            {loan.status === 'Sedang Dipinjam' && (
                              <div className="flex items-center justify-end">
                                <button
                                  type="button"
                                  onClick={() => onReturnItem(loan.id)}
                                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1E3A2B] text-white hover:bg-[#162c20] transition-colors shadow-2xs"
                                  title="Catat barang telah dikembalikan ke pemilik"
                                >
                                  <CheckCircle size={14} weight="bold" />
                                  <span>Catat Kembali</span>
                                </button>
                              </div>
                            )}

                            {(loan.status === 'Dikembalikan' || loan.status === 'Ditolak') && (
                              <span className="text-[11px] text-stone-400 font-medium">
                                Selesai
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-8 text-center text-xs text-stone-500">
              Tidak ada permintaan peminjaman dengan status <strong>{loanStatusFilter}</strong>.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVENTARIS & KATALOG BARANG */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Search bar inside inventory */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <MagnifyingGlass size={16} />
              </div>
              <input
                type="text"
                placeholder="Cari nama barang atau pemilik..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all"
              />
            </div>

            <button
              type="button"
              onClick={onAddNewItem}
              className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1E3A2B] text-white hover:bg-[#162c20] transition-colors shadow-xs"
            >
              <Plus size={16} weight="bold" />
              <span>Tambah Barang Baru</span>
            </button>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Barang</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Kondisi</th>
                    <th className="py-3 px-4">Pemilik & Lokasi</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredInventory.map((item) => {
                    const isAvailable = item.status === 'Tersedia';

                    return (
                      <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                        {/* Item photo & name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-11 h-11 rounded-lg object-cover border border-stone-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-stone-900 truncate max-w-xs">{item.name}</p>
                              <p className="text-[11px] text-stone-500 line-clamp-1">{item.description}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-stone-100 text-stone-700">
                            {item.category}
                          </span>
                        </td>

                        {/* Condition */}
                        <td className="py-3 px-4">
                          <span className="font-medium text-stone-800">{item.condition}</span>
                        </td>

                        {/* Owner & Location */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-stone-900">{item.ownerName}</div>
                          <div className="text-[11px] text-stone-500">{item.ownerLocation}</div>
                        </td>

                        {/* Availability */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              isAvailable
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                            <span>{item.status}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              type="button"
                              onClick={() => onEditItem(item)}
                              className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                              title="Edit barang"
                            >
                              <PencilSimple size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setItemToDelete(item)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Hapus barang"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Dialog */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs" 
            onClick={() => setItemToDelete(null)}
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl border border-stone-200 space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Trash size={24} weight="bold" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-base text-stone-900">
                  Hapus Barang dari Katalog?
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Apakah Anda yakin ingin menghapus <strong>"{itemToDelete.name}"</strong>? Data barang ini akan dihapus dari inventaris.
                </p>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteItem(itemToDelete.id);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-2xs"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
