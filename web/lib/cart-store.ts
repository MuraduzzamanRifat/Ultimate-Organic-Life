'use client';

/**
 * Cart store — Zustand with localStorage persistence.
 * The cart only stores { id, qty }; full product data is hydrated from API/SSR.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartLine = { id: string; qty: number };

type CartState = {
  lines: CartLine[];
  hydrated: boolean;
  open: boolean;

  add:    (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear:  () => void;

  setOpen: (v: boolean) => void;

  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      hydrated: false,
      open: false,

      add(id, qty = 1) {
        const lines = [...get().lines];
        const i = lines.findIndex(l => l.id === id);
        if (i === -1) lines.push({ id, qty });
        else lines[i] = { ...lines[i], qty: lines[i].qty + qty };
        set({ lines });
      },
      setQty(id, qty) {
        const lines = get().lines.flatMap(l => {
          if (l.id !== id) return [l];
          if (qty <= 0) return [];
          return [{ ...l, qty }];
        });
        set({ lines });
      },
      remove(id) {
        set({ lines: get().lines.filter(l => l.id !== id) });
      },
      clear() {
        set({ lines: [] });
      },

      setOpen(v) { set({ open: v }); },
      count()    { return get().lines.reduce((s, l) => s + l.qty, 0); },
    }),
    {
      name: 'greenkart.cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines }),
      onRehydrateStorage: () => (state) => { state && (state.hydrated = true); },
    },
  ),
);
