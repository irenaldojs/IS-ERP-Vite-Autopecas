import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Search, X, Image, FileText, Car } from "lucide-react";
import {
  produtos,
  produtoGrupos,
  produtoMarcas,
  carroModelos,
  carroMontadoras,
  produtoAplicacaoListas,
  produtoTipoEspecificacoes,
  produtoEspecificacoes,
  imagens,
  produtoImagens,
} from "../../../../mocks/products.mock";

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

  // Search Modal states
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<"code" | "group_vehicle">("code");
  const [searchCode, setSearchCode] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [selectedModalProduct, setSelectedModalProduct] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleAddProductFromModal = (prod: any) => {
    const group = produtoGrupos.find(g => g.id === prod.grupo_id);
    const brand = produtoMarcas.find(m => m.id === prod.marca_id);
    
    const productToAdd: Product = {
      code: prod.id.toString(),
      originalCode: prod.codigo_original,
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
            name: productToAdd.name,
            brand: productToAdd.brand,
            qty: 1,
            price: productToAdd.price,
          },
        ];
      }
    });
    showToast(`${productToAdd.name} adicionado ao orçamento!`, "success");
  };

  // Filter products for modal
  const modalResults = produtos.filter((prod) => {
    if (searchMode === "code") {
      if (!searchCode.trim()) return true;
      return prod.codigo_original.toLowerCase().includes(searchCode.toLowerCase().trim());
    } else {
      const matchesGroup = selectedGroupId ? prod.grupo_id === Number(selectedGroupId) : true;
      let matchesVehicle = true;
      if (selectedVehicleId) {
        const appList = produtoAplicacaoListas.find((list) => list.id === prod.aplicacao_lista_id);
        matchesVehicle = appList ? appList.aplicaoes.some((app) => app.modelo_id === Number(selectedVehicleId)) : false;
      }
      return matchesGroup && matchesVehicle;
    }
  });

  // Ensure activeSelectedProd defaults to first result if current selected is not in results
  const activeSelectedProd = selectedModalProduct && modalResults.some(p => p.id === selectedModalProduct.id)
    ? selectedModalProduct
    : modalResults[0] || null;

  const activeSelectedProductImages = activeSelectedProd
    ? (() => {
        const dbImages = produtoImagens
          .filter((pi) => pi.produto_id === activeSelectedProd.id)
          .map((pi) => imagens.find((i) => i.id === pi.imagem_id))
          .filter((i): i is typeof imagens[0] => !!i)
          .map(i => i.url_imagem);
        
        // Add a mock second image so the user has at least 2 images to demonstrate the carousel!
        if (dbImages.length === 1) {
          dbImages.push(`https://via.placeholder.com/400x300?text=Angulo+Alternativo+ID+${activeSelectedProd.id}`);
        }
        return dbImages;
      })()
    : [];

  // Keyboard navigation inside search results modal
  useEffect(() => {
    if (!isSearchModalOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const currentIndex = modalResults.findIndex(p => p.id === activeSelectedProd?.id);
        if (currentIndex < modalResults.length - 1) {
          setSelectedModalProduct(modalResults[currentIndex + 1]);
          setCurrentImageIndex(0);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const currentIndex = modalResults.findIndex(p => p.id === activeSelectedProd?.id);
        if (currentIndex > 0) {
          setSelectedModalProduct(modalResults[currentIndex - 1]);
          setCurrentImageIndex(0);
        }
      } else if (e.key === "Enter") {
        if (activeSelectedProd) {
          e.preventDefault();
          handleAddProductFromModal(activeSelectedProd);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchModalOpen, modalResults, activeSelectedProd]);

  // Auto-scroll selected row into view in the search results table
  useEffect(() => {
    if (!isSearchModalOpen || !activeSelectedProd) return;
    const rowElement = document.getElementById(`search-prod-row-${activeSelectedProd.id}`);
    if (rowElement) {
      rowElement.scrollIntoView({
        behavior: "auto", // snappy scroll for keyboard navigation
        block: "nearest", // scroll only as much as needed to make it visible
      });
    }
  }, [activeSelectedProd, isSearchModalOpen]);

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
                  className="hover:bg-[#16223f]/50 focus-within:bg-indigo-650/20 cursor-pointer transition-all border-l-4 border-transparent focus-within:border-indigo-500"
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

      {/* Advanced Product Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-55 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1626] border border-slate-800 rounded-xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-205">
            {/* Header & Photo section */}
            <div className="flex gap-2 border-b border-slate-800 p-2 bg-[#0e1626]/50 items-start justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Pesquisa Avançada de Produtos</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Selecione o modo de pesquisa, filtre os produtos e adicione-os ao orçamento.</p>
                  </div>
                </div>

                {/* Tab switch buttons */}
                <div className="flex gap-2.5">
                  <button
                    onClick={() => {
                      setSearchMode("code");
                      setSelectedModalProduct(null);
                      setCurrentImageIndex(0);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      searchMode === "code"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-650/30"
                        : "bg-[#16223f]/50 border border-slate-800 text-slate-400 hover:bg-[#16223f] hover:text-slate-200"
                    }`}
                  >
                    1 - Código Original
                  </button>
                  <button
                    onClick={() => {
                      setSearchMode("group_vehicle");
                      setSelectedModalProduct(null);
                      setCurrentImageIndex(0);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      searchMode === "group_vehicle"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-650/30"
                        : "bg-[#16223f]/50 border border-slate-800 text-slate-400 hover:bg-[#16223f] hover:text-slate-200"
                    }`}
                  >
                    2 - Grupo + Veículo
                  </button>
                </div>

                {/* Search inputs based on mode - fixed height container to prevent layout shifting */}
                <div className="h-[58px] flex items-end">
                  {searchMode === "code" ? (
                    <div className="w-full max-w-lg space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Código Original</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Digite o código original do produto..."
                          value={searchCode}
                          onChange={(e) => setSearchCode(e.target.value)}
                          className="w-full pl-9 pr-4 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[32px]"
                          autoFocus
                        />
                        <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-500" />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Grupo</label>
                        <select
                          value={selectedGroupId}
                          onChange={(e) => setSelectedGroupId(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[32px]"
                        >
                          <option value="">Todos os Grupos</option>
                          {produtoGrupos.map((g) => (
                            <option key={g.id} value={g.id.toString()}>
                              {g.descricao}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Veículo</label>
                        <select
                          value={selectedVehicleId}
                          onChange={(e) => setSelectedVehicleId(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[32px]"
                        >
                          <option value="">Todos os Veículos</option>
                          {carroModelos.map((m) => {
                            const brand = carroMontadoras.find((b) => b.id === m.montadora_id);
                            return (
                              <option key={m.id} value={m.id.toString()}>
                                {brand ? `${brand.nome} ` : ""}{m.nome}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Box in the top right with Carousel controls */}
              <div className="flex gap-4 items-start shrink-0">
                <div className="flex flex-col gap-2">
                  <div className="w-40 h-40 bg-[#070a13] border border-slate-800 rounded-lg flex items-center justify-center overflow-hidden relative shadow-inner group">
                    {activeSelectedProductImages.length > 0 ? (
                      <>
                        <img
                          src={activeSelectedProductImages[currentImageIndex]}
                          alt={`Foto do produto ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover transition-all duration-300"
                        />
                        
                        {/* Carousel Overlay Navigation Arrows */}
                        {activeSelectedProductImages.length > 1 && (
                          <div className="absolute inset-0 flex items-center justify-between px-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex((prev) => 
                                  prev === 0 ? activeSelectedProductImages.length - 1 : prev - 1
                                );
                              }}
                              className="w-6 h-6 rounded-full bg-slate-900/80 border border-slate-700 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer text-xs font-bold"
                            >
                              &lt;
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex((prev) => 
                                  prev === activeSelectedProductImages.length - 1 ? 0 : prev + 1
                                );
                              }}
                              className="w-6 h-6 rounded-full bg-slate-900/80 border border-slate-700 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer text-xs font-bold"
                            >
                              &gt;
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-550 text-[10px]">
                        <Image className="h-7 w-7 mb-1 opacity-40" />
                        <span>Sem foto</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnails of the first 2 images */}
                  {activeSelectedProductImages.length > 1 && (
                    <div className="flex gap-2 justify-center">
                      {activeSelectedProductImages.slice(0, 2).map((imgUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-9 h-9 border rounded overflow-hidden transition-all cursor-pointer ${
                            currentImageIndex === idx
                              ? "border-indigo-500 scale-105"
                              : "border-slate-800 hover:border-slate-600"
                          }`}
                        >
                          <img src={imgUrl} className="w-full h-full object-cover" alt={`Miniatura ${idx + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsSearchModalOpen(false)}
                  className="p-1.5 hover:bg-[#16223f] border border-slate-850 hover:border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Results Table (Middle) */}
            <div className="flex-grow overflow-y-auto min-h-0 bg-[#070a13]/20">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-[#0e1626] z-10">
                  <tr className="border-b border-slate-800 text-slate-400 font-bold bg-[#0e1626]">
                    <th className="py-1 px-3 pl-4">ID</th>
                    <th className="py-1 px-3">Código Original</th>
                    <th className="py-1 px-3">Grupo</th>
                    <th className="py-1 px-3">Marca</th>
                    <th className="py-1 px-3 text-right pr-6">Preço</th>
                    <th className="py-1 px-3 text-center w-28">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/30">
                  {modalResults.map((prod) => {
                    const group = produtoGrupos.find((g) => g.id === prod.grupo_id);
                    const brand = produtoMarcas.find((m) => m.id === prod.marca_id);
                    const isSelected = activeSelectedProd?.id === prod.id;
                    return (
                      <tr
                        key={prod.id}
                        id={`search-prod-row-${prod.id}`}
                        onClick={() => {
                          setSelectedModalProduct(prod);
                          setCurrentImageIndex(0);
                        }}
                        onDoubleClick={() => {
                          handleAddProductFromModal(prod);
                        }}
                        className={`hover:bg-[#16223f]/40 cursor-pointer transition-all ${
                          isSelected ? "bg-indigo-600/25 border-l-4 border-indigo-500 font-semibold text-white shadow-inner" : "border-l-4 border-transparent"
                        }`}
                      >
                        <td className="py-1 px-3 pl-4 font-mono text-slate-400">{prod.id}</td>
                        <td className="py-1 px-3 font-semibold text-slate-200">{prod.codigo_original}</td>
                        <td className="py-1 px-3 text-slate-300">{group?.descricao || "Sem Grupo"}</td>
                        <td className="py-1 px-3 text-slate-400">{brand?.nome || "Sem Marca"}</td>
                        <td className="py-1 px-3 text-right pr-6 font-bold text-slate-100">
                          R$ {prod.preco.toFixed(2)}
                        </td>
                        <td className="py-1 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <Button
                            onClick={() => handleAddProductFromModal(prod)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] h-6 px-3 rounded-lg cursor-pointer flex items-center justify-center gap-1 mx-auto"
                          >
                            <Plus className="h-3 w-3" />
                            Adicionar
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {modalResults.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-slate-500">
                        Nenhum produto encontrado. Refine os filtros acima.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Specifications & Applications grids (Bottom) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 bg-[#0e1626] border-t border-slate-800 h-64 shrink-0 min-h-0">
              {/* Technical Specifications */}
              <div className="md:col-span-1 flex flex-col min-h-0 border border-slate-800/80 rounded-xl bg-[#070a13]/30 p-2">
                <div className="flex items-center gap-1.5 mb-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Especificações Técnicas</span>
                </div>
                <div className="flex-grow overflow-y-auto min-h-0 text-xs">
                  {activeSelectedProd ? (
                    (() => {
                      const specs = produtoEspecificacoes
                        .filter((spec) => spec.produto_id === activeSelectedProd.id)
                        .map((spec) => {
                          const type = produtoTipoEspecificacoes.find((t) => t.id === spec.tipo_id);
                          return {
                            tipo: type ? type.tipo_especificacao : "Especificação",
                            valor: spec.especificacao,
                          };
                        });
                      return specs.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-500 font-semibold text-[10px] uppercase">
                              <th className="pb-1.5">Tipo</th>
                              <th className="pb-1.5">Especificação</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850/20 text-slate-300">
                            {specs.map((s, idx) => (
                              <tr key={idx} className="hover:bg-[#16223f]/10">
                                <td className="py-1.5 font-medium text-slate-400">{s.tipo}</td>
                                <td className="py-1.5 font-semibold text-slate-200">{s.valor}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-550 italic">
                          Nenhuma especificação disponível para este produto.
                        </div>
                      );
                    })()
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-550">
                      Selecione um produto para visualizar as especificações.
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Applications */}
              <div className="md:col-span-2 flex flex-col min-h-0 border border-slate-800/80 rounded-xl bg-[#070a13]/30 p-2">
                <div className="flex items-center gap-1.5 mb-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <Car className="h-3.5 w-3.5" />
                  <span>Aplicações de Veículos</span>
                </div>
                <div className="flex-grow overflow-y-auto min-h-0 text-xs">
                  {activeSelectedProd ? (
                    (() => {
                      const appsList = produtoAplicacaoListas.find((list) => list.id === activeSelectedProd.aplicacao_lista_id);
                      const applications = appsList
                        ? appsList.aplicaoes.map((app) => {
                            const model = carroModelos.find((m) => m.id === app.modelo_id);
                            const brand = model ? carroMontadoras.find((b) => b.id === model.montadora_id) : null;
                            return {
                              brandName: brand ? brand.nome : "Outros",
                              modelo: model ? model.nome : "Desconhecido",
                              ano: app.ano,
                              detalhes: app.detalhes,
                            };
                          })
                        : [];

                      // Group applications by brand name
                      const groupedApps: { [key: string]: typeof applications } = {};
                      applications.forEach((app) => {
                        if (!groupedApps[app.brandName]) {
                          groupedApps[app.brandName] = [];
                        }
                        groupedApps[app.brandName].push(app);
                      });

                      const brandKeys = Object.keys(groupedApps);

                      return applications.length > 0 ? (
                        <table className="w-full text-left border-collapse table-fixed">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-500 font-semibold text-[10px] uppercase">
                              <th className="pb-1.5 w-1/4">Modelo</th>
                              <th className="pb-1.5 w-1/4">Ano</th>
                              <th className="pb-1.5 w-1/2">Detalhes</th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-300">
                            {brandKeys.map((brandName) => (
                              <React.Fragment key={brandName}>
                                {/* Brand Header Row */}
                                <tr className="bg-[#16223f]/30 font-bold border-y border-slate-800/50">
                                  <td colSpan={3} className="py-1 px-2 text-indigo-400 text-[11px] uppercase tracking-wider">
                                    {brandName}
                                  </td>
                                </tr>
                                {groupedApps[brandName].map((app, idx) => (
                                  <tr key={idx} className="hover:bg-[#16223f]/10 border-b border-slate-850/10 last:border-b-0">
                                    <td className="py-1.5 pl-3 font-semibold text-slate-200">{app.modelo}</td>
                                    <td className="py-1.5 text-slate-300">{app.ano}</td>
                                    <td className="py-1.5 text-slate-400 truncate pr-2" title={app.detalhes}>{app.detalhes}</td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-550 italic">
                          Nenhuma aplicação registrada para este produto.
                        </div>
                      );
                    })()
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-550">
                      Selecione um produto para visualizar as aplicações.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800 bg-[#0e1626] flex items-center justify-between text-xs text-slate-400 shrink-0">
              <div>
                Total de produtos encontrados: <span className="font-bold text-slate-200">{modalResults.length}</span>
              </div>
              <Button
                onClick={() => setIsSearchModalOpen(false)}
                className="bg-[#16223f] hover:bg-[#1a2849] border border-slate-700 text-slate-300 text-xs px-4 py-1.5 h-auto rounded-lg cursor-pointer"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}