import type { Item, LoanRequest } from '../types';
import { INITIAL_ITEMS, INITIAL_LOAN_REQUESTS } from '../data/mockData';

// ponytail: use standard browser localStorage without external state library
const ITEMS_STORAGE_KEY = 'lot_items_data_v1';
const LOANS_STORAGE_KEY = 'lot_loans_data_v1';

export const storageService = {
  getItems(): Item[] {
    try {
      const stored = localStorage.getItem(ITEMS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Gagal membaca data barang dari localStorage, menggunakan data bawaan', e);
    }
    // Inisialisasi awal dengan data demo
    this.saveItems(INITIAL_ITEMS);
    return INITIAL_ITEMS;
  },

  saveItems(items: Item[]): void {
    try {
      localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Gagal menyimpan data barang ke localStorage', e);
    }
  },

  getLoans(): LoanRequest[] {
    try {
      const stored = localStorage.getItem(LOANS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Gagal membaca riwayat peminjaman dari localStorage', e);
    }
    // Inisialisasi awal dengan data demo
    this.saveLoans(INITIAL_LOAN_REQUESTS);
    return INITIAL_LOAN_REQUESTS;
  },

  saveLoans(loans: LoanRequest[]): void {
    try {
      localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify(loans));
    } catch (e) {
      console.error('Gagal menyimpan riwayat peminjaman ke localStorage', e);
    }
  },

  resetAllToDefault(): { items: Item[]; loans: LoanRequest[] } {
    localStorage.removeItem(ITEMS_STORAGE_KEY);
    localStorage.removeItem(LOANS_STORAGE_KEY);
    this.saveItems(INITIAL_ITEMS);
    this.saveLoans(INITIAL_LOAN_REQUESTS);
    return {
      items: INITIAL_ITEMS,
      loans: INITIAL_LOAN_REQUESTS,
    };
  }
};
