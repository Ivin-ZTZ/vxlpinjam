export type ItemCategory = 
  | 'Semua'
  | 'Pertukangan'
  | 'Rumah Tangga'
  | 'Elektronik'
  | 'Camping & Outdoor'
  | 'Olahraga & Hobi';

export type ItemCondition = 'Sangat Baik' | 'Baik' | 'Cukup';

export type ItemStatus = 'Tersedia' | 'Sedang Dipinjam';

export type LoanStatus = 
  | 'Menunggu Persetujuan'
  | 'Disetujui'
  | 'Sedang Dipinjam'
  | 'Dikembalikan'
  | 'Ditolak';

export interface Item {
  id: string;
  name: string;
  category: Exclude<ItemCategory, 'Semua'>;
  condition: ItemCondition;
  conditionNote: string;
  ownerName: string;
  ownerLocation: string; // e.g. "Blok B-03, RT 04"
  status: ItemStatus;
  currentBorrowerName?: string;
  returnDueDate?: string;
  imageUrl: string;
  description: string;
  careInstructions: string;
  createdAt: string;
}

export interface LoanRequest {
  id: string;
  itemId: string;
  itemName: string;
  itemCategory: string;
  borrowerName: string;
  borrowerContact: string; // e.g. "Blok A-10 / 0812..."
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  notes?: string;
  status: LoanStatus;
  createdAt: string;
  adminNote?: string;
}

export type UserRole = 'member' | 'admin';
