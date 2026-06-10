import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Search } from "lucide-react";
import { ProductSearchModal } from "@/components/ui/ProductSearchModal";
import {
  produtos,
  produtoGrupos,
  produtoMarcas,
  imagens,
  produtoImagens,
} from "../../../../mocks/products.mock";

type Product = { code: string; originalCode?: string; name: string; brand: string; price: number; stock?: number; reference?: string };
type Item = { id: string; code: string; originalCode?: string; name: string; brand: string; reference?: string; qty: number; price: number };

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
  activeSaleItems: Item[];
  setActiveSaleItems: (fn: ((prev: Item[]) => Item[]) | Item[]) => void;
  subtotalSale: number;
  discountValue: number;
  setDiscountValue: (v: number) => void;
  totalSale: number;
  handleSaveBudget: () => void;
  handleSavePreSale: () => void;
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
  } = props;

  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);
  const [selectedItemCode, setSelectedItemCode] = useState<string | null>(null);
  const inputIdRef = useRef<HTMLInputElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  // Search Modal state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Focus ID input when search modal closes
  useEffect(() => {
    if (!isSearchModalOpen) {
      const timer = setTimeout(() => {
        inputIdRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchModalOpen]);

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

  const handleAddProduct = () => {
    if (!currentProduct) {
      if (productSearchQuery.trim()) {
        showToast("Busque o produto primeiro (Aperte Enter)", "info");
      }
      inputIdRef.current?.focus();
      return;
    }
    
    setActiveSaleItems((prev: Item[]) => {
      const existing = prev.find((item) => item.code === currentProduct.code);
      if (existing) {
        return prev.map((item) =>
          item.code === currentProduct.code ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [
          ...prev,
          {
            id: currentProduct.code,
            code: currentProduct.code,
            originalCode: currentProduct.originalCode,
            name: currentProduct.name,
            brand: currentProduct.brand,
            reference: currentProduct.reference,
            qty: 1,
            price: currentProduct.price,
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
    
    setActiveSaleItems((prev: Item[]) => {
      const existing = prev.find((item) => item.code === productToAdd.code);
      if (existing) {
        return prev.map((item) =>
          item.code === productToAdd.code ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [
          ...prev,
          {
            id: productToAdd.code,
            code: productToAdd.code,
            originalCode: productToAdd.originalCode,
            name: productToAdd.name,
            brand: productToAdd.brand,
            reference: productToAdd.reference,
            qty: 1,
            price: productToAdd.price,
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
      const saleItem = activeSaleItems.find((i) => i.code === selectedItemCode);
      if (saleItem) return { ...saleItem, isAdded: true };
      
      if (currentProduct && currentProduct.code === selectedItemCode) {
        return { ...currentProduct, qty: undefined, isAdded: false };
      }
    }
    if (activeSaleItems.length > 0) {
      return { ...activeSaleItems[activeSaleItems.length - 1], isAdded: true };
    }
    if (currentProduct) {
      return { ...currentProduct, qty: undefined, isAdded: false };
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
              <div className="text-sm font-semibold text-slate-300 whitespace-nowrap truncate flex-1 flex items-center h-[38px] px-3 bg-[#070a13]/50 border border-slate-800/50 rounded-lg">
                {currentProduct ? `${currentProduct.originalCode ? currentProduct.originalCode + ' - ' : ''}${currentProduct.name} - ${currentProduct.brand}` : "Aguardando código..."}
              </div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              onClick={() => setIsSearchModalOpen(true)}
              className="bg-[#16223f] hover:bg-[#1a2849] border border-slate-700 text-slate-300 px-4 py-2 rounded-lg h-[38px] flex items-center justify-center cursor-pointer transition-colors"
              title="Pesquisar Produto"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              ref={addBtnRef}
              onClick={handleAddProduct}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg h-[38px] flex items-center justify-center cursor-pointer"
              title="Adicionar Produto"
            >
              <Plus className="h-5 w-5" />
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
                  key={item.code} 
                  className={`group hover:bg-[#16223f]/50 focus-within:bg-indigo-650/20 cursor-pointer transition-all ${
                    selectedItemCode === item.code 
                      ? "bg-[#1d2d54]/60 hover:bg-[#1d2d54]" 
                      : index % 2 === 0 ? "bg-[#0f192e]" : "bg-[#09101f]"
                  }`}
                  onClick={() => {
                    setSelectedItemCode(item.code);
                    document.getElementById(`qty-input-${index}`)?.focus();
                  }}
                >
                  <td className="py-1 px-2 pl-4 font-mono text-slate-450 border-l-4 border-transparent group-focus-within:border-indigo-500 w-[72px] truncate select-all">{item.code}</td>
                  <td className="py-1 px-2 font-mono text-slate-450">{item.originalCode || "-"}</td>
                  <td className="py-1 px-2 font-semibold text-slate-200">{item.name}</td>
                  <td className="py-1 px-2 text-slate-400">{item.reference || "-"}</td>
                  <td className="py-1 px-2 text-slate-400">{item.brand}</td>
                  <td className="py-1 px-2 text-center font-bold text-slate-200">
                    <input
                      id={`qty-input-${index}`}
                      type="number"
                      min="1"
                      className="w-14 bg-[#070a13] border border-slate-700 rounded px-1.5 py-0.5 text-center text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={item.qty}
                      onFocus={(e) => {
                        e.target.select();
                        setSelectedItemCode(item.code);
                      }}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                        setActiveSaleItems((prev: Item[]) =>
                          prev.map((i) => (i.code === item.code ? { ...i, qty: val } : i))
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
                    R$ {item.price.toFixed(2)}
                  </td>
                  <td className="py-1 px-2 text-right pr-4 font-bold text-slate-200">R$ {(item.price * item.qty).toFixed(2)}</td>
                  <td className="py-1 px-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSaleItems((prev: Item[]) => prev.filter((i) => i.code !== item.code));
                        if (selectedItemCode === item.code) {
                          setSelectedItemCode(null);
                        }
                        showToast(`${item.name} removido!`, "info");
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
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2">
              Resumo da Venda
            </h4>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-slate-300">Total Líquido:</span>
                <span className="font-extrabold text-indigo-400">R$ {totalSale.toFixed(2)}</span>
              </div>
              <div className="space-y-2 pt-3 border-t border-slate-850/70">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>À vista (5% desc.):</span>
                  <span className="font-semibold text-slate-200">R$ {cashSaleValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Parcelas:</span>
                  {maxInstallments > 0 ? (
                    <span className="font-semibold text-slate-200">
                      Até {maxInstallments}x de R$ {installmentAmount.toFixed(2)}
                    </span>
                  ) : (
                    <span className="font-semibold text-rose-450">Indisponível</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-6">
            <Button
              onClick={handleSaveBudget}
              className="w-full bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-200 text-xs font-bold py-2.5 h-auto rounded-lg cursor-pointer transition-colors uppercase tracking-wider"
            >
              Salvar Orçamento
            </Button>
            <Button
              onClick={handleSavePreSale}
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
    </div>
  );
}