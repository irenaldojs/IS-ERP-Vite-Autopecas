import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Search, FolderOpen } from "lucide-react";
import { ProductSearchModal } from "@/components/ui/ProductSearchModal";
import { SavedBudgetsModal } from "@/components/ui/SavedBudgetsModal";
import { SaveBudgetModal } from "@/components/ui/SaveBudgetModal";
import { SavePreVendaModal } from "@/components/ui/SavePreVendaModal";
import { useAppStore } from "@/store/useAppStore";
import {
  produtos,
  produtoGrupos,
  produtoMarcas,
  imagens,
  produtoImagens,
} from "../../../../mocks/products.mock";

import type { Orcamento as OrcamentoType, OrcamentoItem } from "@/types/sales.entities";

type Product = { code: string; originalCode?: string; name: string; brand: string; price: number; stock?: number; reference?: string };

type Props = {
  clientName: string;
  setClientName: (v: string) => void;
  vehicleName: string;
  setVehicleName: (v: string) => void;
  productSearchQuery: string;
  setProductSearchQuery: (v: string) => void;
  showProductSuggestions: boolean;
  setShowProductSuggestions: (v: boolean) => void;
  filteredCatalog: Product[];
  activeSaleItems: OrcamentoItem[];
  setActiveSaleItems: (fn: ((prev: OrcamentoItem[]) => OrcamentoItem[]) | OrcamentoItem[]) => void;
  subtotalSale: number;
  discountValue: number;
  setDiscountValue: (v: number) => void;
  totalSale: number;
  handleSaveBudget: (data?: {
    id?: string;
    cliente_nome: string;
    cliente_id?: number | null;
    telefone?: number | null;
    veiculo_modelo: string;
    desconto_total: number;
    data_validade?: string | null;
    status: OrcamentoType["status"];
    observacoes?: string | null;
  }) => void;
  handleSavePreSale: (data?: {
    client: string;
    clientId?: number | null;
    provisionalContact?: string;
    sellerId: number;
    discount: number;
    notes: string;
  }) => void;
  showToast: (msg: string, type?: "success" | "info" | "error") => void;
};

export default function Orcamento(props: Props) {
  const {
    productSearchQuery,
    setProductSearchQuery,
    activeSaleItems,
    setActiveSaleItems,
    totalSale,
    handleSaveBudget,
    handleSavePreSale,
    showToast,
    setClientName,
    setVehicleName,
    setDiscountValue,
  } = props;

  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);
  const [selectedItemCode, setSelectedItemCode] = useState<string | null>(null);
  const inputIdRef = useRef<HTMLInputElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  // Search Modal state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSavedBudgetsModalOpen, setIsSavedBudgetsModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [loadedBudgetId, setLoadedBudgetId] = useState<string | null>(null);
  const budgets = useAppStore((state) => state.budgets);
  const loadedBudget = loadedBudgetId ? budgets.find((b) => b.id === loadedBudgetId) : null;

  const handleSelectBudget = (budget: OrcamentoType) => {
    setClientName(budget.cliente_nome);
    setVehicleName(budget.veiculo_modelo);
    setDiscountValue(budget.desconto_total || 0);
    if (budget.items) {
      setActiveSaleItems(budget.items);
    } else {
      setActiveSaleItems([]);
    }
    setLoadedBudgetId(budget.id);
    showToast(`Orçamento ${budget.id} carregado!`, "success");
    setIsSavedBudgetsModalOpen(false);
  };

  const handleConfirmSaveBudget = (data: {
    cliente_nome: string;
    cliente_id: number | null;
    telefone: number | null;
    veiculo_modelo: string;
    desconto_total: number;
    data_validade: string | null;
    status: OrcamentoType["status"];
    observacoes: string;
    overwrite: boolean;
    enviar_whatsapp?: boolean;
  }) => {
    // Sync back client, vehicle, and discount to inputs
    setClientName(data.cliente_nome);
    setVehicleName(data.veiculo_modelo);
    setDiscountValue(data.desconto_total);
    
    const targetId = data.overwrite && loadedBudgetId ? loadedBudgetId : undefined;

    // Trigger save
    handleSaveBudget({
      id: targetId,
      cliente_nome: data.cliente_nome,
      cliente_id: data.cliente_id,
      telefone: data.telefone,
      veiculo_modelo: data.veiculo_modelo,
      desconto_total: data.desconto_total,
      data_validade: data.data_validade,
      status: data.status,
      observacoes: data.observacoes,
    });

    if (data.enviar_whatsapp) {
      showToast("Orçamento salvo e enviado para o WhatsApp com sucesso!", "success");
    }

    if (targetId) {
      setLoadedBudgetId(targetId);
    } else {
      const nextId = `ORC-${useAppStore.getState().budgets.length + 1}`;
      setLoadedBudgetId(nextId);
    }

    setIsSaveModalOpen(false);
  };

  const [isPreVendaModalOpen, setIsPreVendaModalOpen] = useState(false);

  // Focus ID input when search modal closes
  useEffect(() => {
    if (!isSearchModalOpen && !isSavedBudgetsModalOpen && !isSaveModalOpen && !isPreVendaModalOpen) {
      const timer = setTimeout(() => {
        inputIdRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchModalOpen, isSavedBudgetsModalOpen, isSaveModalOpen, isPreVendaModalOpen]);

  // Set selected item code when current searched product updates
  useEffect(() => {
    if (currentProduct) {
      setSelectedItemCode(currentProduct.code);
    }
  }, [currentProduct]);

  const handleSearchProduct = () => {
    if (productSearchQuery.trim()) {
      const searchVal = productSearchQuery.trim();
      const mockProd = produtos.find((p) => p.id.toString() === searchVal);
      
      if (mockProd) {
        const grupo = produtoGrupos.find(g => g.id === mockProd.grupo_id);
        const marca = produtoMarcas.find(m => m.id === mockProd.marca_id);
        
        const prod: Product = {
          code: mockProd.id.toString(),
          originalCode: mockProd.codigo_original,
          reference: mockProd.referencia || "",
          name: grupo?.descricao || "Produto Desconhecido",
          brand: marca?.nome || "Sem Marca",
          price: mockProd.preco,
          stock: 10
        };
        setCurrentProduct(prod);
      } else {
        setCurrentProduct(undefined);
        showToast("Produto não encontrado com este ID!", "error");
      }
    } else {
      setCurrentProduct(undefined);
    }
  };

  const handleClearList = () => {
    if (activeSaleItems.length === 0) {
      showToast("A lista já está vazia!", "info");
      return;
    }
    setActiveSaleItems([]);
    setSelectedItemCode(null);
    setCurrentProduct(undefined);
    setLoadedBudgetId(null);
    showToast("Lista de itens limpa!", "success");
  };

  const handleAddProduct = () => {
    if (!currentProduct) {
      if (productSearchQuery.trim()) {
        showToast("Busque o produto primeiro (Aperte Enter)", "info");
      }
      inputIdRef.current?.focus();
      return;
    }
    
    setActiveSaleItems((prev: OrcamentoItem[]) => {
      const existing = prev.find((item) => item.codigo_produto === currentProduct.code);
      if (existing) {
        return prev.map((item) =>
          item.codigo_produto === currentProduct.code
            ? { ...item, quantidade: item.quantidade + 1, subtotal: (item.quantidade + 1) * item.preco_unitario }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: currentProduct.code,
            produto_id: parseInt(currentProduct.code),
            codigo_produto: currentProduct.code,
            nome_produto: currentProduct.name,
            marca_produto: currentProduct.brand,
            quantidade: 1,
            preco_unitario: currentProduct.price,
            subtotal: currentProduct.price,
          },
        ];
      }
    });
    
    setSelectedItemCode(currentProduct.code);
    setProductSearchQuery("");
    setCurrentProduct(undefined);
    showToast(`${currentProduct.name} adicionado!`, "success");
    inputIdRef.current?.focus();
  };

  const handleAddProductFromModal = (prod: any) => {
    const group = produtoGrupos.find(g => g.id === prod.grupo_id);
    const brand = produtoMarcas.find(m => m.id === prod.marca_id);
    
    const productToAdd: Product = {
      code: prod.id.toString(),
      originalCode: prod.codigo_original,
      reference: prod.referencia || "",
      name: group?.descricao || "Produto Desconhecido",
      brand: brand?.nome || "Sem Marca",
      price: prod.preco,
      stock: 10
    };
    
    setActiveSaleItems((prev: OrcamentoItem[]) => {
      const existing = prev.find((item) => item.codigo_produto === productToAdd.code);
      if (existing) {
        return prev.map((item) =>
          item.codigo_produto === productToAdd.code
            ? { ...item, quantidade: item.quantidade + 1, subtotal: (item.quantidade + 1) * item.preco_unitario }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: productToAdd.code,
            produto_id: parseInt(productToAdd.code),
            codigo_produto: productToAdd.code,
            nome_produto: productToAdd.name,
            marca_produto: productToAdd.brand,
            quantidade: 1,
            preco_unitario: productToAdd.price,
            subtotal: productToAdd.price,
          },
        ];
      }
    });

    setSelectedItemCode(productToAdd.code);
    showToast(`${productToAdd.name} adicionado ao orçamento!`, "success");
    setIsSearchModalOpen(false);
  };

  // Helper to get product image
  const getProductImage = (code: string) => {
    const prodId = parseInt(code);
    if (isNaN(prodId)) return undefined;
    const relation = produtoImagens.find((pi) => pi.produto_id === prodId);
    if (relation) {
      const img = imagens.find((im) => im.id === relation.imagem_id);
      return img?.url_imagem;
    }
    return undefined;
  };

  // Helper to determine which item is currently being active/previewed
  const getActiveItemDetails = () => {
    if (selectedItemCode) {
      const saleItem = activeSaleItems.find((i) => i.codigo_produto === selectedItemCode);
      if (saleItem) return {
        code: saleItem.codigo_produto,
        name: saleItem.nome_produto,
        brand: saleItem.marca_produto,
        isAdded: true
      };
      
      if (currentProduct && currentProduct.code === selectedItemCode) {
        return { ...currentProduct, isAdded: false };
      }
    }
    if (activeSaleItems.length > 0) {
      const lastItem = activeSaleItems[activeSaleItems.length - 1];
      return {
        code: lastItem.codigo_produto,
        name: lastItem.nome_produto,
        brand: lastItem.marca_produto,
        isAdded: true
      };
    }
    if (currentProduct) {
      return { ...currentProduct, isAdded: false };
    }
    return null;
  };

  const activeItem = getActiveItemDetails();
  const activeItemImage = activeItem ? getProductImage(activeItem.code) : undefined;

  const cashSaleValue = totalSale * 0.95;
  const maxInstallments = totalSale >= 50 ? Math.min(10, Math.floor(totalSale / 50)) : 0;
  const installmentAmount = maxInstallments > 0 ? totalSale / maxInstallments : 0;

  return (
    <div className="flex-1 w-full h-full flex flex-col lg:flex-row gap-4 min-h-0 bg-[#070a13]">
      {/* Main List Entry Area */}
      <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/10 flex flex-col min-h-0">
        {/* Product ID Input & Add Button */}
        <div className="p-2 border-b border-slate-850/60 bg-[#0e1626]/30 flex gap-4 shrink-0 rounded-t-xl items-end">
          <div className="flex-grow space-y-1">
            <div className="flex items-center gap-3">
              <input
                ref={inputIdRef}
                type="text"
                value={productSearchQuery}
                onChange={(e) => {
                  setProductSearchQuery(e.target.value);
                  if (e.target.value === "") setCurrentProduct(undefined);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchProduct();
                    setTimeout(() => {
                      addBtnRef.current?.focus();
                    }, 10);
                  }
                }}
                placeholder="ID..."
                className="w-24 px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors shrink-0 text-center"
              />
              <div className="text-sm font-semibold text-slate-300 whitespace-nowrap truncate flex-1 flex items-center justify-between h-[38px] px-3 bg-[#070a13]/50 border border-slate-800/50 rounded-lg">
                <span className="truncate">
                  {currentProduct ? `${currentProduct.originalCode ? currentProduct.originalCode + ' - ' : ''}${currentProduct.name} - ${currentProduct.brand}` : "Aguardando código..."}
                </span>
                {loadedBudgetId && (
                  <span className="text-[10px] font-mono font-bold bg-indigo-950 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded ml-2 shrink-0 select-none">
                    Editando: {loadedBudgetId}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              ref={addBtnRef}
              onClick={handleAddProduct}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg h-[38px] flex items-center justify-center cursor-pointer font-bold"
              title="Adicionar Produto"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => setIsSearchModalOpen(true)}
              className="bg-[#16223f] hover:bg-[#1a2849] border border-slate-700 text-slate-300 px-4 py-2 rounded-lg h-[38px] flex items-center justify-center cursor-pointer transition-colors"
              title="Pesquisar Produto"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setIsSavedBudgetsModalOpen(true)}
              className="bg-[#16223f] hover:bg-[#1a2849] border border-slate-700 text-slate-300 px-4 py-2 rounded-lg h-[38px] flex items-center justify-center cursor-pointer transition-colors"
              title="Procurar Orçamentos Salvos"
            >
              <FolderOpen className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Cart Items Table */}
        <div className="flex-grow overflow-y-auto min-h-0">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-850/60 text-slate-500 font-semibold bg-[#0e1626]/10">
                <th className="py-1.5 px-2 pl-4 w-[72px]">Código</th>
                <th className="py-1.5 px-2">Cód. Original</th>
                <th className="py-1.5 px-2">Descrição da Peça</th>
                <th className="py-1.5 px-2">Referência</th>
                <th className="py-1.5 px-2">Marca</th>
                <th className="py-1.5 px-2 text-center w-20">Qtd</th>
                <th className="py-1.5 px-2 text-right w-24">Unitário</th>
                <th className="py-1.5 px-2 text-right pr-4 w-24">Total</th>
                <th className="py-1.5 px-2 text-center w-12">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/50 text-slate-355">
              {activeSaleItems.map((item, index) => (
                <tr 
                  key={item.codigo_produto} 
                  className={`group hover:bg-[#16223f]/50 focus-within:bg-indigo-650/20 cursor-pointer transition-all ${
                    selectedItemCode === item.codigo_produto 
                      ? "bg-[#1d2d54]/60 hover:bg-[#1d2d54]" 
                      : index % 2 === 0 ? "bg-[#0f192e]" : "bg-[#09101f]"
                  }`}
                  onClick={() => {
                    setSelectedItemCode(item.codigo_produto);
                    document.getElementById(`qty-input-${index}`)?.focus();
                  }}
                >
                  <td className="py-1 px-2 pl-4 font-mono text-slate-450 border-l-4 border-transparent group-focus-within:border-indigo-500 w-[72px] truncate select-all">{item.codigo_produto}</td>
                  <td className="py-1 px-2 font-mono text-slate-450">-</td>
                  <td className="py-1 px-2 font-semibold text-slate-200">{item.nome_produto}</td>
                  <td className="py-1 px-2 text-slate-400">-</td>
                  <td className="py-1 px-2 text-slate-400">{item.marca_produto}</td>
                  <td className="py-1 px-2 text-center font-bold text-slate-200">
                    <input
                      id={`qty-input-${index}`}
                      type="number"
                      min="1"
                      className="w-14 bg-[#070a13] border border-slate-700 rounded px-1.5 py-0.5 text-center text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={item.quantidade}
                      onFocus={(e) => {
                        e.target.select();
                        setSelectedItemCode(item.codigo_produto);
                      }}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                        setActiveSaleItems((prev: OrcamentoItem[]) =>
                          prev.map((i) => (i.codigo_produto === item.codigo_produto ? { ...i, quantidade: val, subtotal: val * i.preco_unitario } : i))
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          document.getElementById(`qty-input-${index + 1}`)?.focus();
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          document.getElementById(`qty-input-${index - 1}`)?.focus();
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="py-1 px-2 text-right font-semibold text-slate-200">
                    R$ {item.preco_unitario.toFixed(2)}
                  </td>
                  <td className="py-1 px-2 text-right pr-4 font-bold text-slate-200">R$ {item.subtotal.toFixed(2)}</td>
                  <td className="py-1 px-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSaleItems((prev: OrcamentoItem[]) => prev.filter((i) => i.codigo_produto !== item.codigo_produto));
                        if (selectedItemCode === item.codigo_produto) {
                          setSelectedItemCode(null);
                        }
                        showToast(`${item.nome_produto} removido!`, "info");
                      }}
                      className="p-0.5 hover:bg-[#16223f] border border-transparent hover:border-slate-800 rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      title="Remover Item"
                    >
                      <Plus className="h-3.5 w-3.5 rotate-45" />
                    </button>
                  </td>
                </tr>
              ))}
              {activeSaleItems.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <ShoppingCart className="h-8 w-8 text-slate-700" />
                      <span className="text-xs font-semibold">Tabela limpa. Insira o ID do produto acima.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sidebar: Selected Product Image Preview & Checkout Totals */}
      <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0">
        {/* Selected Item Image (Only the Figure) */}
        <div className="border border-slate-850 rounded-xl bg-[#0e1626]/40 p-3 flex flex-col items-center justify-center aspect-square shrink-0">
          {activeItem && activeItemImage ? (
            <div className="w-full h-full bg-[#070a13] rounded-lg border border-slate-800 flex items-center justify-center p-2 relative overflow-hidden group">
              <img
                src={activeItemImage}
                alt={activeItem.name}
                className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-slate-500 py-6">
              <Search className="h-8 w-8 text-slate-700 mb-2 animate-pulse" />
              <span className="text-xs font-semibold">Sem item selecionado</span>
              <span className="text-[10px] text-slate-650 mt-1">
                Selecione um item para ver a imagem
              </span>
            </div>
          )}
        </div>

        {/* Resumo da Venda Box */}
        <div className="border border-slate-850 rounded-xl bg-[#0e1626]/40 p-4 flex flex-col justify-between flex-grow">
          <div className="space-y-4">
            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-350">Total Líquido:</span>
                <span className="text-2xl font-black text-indigo-400">R$ {totalSale.toFixed(2)}</span>
              </div>
              <div className="space-y-3 pt-3 border-t border-slate-850/70">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">À vista (5% desc.):</span>
                  <span className="text-xl font-black text-emerald-400">R$ {cashSaleValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Parcelas:</span>
                  {maxInstallments > 0 ? (
                    <span className="text-xs text-slate-350 text-right">
                      Até <span className="text-slate-200 font-bold text-sm">{maxInstallments}x</span> de <span className="text-indigo-300 font-bold text-base">R$ {installmentAmount.toFixed(2)}</span>
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-rose-450">Indisponível</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-6">
            <Button
              onClick={handleClearList}
              className="w-full bg-rose-950/25 hover:bg-rose-900/40 border border-rose-800/30 hover:border-rose-700/50 text-rose-350 text-xs font-bold py-2.5 h-auto rounded-lg cursor-pointer transition-colors uppercase tracking-wider"
            >
              Limpar Lista
            </Button>
            <Button
              onClick={() => setIsSaveModalOpen(true)}
              className="w-full bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-200 text-xs font-bold py-2.5 h-auto rounded-lg cursor-pointer transition-colors uppercase tracking-wider"
            >
              Salvar Orçamento
            </Button>
            <Button
              onClick={() => {
                if (activeSaleItems.length === 0) {
                  showToast("Adicione pelo menos um item à lista!", "error");
                  return;
                }
                setIsPreVendaModalOpen(true);
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-550 hover:to-teal-550 text-white text-xs font-bold py-2.5 h-auto rounded-lg shadow-lg shadow-emerald-600/10 cursor-pointer transition-all uppercase tracking-wider"
            >
              Vender (Pré-Venda)
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Product Search Modal */}
      <ProductSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onAddProduct={handleAddProductFromModal}
      />

      {/* Saved Budgets Modal */}
      <SavedBudgetsModal
        isOpen={isSavedBudgetsModalOpen}
        onClose={() => setIsSavedBudgetsModalOpen(false)}
        onSelectBudget={handleSelectBudget}
      />

      {/* Save Budget Form Modal */}
      <SaveBudgetModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        defaultClienteNome={props.clientName}
        defaultClienteId={loadedBudget?.cliente_id}
        defaultTelefone={loadedBudget?.telefone}
        defaultVeiculoModelo={props.vehicleName}
        defaultDescontoTotal={props.discountValue}
        defaultDataValidade={loadedBudget?.data_validade}
        totalAmount={props.subtotalSale}
        existingId={loadedBudgetId}
        onSave={handleConfirmSaveBudget}
      />

      {/* Save PreVenda Form Modal */}
      <SavePreVendaModal
        isOpen={isPreVendaModalOpen}
        onClose={() => setIsPreVendaModalOpen(false)}
        defaultClient={props.clientName}
        defaultDiscount={props.discountValue}
        totalAmount={props.subtotalSale}
        onSave={(data) => {
          handleSavePreSale(data);
          setIsPreVendaModalOpen(false);
        }}
      />
    </div>
  );
}