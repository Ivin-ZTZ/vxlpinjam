import React, { useState, useEffect } from 'react';
import type { Item, ItemCategory, ItemCondition, ItemStatus } from '../types';
import { 
  X, 
  Package, 
  CheckCircle,
  WarningCircle,
  PencilSimple
} from '@phosphor-icons/react';

interface ItemFormModalProps {
  itemToEdit: Item | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<Item, 'id' | 'createdAt'> & { id?: string }) => void;
}

// Preset photo options to help during demonstration
const PRESET_PHOTOS = [
  { label: 'Perkakas / Bor', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tangga / Alat', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Proyektor', url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tenda Camping', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80' },
  { label: 'High Pressure / Cuci', url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80' },
  { label: 'Set Kunci Pas', url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Vacuum Cleaner', url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80' },
  { label: 'Raket Olahraga', url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80' },
  { label: 'Alat Berkebun', url: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=800&q=80' },
];

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  itemToEdit,
  isOpen,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(itemToEdit);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exclude<ItemCategory, 'Semua'>>('Pertukangan');
  const [condition, setCondition] = useState<ItemCondition>('Sangat Baik');
  const [conditionNote, setConditionNote] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerLocation, setOwnerLocation] = useState('');
  const [status, setStatus] = useState<ItemStatus>('Tersedia');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Populate data when itemToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setName(itemToEdit.name);
        setCategory(itemToEdit.category);
        setCondition(itemToEdit.condition);
        setConditionNote(itemToEdit.conditionNote);
        setOwnerName(itemToEdit.ownerName);
        setOwnerLocation(itemToEdit.ownerLocation);
        setStatus(itemToEdit.status);
        setImageUrl(itemToEdit.imageUrl);
        setDescription(itemToEdit.description);
        setCareInstructions(itemToEdit.careInstructions);
      } else {
        // Reset defaults for new item
        setName('');
        setCategory('Pertukangan');
        setCondition('Sangat Baik');
        setConditionNote('Kondisi prima dan siap digunakan.');
        setOwnerName('');
        setOwnerLocation('Blok B, RT 04');
        setStatus('Tersedia');
        setImageUrl(PRESET_PHOTOS[0].url);
        setDescription('');
        setCareInstructions('Harap dibersihkan setelah pemakaian dan dikembalikan ke wadah aslinya.');
      }
      setErrorMessage(null);
    }
  }, [isOpen, itemToEdit]);

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Nama barang wajib diisi.');
      return;
    }
    if (!ownerName.trim()) {
      setErrorMessage('Nama pemilik wajib diisi.');
      return;
    }
    if (!imageUrl.trim()) {
      setErrorMessage('Tautan gambar wajib diisi.');
      return;
    }

    onSave({
      ...(itemToEdit ? { id: itemToEdit.id } : {}),
      name: name.trim(),
      category,
      condition,
      conditionNote: conditionNote.trim() || 'Kondisi normal siap pakai.',
      ownerName: ownerName.trim(),
      ownerLocation: ownerLocation.trim() || 'Lingkungan RT',
      status,
      imageUrl: imageUrl.trim(),
      description: description.trim() || 'Barang milik bersama warga komunitas.',
      careInstructions: careInstructions.trim() || 'Bersihkan dan simpan dengan baik.',
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
        <div className="relative bg-white w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-stone-200 transform transition-all">
          
          {/* Header */}
          <div className="px-5 sm:px-7 pt-6 pb-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center">
                {isEditing ? <PencilSimple size={20} weight="bold" /> : <Package size={20} weight="bold" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900">
                  {isEditing ? 'Edit Informasi Barang' : 'Tambah Barang Baru ke Katalog'}
                </h2>
                <p className="text-xs text-stone-500">
                  {isEditing ? 'Perbarui data barang di inventaris komunitas' : 'Daftarkan barang yang bisa dipinjamkan oleh warga'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Tutup form"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4 max-h-[75vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2 text-xs text-rose-800">
                <WarningCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Nama Barang */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Nama Barang <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Bor Listrik Impact Drill 13mm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all"
              />
            </div>

            {/* Kategori & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all"
                >
                  <option value="Pertukangan">Pertukangan</option>
                  <option value="Rumah Tangga">Rumah Tangga</option>
                  <option value="Elektronik">Elektronik</option>
                  <option value="Camping & Outdoor">Camping & Outdoor</option>
                  <option value="Olahraga & Hobi">Olahraga & Hobi</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Status Ketersediaan
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all"
                >
                  <option value="Tersedia">Tersedia</option>
                  <option value="Sedang Dipinjam">Sedang Dipinjam</option>
                </select>
              </div>
            </div>

            {/* Kondisi & Catatan Kondisi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Kondisi Fisik
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all"
                >
                  <option value="Sangat Baik">Sangat Baik</option>
                  <option value="Baik">Baik</option>
                  <option value="Cukup">Cukup</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Catatan Kondisi Barang
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bodi mulus, mata bor lengkap dalam koper"
                  value={conditionNote}
                  onChange={(e) => setConditionNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Pemilik & Lokasi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Nama Pemilik <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pak Budi"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Lokasi / Blok Rumah
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Blok B-03, RT 04"
                  value={ownerLocation}
                  onChange={(e) => setOwnerLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Foto URL & Preset Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700">
                Tautan Foto Gambar <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all"
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                )}
              </div>
              {/* Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] text-stone-500">
                <span className="shrink-0 font-medium">Pilihan cepat:</span>
                {PRESET_PHOTOS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 whitespace-nowrap transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Deskripsi Singkat Barang
              </label>
              <textarea
                rows={2}
                placeholder="Spesifikasi atau informasi kegunaan barang..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Instruksi Perawatan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Instruksi Penggunaan & Perawatan
              </label>
              <textarea
                rows={2}
                placeholder="Petunjuk khusus agar barang tetap awet dan aman..."
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Actions */}
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
                className="inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1E3A2B] text-white hover:bg-[#162c20] transition-colors shadow-sm"
              >
                <CheckCircle size={16} weight="bold" />
                <span>{isEditing ? 'Simpan Perubahan' : 'Daftarkan Barang'}</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
