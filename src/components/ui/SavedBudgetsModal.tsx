import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Search, FileText, ClipboardList } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Orcamento } from "@/types/sales.entities";

interface SavedBudgetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBudget: (budget: Orcamento) => void;
}

export function SavedBudgetsModal({ isOpen, onClose, onSelectBudget }: SavedBudgetsModalProps) {
  const budgets = useAppStore((state) => state.budgets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBudget, setSelectedBudget] = useState<Orcamento | null>(null);

  // Keyboard navigation inside search results modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const currentIndex = filteredBudgets.findIndex((b) => b.id === selectedBudget?.id);
        if (currentIndex < filteredBudgets.length - 1) {
          setSelectedBudget(filteredBudgets[currentIndex + 1]);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const currentIndex = filteredBudgets.findIndex((b) => b.id === selectedBudget?.id);
        if (currentIndex > 0) {
          setSelectedBudget(filteredBudgets[currentIndex - 1]);
        }
      } else if (e.key === "Enter") {
        if (selectedBudget) {
          e.preventDefault();
          onSelectBudget(selectedBudget);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, budgets, selectedBudget, searchQuery]);

  if (!isOpen) return null;

  const filteredBudgets = budgets.filter((b) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      b.id.toLowerCase().includes(query) ||
      b.cliente_nome.toLowerCase().includes(query) ||
      b.veiculo_modelo.toLowerCase().includes(query) ||
      b.data_criacao.toLowerCase().includes(query)
    );
  });

  const activeBudget = selectedBudget && filteredBudgets.some((b) => b.id === selectedBudget.id)
    ? selectedBudget
    : filteredBudgets[0] || null;

  return (
    <div 
      className="fixed inset-0 z-55 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#0e1626] border border-slate-800 rounded-xl w-full max-w-6xl h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-205"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 p-4 bg-[#0e1626]/50">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-indigo-400" />
              Pesquisar Orçamentos Salvos
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Selecione um orçamento salvo para carregar os itens e dados da venda.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#16223f] border border-slate-850 hover:border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-800 bg-[#0e1626]/20">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Pesquisar por Cliente, Veículo, ID ou Data..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedBudget(null);
              }}
              className="w-full pl-9 pr-4 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[36px]"
              autoFocus
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-550" />
          </div>
        </div>

        {/* Table & Details Split */}
        <div className="flex-grow flex min-h-0">
          {/* List Table */}
          <div className="flex-grow overflow-y-auto border-r border-slate-800/60 bg-[#070a13]/10">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-[#0e1626] z-10">
                <tr className="border-b border-slate-800 text-slate-400 font-bold bg-[#0e1626]">
                  <th className="py-2 px-3 pl-4">ID</th>
                  <th className="py-2 px-3">Cliente</th>
                  <th className="py-2 px-3">Veículo</th>
                  <th className="py-2 px-3">Data</th>
                  <th className="py-2 px-3 text-right">Total</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/30">
                {filteredBudgets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-slate-500">
                      Nenhum orçamento encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredBudgets.map((budget, idx) => {
                    const isSelected = activeBudget?.id === budget.id;
                    return (
                      <tr
                        key={budget.id}
                        onClick={() => setSelectedBudget(budget)}
                        onDoubleClick={() => onSelectBudget(budget)}
                        className={`hover:bg-[#16223f]/40 cursor-pointer transition-all ${
                          isSelected
                            ? "bg-indigo-600/25 font-semibold text-white border-l-2 border-indigo-500"
                            : idx % 2 === 0
                            ? "bg-[#0f192e]"
                            : "bg-[#09101f]"
                        }`}
                      >
                        <td className="py-2.5 px-3 pl-4 font-mono text-slate-300">{budget.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-200">{budget.cliente_nome}</td>
                        <td className="py-2.5 px-3 text-slate-300">{budget.veiculo_modelo}</td>
                        <td className="py-2.5 px-3 text-slate-400">{budget.data_criacao}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-indigo-400">
                          R$ {budget.total.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            budget.status === "Enviado" || budget.status === "Rascunho"
                              ? "bg-amber-950/40 text-amber-400 border border-amber-800/30"
                              : "bg-emerald-950/40 text-emerald-400 border border-emerald-800/30"
                          }`}>
                            {budget.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Right Preview Panel (Budget Items Summary) */}
          <div className="w-80 bg-[#0e1626]/40 p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div className="flex flex-col h-full justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-350 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <FileText className="h-4 w-4 text-indigo-400" />
                  Itens do Orçamento
                </h4>
                {activeBudget ? (
                  <div className="space-y-4">
                    {/* Items list preview */}
                    <div className="space-y-2">
                      <div className="max-h-[50vh] overflow-y-auto divide-y divide-slate-850/50 pr-1">
                        {activeBudget.items && activeBudget.items.length > 0 ? (
                          activeBudget.items.map((item, index) => (
                            <div key={index} className="py-2 text-xs flex justify-between gap-2">
                              <div className="truncate">
                                <span className="text-slate-200 font-semibold block truncate">{item.nome_produto}</span>
                                <span className="text-[10px] text-slate-500">{item.marca_produto} | Qtd: {item.quantidade}</span>
                              </div>
                              <span className="text-slate-250 font-bold shrink-0">R$ {item.subtotal.toFixed(2)}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-slate-550 italic">Sem itens salvos neste orçamento</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-550 py-10 text-xs italic">
                    Selecione um orçamento para ver os itens
                  </div>
                )}
              </div>

              {activeBudget && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase">Soma Total:</span>
                    <span className="text-lg font-black text-indigo-400">R$ {activeBudget.total.toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={() => onSelectBudget(activeBudget)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 h-[36px] rounded-lg cursor-pointer"
                  >
                    Carregar Orçamento
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
