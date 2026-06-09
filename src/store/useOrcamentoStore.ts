import { create } from "zustand";
import type { Orcamento, OrcamentoItem } from "../types/products.entities";

interface OrcamentoState {
  orcamentoAtivo: Orcamento | null;
  orcamentos: Orcamento[];
  criarOrcamento: (cliente: string, veiculo: string) => string;
  adicionarItemOrcamento: (item: OrcamentoItem) => void;
  removerItemOrcamento: (itemId: string) => void;
  atualizarItemOrcamento: (itemId: string, item: Partial<OrcamentoItem>) => void;
  atualizarDesconto: (desconto: number) => void;
  salvarOrcamento: (status: Orcamento["status"]) => void;
  carregarOrcamento: (id: string) => void;
  deleteOrcamento: (id: string) => void;
  limparOrcamentoAtivo: () => void;
  setOrcamentoAtivo: (orcamento: Orcamento | null) => void;
}

export const useOrcamentoStore = create<OrcamentoState>((set) => ({
  orcamentoAtivo: null,
  orcamentos: [],

  criarOrcamento: (cliente: string, veiculo: string) => {
    const id = `ORC-${Date.now()}`;
    const novoOrcamento: Orcamento = {
      id,
      cliente_nome: cliente,
      veiculo_modelo: veiculo,
      data_criacao: new Date().toISOString().split("T")[0],
      items: [],
      desconto_total: null,
      total: 0,
      status: "Rascunho",
      observacoes: null,
    };
    set({ orcamentoAtivo: novoOrcamento });
    return id;
  },

  adicionarItemOrcamento: (item: OrcamentoItem) => {
    set((state) => {
      if (!state.orcamentoAtivo) return state;
      const novoOrcamento = { ...state.orcamentoAtivo };
      novoOrcamento.items.push(item);
      novoOrcamento.total = novoOrcamento.items.reduce((sum, i) => sum + i.subtotal, 0);
      if (novoOrcamento.desconto_total) {
        novoOrcamento.total -= novoOrcamento.desconto_total;
      }
      return { orcamentoAtivo: novoOrcamento };
    });
  },

  removerItemOrcamento: (itemId: string) => {
    set((state) => {
      if (!state.orcamentoAtivo) return state;
      const novoOrcamento = { ...state.orcamentoAtivo };
      novoOrcamento.items = novoOrcamento.items.filter((i) => i.id !== itemId);
      novoOrcamento.total = novoOrcamento.items.reduce((sum, i) => sum + i.subtotal, 0);
      if (novoOrcamento.desconto_total) {
        novoOrcamento.total -= novoOrcamento.desconto_total;
      }
      return { orcamentoAtivo: novoOrcamento };
    });
  },

  atualizarItemOrcamento: (itemId: string, item: Partial<OrcamentoItem>) => {
    set((state) => {
      if (!state.orcamentoAtivo) return state;
      const novoOrcamento = { ...state.orcamentoAtivo };
      novoOrcamento.items = novoOrcamento.items.map((i) =>
        i.id === itemId ? { ...i, ...item } : i
      );
      novoOrcamento.total = novoOrcamento.items.reduce((sum, i) => sum + i.subtotal, 0);
      if (novoOrcamento.desconto_total) {
        novoOrcamento.total -= novoOrcamento.desconto_total;
      }
      return { orcamentoAtivo: novoOrcamento };
    });
  },

  atualizarDesconto: (desconto: number) => {
    set((state) => {
      if (!state.orcamentoAtivo) return state;
      const novoOrcamento = { ...state.orcamentoAtivo };
      novoOrcamento.desconto_total = desconto;
      const subtotal = novoOrcamento.items.reduce((sum, i) => sum + i.subtotal, 0);
      novoOrcamento.total = subtotal - desconto;
      return { orcamentoAtivo: novoOrcamento };
    });
  },

  salvarOrcamento: (status: Orcamento["status"]) => {
    set((state) => {
      if (!state.orcamentoAtivo) return state;
      const orcamentoSalvo = { ...state.orcamentoAtivo, status };
      const orcamentosAtualizados = state.orcamentos.filter(
        (o) => o.id !== orcamentoSalvo.id
      );
      orcamentosAtualizados.push(orcamentoSalvo);
      return {
        orcamentos: orcamentosAtualizados,
        orcamentoAtivo: null,
      };
    });
  },

  carregarOrcamento: (id: string) => {
    set((state) => {
      const orcamento = state.orcamentos.find((o) => o.id === id);
      if (orcamento) {
        return { orcamentoAtivo: { ...orcamento } };
      }
      return state;
    });
  },

  deleteOrcamento: (id: string) => {
    set((state) => ({
      orcamentos: state.orcamentos.filter((o) => o.id !== id),
      orcamentoAtivo: state.orcamentoAtivo?.id === id ? null : state.orcamentoAtivo,
    }));
  },

  limparOrcamentoAtivo: () => {
    set({ orcamentoAtivo: null });
  },

  setOrcamentoAtivo: (orcamento: Orcamento | null) => {
    set({ orcamentoAtivo: orcamento });
  },
}));
