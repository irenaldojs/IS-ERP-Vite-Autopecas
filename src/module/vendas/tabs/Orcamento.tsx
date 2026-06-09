import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Search } from "lucide-react";
import { produtos, produtoGrupos, produtoMarcas } from "../../../../mocks/products.mock";

type Product = { code: string; originalCode?: string; name: string; brand: string; price: number; stock?: number };
type Item = { id: string; code: string; name: string; brand: string; qty: number; price: number };

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
  const inputIdRef = useRef<HTMLInputElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);

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
            name: currentProduct.name,
            brand: currentProduct.brand,
            qty: 1,
            price: currentProduct.price,
          },
        ];
      }
    });
    setProductSearchQuery("");
    setCurrentProduct(undefined);
    showToast(`${currentProduct.name} adicionado!`, "success");
    inputIdRef.current?.focus();
  };

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
              onClick={handleSearchProduct}
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
                <th className="p-2.5 pl-4">Código</th>
                <th className="p-2.5">Descrição da Peça</th>
                <th className="p-2.5">Marca</th>
                <th className="p-2.5 text-center w-24">Qtd</th>
                <th className="p-2.5 text-right w-28">Unitário</th>
                <th className="p-2.5 text-right pr-4 w-28">Total</th>
                <th className="p-2.5 text-center w-12">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/50 text-slate-355">
              {activeSaleItems.map((item, index) => (
                <tr 
                  key={item.code} 
                  className="hover:bg-[#16223f]/50 focus-within:bg-[#16223f]/50 cursor-pointer transition-colors"
                  onClick={() => document.getElementById(`qty-input-${index}`)?.focus()}
                >
                  <td className="p-2.5 pl-4 font-mono text-slate-450">{item.code}</td>
                  <td className="p-2.5 font-semibold text-slate-200">{item.name}</td>
                  <td className="p-2.5 text-slate-400">{item.brand}</td>
                  <td className="p-2.5 text-center font-bold text-slate-200">
                    <input
                      id={`qty-input-${index}`}
                      type="number"
                      min="1"
                      className="w-16 bg-[#070a13] border border-slate-700 rounded px-2 py-1 text-center text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={item.qty}
                      onFocus={(e) => e.target.select()}
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
                  <td className="p-2.5 text-right font-semibold text-slate-200">
                    R$ {item.price.toFixed(2)}
                  </td>
                  <td className="p-2.5 text-right pr-4 font-bold text-slate-200">R$ {(item.price * item.qty).toFixed(2)}</td>
                  <td className="p-2.5 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSaleItems((prev: Item[]) => prev.filter((i) => i.code !== item.code));
                        showToast(`${item.name} removido!`, "info");
                      }}
                      className="p-1 hover:bg-[#16223f] border border-transparent hover:border-slate-800 rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      title="Remover Item"
                    >
                      <Plus className="h-3.5 w-3.5 rotate-45" />
                    </button>
                  </td>
                </tr>
              ))}
              {activeSaleItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-500">
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

      {/* Checkout Totals Summary sidebar */}
      <div className="w-full lg:w-72 border border-slate-850 rounded-xl bg-[#0e1626]/40 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2">Resumo da Venda</h4>

          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-300">Total Líquido:</span>
              <span className="font-extrabold text-indigo-400">R$ {totalSale.toFixed(2)}</span>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-850/70">
              <div className="flex justify-between text-xs text-slate-400">
                <span>À vista (5% desconto):</span>
                <span className="font-semibold text-slate-200">R$ {cashSaleValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Parcelamento:</span>
                {maxInstallments > 0 ? (
                  <span className="font-semibold text-slate-200">
                    Até {maxInstallments}x de R$ {installmentAmount.toFixed(2)}
                  </span>
                ) : (
                  <span className="font-semibold text-rose-300">Parcelas não disponíveis</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <Button onClick={handleSaveBudget} className="w-full bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-200 text-xs font-bold py-2.5 h-auto rounded-lg cursor-pointer transition-colors uppercase tracking-wider">Salvar Orçamento</Button>
          <Button onClick={handleSavePreSale} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-550 hover:to-teal-550 text-white text-xs font-bold py-2.5 h-auto rounded-lg shadow-lg shadow-emerald-600/10 cursor-pointer transition-all uppercase tracking-wider">Vender (Pré-Venda)</Button>
        </div>
      </div>
    </div>
  );
}