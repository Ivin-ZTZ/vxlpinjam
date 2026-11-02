import React, { useState, useEffect } from 'react';
import type { Item, LoanRequest } from '../types';
import { 
  X, 
  User, 
  Phone, 
  CheckCircle,
  WarningCircle,
  Handshake,
  Clock
} from '@phosphor-icons/react';

interface LoanRequestModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitLoan: (newLoan: Omit<LoanRequest, 'id' | 'createdAt' | 'status'>) => void;
}

export const LoanRequestModal: React.FC<LoanRequestModalProps> = ({
  item,
  isOpen,
  onClose,
  onSubmitLoan,
}) => {
  // Form state
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerContact, setBorrowerContact] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Set default dates on open
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const defaultStart = today.toISOString().split('T')[0];
      
      const twoDaysLater = new Date();
      twoDaysLater.setDate(today.getDate() + 2);
      const defaultEnd = twoDaysLater.toISOString().split('T')[0];

      setStartDate(defaultStart);
      setEndDate(defaultEnd);
      setErrorMessage(null);
    }
  }, [isOpen]);

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

  // Calculate duration in days
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
    return diffDays > 0 ? diffDays : 0;
  };

  const durationDays = calculateDays();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!borrowerName.trim()) {
      setErrorMessage('Silakan masukkan nama lengkap peminjam.');
      return;
    }

    if (!startDate || !endDate) {
      setErrorMessage('Tanggal peminjaman dan rencana pengembalian wajib diisi.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setErrorMessage('Rencana tanggal pengembalian tidak boleh sebelum tanggal peminjaman.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Harap setujui komitmen merawat barang komunitas.');
      return;
    }

    // Submit loan request
    onSubmitLoan({
      itemId: item.id,
      itemName: item.name,
      itemCategory: item.category,
      borrowerName: borrowerName.trim(),
      borrowerContact: borrowerContact.trim() || 'Warga Komunitas',
      startDate,
      endDate,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="relative bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-stone-200 transform transition-all">
          
          {/* Header */}
          <div className="px-5 sm:px-7 pt-6 pb-4 border-b border-stone-100 flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
                <Handshake size={22} weight="bold" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900">
                  Formulir Pengajuan Peminjaman
                </h2>
                <p className="text-xs text-stone-500">
                  Status pengajuan awal: <span className="font-semibold text-blue-700">Menunggu Persetujuan</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Tutup formulir"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4">
            {/* Item Summary Card */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center space-x-3.5">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-14 h-14 rounded-lg object-cover shrink-0 border border-stone-200"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Barang yang dipinjam
                </span>
                <p className="font-bold text-sm text-stone-900 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-stone-600">
                  Pemilik: {item.ownerName} ({item.ownerLocation})
                </p>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2 text-xs text-rose-800">
                <WarningCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Borrower Name */}
            <div className="space-y-1.5">
              <label 
                htmlFor="borrowerName" 
                className="block text-xs font-semibold text-stone-700"
              >
                Nama Lengkap Peminjam <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User size={16} />
                </div>
                <input
                  id="borrowerName"
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Borrower Contact / Location */}
            <div className="space-y-1.5">
              <label 
                htmlFor="borrowerContact" 
                className="block text-xs font-semibold text-stone-700"
              >
                Kontak / Alamat Rumah di Komunitas <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Phone size={16} />
                </div>
                <input
                  id="borrowerContact"
                  type="text"
                  required
                  placeholder="Contoh: Blok B-07 / 0812-xxxx-xxxx"
                  value={borrowerContact}
                  onChange={(e) => setBorrowerContact(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Dates: Start & End */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label 
                  htmlFor="startDate" 
                  className="block text-xs font-semibold text-stone-700"
                >
                  Tanggal Pinjam <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="startDate"
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label 
                  htmlFor="endDate" 
                  className="block text-xs font-semibold text-stone-700"
                >
                  Rencana Kembali <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="endDate"
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Duration preview */}
            {durationDays > 0 && (
              <div className="flex items-center space-x-1.5 text-xs text-stone-600 bg-stone-100/70 px-3 py-1.5 rounded-lg border border-stone-200/60">
                <Clock size={14} className="text-stone-500" />
                <span>Perkiraan durasi: <strong className="text-stone-900">{durationDays} hari</strong> peminjaman</span>
              </div>
            )}

            {/* Optional Notes */}
            <div className="space-y-1.5">
              <label 
                htmlFor="notes" 
                className="block text-xs font-semibold text-stone-700"
              >
                Catatan Opsional (Keperluan penggunaan)
              </label>
              <textarea
                id="notes"
                rows={2}
                placeholder="Contoh: Mau pasang pigura foto di ruang tengah"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Community Care Agreement */}
            <label className="flex items-start space-x-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100/60 transition-colors">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-[#1E3A2B] focus:ring-[#1E3A2B]"
              />
              <span className="text-xs text-stone-700 leading-snug">
                Saya berkomitmen merawat barang ini sebaik milik sendiri, menjaga kebersihannya, dan mengembalikan tepat waktu.
              </span>
            </label>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1E3A2B] text-white hover:bg-[#162c20] transition-colors shadow-sm"
              >
                <CheckCircle size={16} weight="bold" />
                <span>Kirim Pengajuan</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
