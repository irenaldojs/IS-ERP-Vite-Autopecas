import { useState, useEffect } from "react";
import { Button } from "@fluentui/react-components";
import { X, Search, FileText, ClipboardList } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Orcamento } from "@/types/sales.entities";
import { useEscapeKey } from "@/hooks/useEscapeKey";

interface SavedBudgetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBudget: (budget: Orcamento) => void;
}

export function SavedBudgetsModal({ isOpen, onClose, onSelectBudget }: SavedBudgetsModalProps) {
  const budgets = useAppStore((state) => state.budgets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBudget, setSelectedBudget] = useState<Orcamento | null>(null);

  useEscapeKey(isOpen, onClose);

  // Keyboard navigation inside search results modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
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
      (b.cliente_nome?.toLowerCase() || "").includes(query) ||
      b.veiculo_modelo.toLowerCase().includes(query) ||
      b.data_criacao.toLowerCase().includes(query)
    );
  });

  const activeBudget = selectedBudget && filteredBudgets.some((b) => b.id === selectedBudget.id)
    ? selectedBudget
    : filteredBudgets[0] || null;

  return (
    <div 
      className="fixed inset-0 z-55 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--colorNeutralBackground3)] border border-[var(--colorNeutralStroke1)] rounded w-full max-w-6xl h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[var(--colorNeutralStroke1)] p-4 bg-[var(--colorNeutralBackground2)]">
          <div>
            <h3 className="text-sm font-bold text-[var(--colorNeutralForeground1)] flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-[var(--colorBrandStroke1)]" />
              Pesquisar Orçamentos Salvos
            </h3>
            <p className="text-xs text-[var(--colorNeutralForeground3)] mt-0.5 font-sans">Selecione um orçamento salvo para carregar os itens e dados da venda.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[var(--colorNeutralBackground3Hover)] border border-[var(--colorNeutralStroke1)] rounded text-[var(--colorNeutralForeground2)] hover:text-[var(--colorNeutralForeground1)] transition-all cursor-pointer focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-[var(--colorNeutralStroke1)] bg-[var(--colorNeutralBackground1)]">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Pesquisar por Cliente, Veículo, ID ou Data..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedBudget(null);
              }}
              className="w-full pl-9 pr-4 py-2 bg-[var(--colorNeutralBackground3)] border border-[var(--colorNeutralStroke1)] rounded text-xs text-[var(--colorNeutralForeground1)] focus:outline-none focus:border-[var(--colorBrandStroke1)] transition-colors h-[36px]"
              autoFocus
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--colorNeutralForeground3)]" />
          </div>
        </div>

        {/* Table & Details Split */}
        <div className="flex-grow flex min-h-0">
          {/* List Table */}
          <div className="flex-grow overflow-y-auto border-r border-[var(--colorNeutralStroke1)] bg-[var(--colorNeutralBackground1)]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-[var(--colorNeutralBackground2)] z-10">
                <tr className="border-b border-[var(--colorNeutralStroke1)] text-[var(--colorNeutralForeground2)] font-bold bg-[var(--colorNeutralBackground2)]">
                  <th className="py-2 px-3 pl-4">ID</th>
                  <th className="py-2 px-3">Cliente</th>
                  <th className="py-2 px-3">Veículo</th>
                  <th className="py-2 px-3">Data</th>
                  <th className="py-2 px-3 text-right">Total</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--colorNeutralStroke1)]/20">
                {filteredBudgets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-[var(--colorNeutralForeground3)]">
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
                        className={`hover:bg-[var(--colorSubtleBackgroundHover)] cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[var(--colorSubtleBackgroundSelected)] font-semibold text-[var(--colorNeutralForeground1Selected)] border-l-4 border-[var(--colorBrandStroke1)]"
                            : idx % 2 === 0
                            ? "bg-[var(--colorNeutralBackground1)]"
                            : "bg-[var(--colorNeutralBackground2)]"
                        }`}
                      >
                        <td className="py-2.5 px-3 pl-4 font-mono text-[var(--colorNeutralForeground3)]">{budget.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-[var(--colorNeutralForeground1)]">{budget.cliente_nome}</td>
                        <td className="py-2.5 px-3 text-[var(--colorNeutralForeground2)]">{budget.veiculo_modelo}</td>
                        <td className="py-2.5 px-3 text-[var(--colorNeutralForeground3)]">{budget.data_criacao}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[var(--colorBrandStroke1)]">
                          R$ {budget.total.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            budget.status === "Enviado" || budget.status === "Rascunho"
                              ? "bg-[var(--colorPaletteRedBackground1)] text-[var(--colorPaletteRedForeground1)] border border-[var(--colorPaletteRedBorder1)]"
                              : "bg-[var(--colorPaletteGreenBackground1)] text-[var(--colorPaletteGreenForeground1)] border border-[var(--colorPaletteGreenBorder1)]"
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
          <div className="w-80 bg-[var(--colorNeutralBackground2)] p-4 flex flex-col justify-between shrink-0 overflow-y-auto border-l border-[var(--colorNeutralStroke1)]">
            <div className="flex flex-col h-full justify-between">
              <div>
                <h4 className="text-xs font-bold text-[var(--colorNeutralForeground3)] uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-[var(--colorNeutralStroke1)] pb-2 font-sans">
                  <FileText className="h-4 w-4 text-[var(--colorBrandStroke1)]" />
                  Itens do Orçamento
                </h4>
                {activeBudget ? (
                  <div className="space-y-4">
                    {/* Items list preview */}
                    <div className="space-y-2">
                      <div className="max-h-[50vh] overflow-y-auto divide-y divide-[var(--colorNeutralStroke1)]/20 pr-1">
                        {activeBudget.items && activeBudget.items.length > 0 ? (
                          activeBudget.items.map((item, index) => (
                            <div key={index} className="py-2 text-xs flex justify-between gap-2">
                              <div className="truncate">
                                <span className="text-[var(--colorNeutralForeground1)] font-semibold block truncate">{item.nome_produto}</span>
                                <span className="text-[10px] text-[var(--colorNeutralForeground3)]">{item.marca_produto} | Qtd: {item.quantidade}</span>
                              </div>
                              <span className="text-[var(--colorNeutralForeground2)] font-bold shrink-0">R$ {item.subtotal.toFixed(2)}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-[var(--colorNeutralForeground3)] italic">Sem itens salvos neste orçamento</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-[var(--colorNeutralForeground3)] py-10 text-xs italic">
                    Selecione um orçamento para ver os itens
                  </div>
                )}
              </div>

              {activeBudget && (
                <div className="mt-4 pt-4 border-t border-[var(--colorNeutralStroke1)]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-[var(--colorNeutralForeground3)] uppercase">Soma Total:</span>
                    <span className="text-lg font-black text-[var(--colorBrandStroke1)]">R$ {activeBudget.total.toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={() => onSelectBudget(activeBudget)}
                    appearance="primary"
                    style={{ width: "100%", height: "36px" }}
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
