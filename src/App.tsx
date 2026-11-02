import React, { useState, useEffect } from 'react';
import type { Item, LoanRequest, UserRole } from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { CatalogView } from './components/CatalogView';
import { ItemDetailModal } from './components/ItemDetailModal';
import { LoanRequestModal } from './components/LoanRequestModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ItemFormModal } from './components/ItemFormModal';
import { NotificationToast, type ToastMessage } from './components/NotificationToast';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // Global states
  const [currentRole, setCurrentRole] = useState<UserRole>('member');
  const [items, setItems] = useState<Item[]>([]);
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Modal states
  const [selectedDetailItem, setSelectedDetailItem] = useState<Item | null>(null);
  const [borrowModalItem, setBorrowModalItem] = useState<Item | null>(null);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);

  // Initialize data on mount
  useEffect(() => {
    // ponytail: load directly from local storage service
    const initialItems = storageService.getItems();
    const initialLoans = storageService.getLoans();
    setItems(initialItems);
    setLoans(initialLoans);
  }, []);

  // Save changes to localStorage whenever state changes
  const updateItems = (newItems: Item[]) => {
    setItems(newItems);
    storageService.saveItems(newItems);
  };

  const updateLoans = (newLoans: LoanRequest[]) => {
    setLoans(newLoans);
    storageService.saveLoans(newLoans);
  };

  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({
      id: Date.now().toString(),
      title,
      message,
      type,
    });
  };

  // --- BORROWING HANDLERS ---
  const handleOpenBorrowModal = (item: Item) => {
    // Check if item is available
    if (item.status !== 'Tersedia') {
      showToast('Barang Sedang Dipinjam', 'Barang ini sedang dipinjam warga lain dan belum bisa diajukan.', 'warning');
      return;
    }
    setBorrowModalItem(item);
  };

  const handleSubmitLoan = (loanData: Omit<LoanRequest, 'id' | 'createdAt' | 'status'>) => {
    const newLoan: LoanRequest = {
      ...loanData,
      id: `loan-${Date.now()}`,
      status: 'Menunggu Persetujuan',
      createdAt: new Date().toISOString(),
    };

    const newLoansList = [newLoan, ...loans];
    updateLoans(newLoansList);

    showToast(
      'Pengajuan Peminjaman Terkirim!',
      `Permintaan untuk "${newLoan.itemName}" telah dikirim dan kini menunggu persetujuan pengelola.`,
      'success'
    );
  };

  // --- ADMIN WORKFLOW ACTIONS ---
  const handleApproveLoan = (loanId: string) => {
    const updatedLoans = loans.map((loan) => {
      if (loan.id === loanId) {
        return {
          ...loan,
          status: 'Disetujui' as const,
          adminNote: 'Disetujui oleh admin. Siap serah-terima fisik barang.',
        };
      }
      return loan;
    });

    updateLoans(updatedLoans);
    showToast('Permintaan Disetujui!', 'Peminjam dapat berkoordinasi untuk pengambilan barang.', 'info');
  };

  const handleRejectLoan = (loanId: string) => {
    const updatedLoans = loans.map((loan) => {
      if (loan.id === loanId) {
        return {
          ...loan,
          status: 'Ditolak' as const,
          adminNote: 'Permintaan peminjaman ditolak oleh pengelola.',
        };
      }
      return loan;
    });

    updateLoans(updatedLoans);
    showToast('Permintaan Ditolak', 'Status peminjaman telah diubah menjadi ditolak.', 'info');
  };

  // Serahkan barang (mulai pinjam fisik): Ubah status pinjam -> Sedang Dipinjam, dan status barang -> Sedang Dipinjam
  const handleHandoverItem = (loanId: string) => {
    const targetLoan = loans.find((l) => l.id === loanId);
    if (!targetLoan) return;

    // Update loan status
    const updatedLoans = loans.map((loan) => {
      if (loan.id === loanId) {
        return {
          ...loan,
          status: 'Sedang Dipinjam' as const,
          adminNote: `Barang diserahkan pada ${new Date().toLocaleDateString('id-ID')}.`,
        };
      }
      return loan;
    });

    // Update item status in catalog
    const updatedItems = items.map((item) => {
      if (item.id === targetLoan.itemId) {
        return {
          ...item,
          status: 'Sedang Dipinjam' as const,
          currentBorrowerName: `${targetLoan.borrowerName} (${targetLoan.borrowerContact})`,
          returnDueDate: targetLoan.endDate,
        };
      }
      return item;
    });

    updateLoans(updatedLoans);
    updateItems(updatedItems);

    showToast(
      'Barang Resmi Dipinjam!',
      `Status "${targetLoan.itemName}" di katalog kini otomatis menjadi "Sedang Dipinjam".`,
      'success'
    );
  };

  // Catat pengembalian barang: Ubah status pinjam -> Dikembalikan, dan status barang -> Tersedia
  const handleReturnItem = (loanId: string) => {
    const targetLoan = loans.find((l) => l.id === loanId);
    if (!targetLoan) return;

    // Update loan status
    const updatedLoans = loans.map((loan) => {
      if (loan.id === loanId) {
        return {
          ...loan,
          status: 'Dikembalikan' as const,
          adminNote: `Barang dikembalikan pada ${new Date().toLocaleDateString('id-ID')}. Kondisi telah diperiksa.`,
        };
      }
      return loan;
    });

    // Update item status in catalog back to available
    const updatedItems = items.map((item) => {
      if (item.id === targetLoan.itemId) {
        return {
          ...item,
          status: 'Tersedia' as const,
          currentBorrowerName: undefined,
          returnDueDate: undefined,
        };
      }
      return item;
    });

    updateLoans(updatedLoans);
    updateItems(updatedItems);

    showToast(
      'Pengembalian Barang Dicatat!',
      `"${targetLoan.itemName}" telah kembali dan kini "Tersedia" untuk dipinjam warga lain.`,
      'success'
    );
  };

  // --- INVENTORY CRUD ACTIONS ---
  const handleOpenAddNewItem = () => {
    setItemToEdit(null);
    setIsItemFormOpen(true);
  };

  const handleOpenEditItem = (item: Item) => {
    setItemToEdit(item);
    setIsItemFormOpen(true);
  };

  const handleSaveItem = (itemData: Omit<Item, 'id' | 'createdAt'> & { id?: string }) => {
    if (itemData.id) {
      // Edit existing
      const updated = items.map((item) => {
        if (item.id === itemData.id) {
          return {
            ...item,
            ...itemData,
          } as Item;
        }
        return item;
      });
      updateItems(updated);
      showToast('Perubahan Disimpan', `Informasi barang "${itemData.name}" berhasil diperbarui.`);
    } else {
      // Add new
      const newItem: Item = {
        ...itemData,
        id: `item-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...items];
      updateItems(updated);
      showToast('Barang Baru Terdaftar!', `"${newItem.name}" kini telah ada di katalog komunitas.`);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    const targetItem = items.find((i) => i.id === itemId);
    const updated = items.filter((i) => i.id !== itemId);
    updateItems(updated);
    showToast('Barang Dihapus', `Barang "${targetItem?.name || ''}" telah dihapus dari inventaris.`, 'info');
  };

  // --- RESET DEMO DATA ---
  const handleResetDemoData = () => {
    const reset = storageService.resetAllToDefault();
    setItems(reset.items);
    setLoans(reset.loans);
    showToast('Data Demo Dipulihkan', 'Katalog dan riwayat peminjaman telah dikembalikan ke kondisi contoh awal.', 'info');
  };

  // Calculations
  const pendingLoansCount = loans.filter((l) => l.status === 'Menunggu Persetujuan').length;
  const availableItemsCount = items.filter((i) => i.status === 'Tersedia').length;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#FCFBF9] text-stone-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sticky Header with Navigation & Role Switcher */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        pendingLoansCount={pendingLoansCount}
        availableItemsCount={availableItemsCount}
        totalItemsCount={items.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentRole === 'member' ? (
          <CatalogView
            items={items}
            onViewDetail={(item) => setSelectedDetailItem(item)}
            onRequestBorrow={handleOpenBorrowModal}
          />
        ) : (
          <AdminDashboard
            items={items}
            loans={loans}
            onApproveLoan={handleApproveLoan}
            onRejectLoan={handleRejectLoan}
            onHandoverItem={handleHandoverItem}
            onReturnItem={handleReturnItem}
            onAddNewItem={handleOpenAddNewItem}
            onEditItem={handleOpenEditItem}
            onDeleteItem={handleDeleteItem}
          />
        )}
      </main>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedDetailItem}
        isOpen={Boolean(selectedDetailItem)}
        onClose={() => setSelectedDetailItem(null)}
        onRequestBorrow={handleOpenBorrowModal}
      />

      {/* Loan Request Form Modal */}
      <LoanRequestModal
        item={borrowModalItem}
        isOpen={Boolean(borrowModalItem)}
        onClose={() => setBorrowModalItem(null)}
        onSubmitLoan={handleSubmitLoan}
      />

      {/* Admin Add/Edit Item Form Modal */}
      <ItemFormModal
        itemToEdit={itemToEdit}
        isOpen={isItemFormOpen}
        onClose={() => setIsItemFormOpen(false)}
        onSave={handleSaveItem}
      />

      {/* Feedback Toast Notification */}
      <NotificationToast
        toast={toast}
        onDismiss={() => setToast(null)}
      />

      {/* Minimalist Community Footer */}
      <Footer onResetDemoData={handleResetDemoData} />
    </div>
  );
};

export default App;
