import { create } from "zustand";
import { Orcamento, OrcamentoItem } from "@/types/sales.entities";

export type Product = {
  code: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
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
  activeSaleItems: OrcamentoItem[];
  discountValue: number;
  budgets: Orcamento[];
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
  setActiveSaleItems: (value: OrcamentoItem[] | ((prev: OrcamentoItem[]) => OrcamentoItem[])) => void;
  setDiscountValue: (value: number) => void;
  setBudgets: (value: Orcamento[] | ((prev: Orcamento[]) => Orcamento[])) => void;
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
  budgets: [
    {
      id: "ORC-1",
      cliente_nome: "João Silva",
      cliente_id: null,
      telefone: null,
      veiculo_modelo: "Fiat Uno 1.0 2012",
      data_criacao: "09/06/2026",
      total: 232.40,
      status: "Enviado",
      desconto_total: 0,
      items: [
        {
          id: "FP-1092",
          produto_id: 1,
          codigo_produto: "FP-1092",
          nome_produto: "Pastilha de Freio Cobreq (Par)",
          marca_produto: "Cobreq",
          quantidade: 1,
          preco_unitario: 189.9,
          subtotal: 189.9
        },
        {
          id: "OL-3021",
          produto_id: 2,
          codigo_produto: "OL-3021",
          nome_produto: "Óleo Motor Selenia 5W30 1L",
          marca_produto: "Selenia",
          quantidade: 1,
          preco_unitario: 42.5,
          subtotal: 42.5
        }
      ]
    },
    {
      id: "ORC-2",
      cliente_nome: "Maria Oliveira",
      cliente_id: null,
      telefone: null,
      veiculo_modelo: "Chevrolet Onix 1.4 2018",
      data_criacao: "08/06/2026",
      total: 549.00,
      status: "Aprovado",
      desconto_total: 0,
      items: [
        {
          id: "BD-4503",
          produto_id: 3,
          codigo_produto: "BD-4503",
          nome_produto: "Bateria Moura 60Ah",
          marca_produto: "Moura",
          quantidade: 1,
          preco_unitario: 549.0,
          subtotal: 549.0
        }
      ]
    }
  ],
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
