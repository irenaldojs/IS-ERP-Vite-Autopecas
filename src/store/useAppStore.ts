import { create } from "zustand";

export type Product = {
  code: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
};

export type SaleItem = {
  id: string;
  code: string;
  originalCode?: string;
  name: string;
  brand: string;
  reference?: string;
  qty: number;
  price: number;
};

export type Budget = {
  id: string;
  client: string;
  vehicle: string;
  date: string;
  total: number;
  status: string;
};

export type PreSale = {
  id: string;
  client: string;
  seller: string;
  date: string;
  total: number;
  status: string;
};

export type Invoice = {
  id: string;
  type: string;
  client: string;
  date: string;
  total: number;
  status: string;
};

export const CATALOG_PRODUCTS: Product[] = [
  { code: "FP-1092", name: "Pastilha de Freio Cobreq (Par)", brand: "Cobreq", price: 189.9, stock: 12 },
  { code: "OL-3021", name: "Óleo Motor Selenia 5W30 1L", brand: "Selenia", price: 42.5, stock: 4 },
  { code: "BD-4503", name: "Bateria Moura 60Ah", brand: "Moura", price: 549.0, stock: 7 },
];

interface AppState {
  clientName: string;
  vehicleName: string;
  productSearchQuery: string;
  showProductSuggestions: boolean;
  activeSaleItems: SaleItem[];
  discountValue: number;
  budgets: Budget[];
  preSales: PreSale[];
  invoices: Invoice[];
  openingBalance: number;
  cashOutflow: number;
  cashInflow: number;
  currentBalance: number;
  isCaixaMaximized: boolean;
  setClientName: (value: string) => void;
  setVehicleName: (value: string) => void;
  setProductSearchQuery: (value: string) => void;
  setShowProductSuggestions: (value: boolean) => void;
  setActiveSaleItems: (value: SaleItem[] | ((prev: SaleItem[]) => SaleItem[])) => void;
  setDiscountValue: (value: number) => void;
  setBudgets: (value: Budget[] | ((prev: Budget[]) => Budget[])) => void;
  setPreSales: (value: PreSale[] | ((prev: PreSale[]) => PreSale[])) => void;
  setInvoices: (value: Invoice[] | ((prev: Invoice[]) => Invoice[])) => void;
  setIsCaixaMaximized: (value: boolean) => void;
  receivePreSale: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  clientName: "",
  vehicleName: "",
  productSearchQuery: "",
  showProductSuggestions: false,
  activeSaleItems: [],
  discountValue: 0,
  budgets: [],
  preSales: [],
  invoices: [],
  openingBalance: 5420,
  cashOutflow: 1180,
  cashInflow: 4640,
  currentBalance: 8880,
  isCaixaMaximized: false,
  setClientName: (value) => set({ clientName: value }),
  setVehicleName: (value) => set({ vehicleName: value }),
  setProductSearchQuery: (value) => set({ productSearchQuery: value }),
  setShowProductSuggestions: (value) => set({ showProductSuggestions: value }),
  setActiveSaleItems: (value) =>
    set((state) => ({
      activeSaleItems: typeof value === "function" ? value(state.activeSaleItems) : value,
    })),
  setDiscountValue: (value) => set({ discountValue: value }),
  setBudgets: (value) =>
    set((state) => ({ budgets: typeof value === "function" ? value(state.budgets) : value })),
  setPreSales: (value) =>
    set((state) => ({ preSales: typeof value === "function" ? value(state.preSales) : value })),
  setInvoices: (value) =>
    set((state) => ({ invoices: typeof value === "function" ? value(state.invoices) : value })),
  setIsCaixaMaximized: (value) => set({ isCaixaMaximized: value }),
  receivePreSale: (id) =>
    set((state) => ({
      preSales: state.preSales.map((sale) =>
        sale.id === id ? { ...sale, status: "Pago" } : sale
      ),
    })),
}));
