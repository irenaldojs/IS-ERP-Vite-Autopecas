import React, { useState, useEffect, useRef } from "react";
import { Button } from "@fluentui/react-components";
import { Search, Image, X, Plus, FileText, Car } from "lucide-react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { convertFileSrc } from '@tauri-apps/api/core';
import {
  carroModelos,
  carroMontadoras,
} from "../../../mocks/products.mock";
import {
  Produto,
  ProdutoGrupo,
  CarroMontadora,
} from "../../types/products.entities";
import { ProductService } from "@/services/product.service";
import AutocompleteInput from "./AutocompleteInput";

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: any) => void;
  initialSearchMode?: "id" | "group_vehicle" | "code" | "free";
}

export function ProductSearchModal({ isOpen, onClose, onAddProduct, initialSearchMode = "group_vehicle" }: ProductSearchModalProps) {
  const [searchMode, setSearchMode] = useState<"id" | "group_vehicle" | "code" | "free">(initialSearchMode);
  const [searchId, setSearchId] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [searchFree, setSearchFree] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);

  const [dbProducts, setDbProducts] = useState<Produto[]>([]);
  const [dbGroups, setDbGroups] = useState<ProdutoGrupo[]>([]);

  const [selectedModalProduct, setSelectedModalProduct] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearchMode(initialSearchMode);
      setSearchId("");
      setSearchCode("");
      setSearchFree("");
      setSelectedGroupId("");
      setSelectedVehicleId("");
      setHasSearched(false);
      setSelectedModalProduct(null);
      setCurrentImageIndex(0);
      setDbProducts([]);
    }
  }, [isOpen, initialSearchMode]);

  // Load groups on mount
  useEffect(() => {
    ProductService.listarGrupos().then(setDbGroups).catch(console.error);
  }, []);

  // Fetch full details of the product when selected row changes to load specifications, applications, images
  useEffect(() => {
    if (selectedModalProduct && selectedModalProduct.id && !selectedModalProduct.especificacoes) {
      ProductService.buscarProduto(selectedModalProduct.id).then((fullProd) => {
        if (fullProd) {
          setSelectedModalProduct(fullProd);
        }
      }).catch(console.error);
    }
  }, [selectedModalProduct?.id]);

  const [groupResetTrigger, setGroupResetTrigger] = useState(0);

  const idInputRef = useRef<HTMLInputElement | null>(null);
  const codeInputRef = useRef<HTMLInputElement | null>(null);
  const groupInputRef = useRef<HTMLInputElement | null>(null);
  const vehicleInputRef = useRef<HTMLInputElement | null>(null);
  const freeInputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = (mode: "id" | "group_vehicle" | "code" | "free") => {
    setTimeout(() => {
      if (mode === "id") {
        idInputRef.current?.focus();
      } else if (mode === "code") {
        codeInputRef.current?.focus();
      } else if (mode === "free") {
        freeInputRef.current?.focus();
      } else if (mode === "group_vehicle") {
        groupInputRef.current?.focus();
      }
    }, 50);
  };

  // Automatically focus the correct first input when the modal opens or search mode changes
  useEffect(() => {
    if (isOpen) {
      focusInput(searchMode);
    }
  }, [isOpen, searchMode]);

  // Listen for modal-specific hotkeys (F9, F10, F11, F12)
  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isZoomModalOpen) return;

      if (e.key === "F9") {
        e.preventDefault();
        setSearchMode("id");
        setSearchId("");
        setTimeout(() => {
          idInputRef.current?.focus();
        }, 50);
      } else if (e.key === "F10") {
        e.preventDefault();
        setSearchMode("group_vehicle");
        setSelectedGroupId("");
        setGroupResetTrigger((prev) => prev + 1);
        setTimeout(() => {
          groupInputRef.current?.focus();
        }, 50);
      } else if (e.key === "F11") {
        e.preventDefault();
        setSearchMode("code");
        setSearchCode("");
        setTimeout(() => {
          codeInputRef.current?.focus();
        }, 50);
      } else if (e.key === "F12") {
        e.preventDefault();
        setSearchMode("free");
        setSearchFree("");
        setTimeout(() => {
          freeInputRef.current?.focus();
        }, 50);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown, true);
    };
  }, [isOpen, isZoomModalOpen]);

  const groupItems = dbGroups.map((g: ProdutoGrupo) => ({
    id: g.id!.toString(),
    label: g.descricao || "",
  }));

  const vehicleItems = carroModelos.map((m: any) => {
    const brand = carroMontadoras.find((b: any) => b.id === m.montadora_id);
    return {
      id: m.id.toString(),
      label: brand ? `${brand.nome} ${m.nome}` : m.nome,
    };
  });

  useEscapeKey(isOpen && !isZoomModalOpen, onClose);
  useEscapeKey(isZoomModalOpen, () => setIsZoomModalOpen(false));

  const triggerIdSearch = async () => {
    setHasSearched(true);

    const targetId = parseInt(searchId.trim());
    if (isNaN(targetId)) {
      setDbProducts([]);
      setSelectedModalProduct(null);
      return;
    }

    try {
      const dbProd = await ProductService.buscarProduto(targetId);
      if (dbProd) {
        setDbProducts([dbProd]);
        setSelectedModalProduct(dbProd);
      } else {
        setDbProducts([]);
        setSelectedModalProduct(null);
      }
    } catch (err) {
      console.error(err);
      setDbProducts([]);
      setSelectedModalProduct(null);
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const triggerCodeSearch = async () => {
    setHasSearched(true);

    const code = searchCode.trim();
    try {
      const results = await ProductService.listarProdutos(code);
      setDbProducts(results);
      if (results.length > 0) {
        setSelectedModalProduct(results[0]);
      } else {
        setSelectedModalProduct(null);
      }
    } catch (err) {
      console.error(err);
      setDbProducts([]);
      setSelectedModalProduct(null);
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const triggerFreeSearch = async () => {
    setHasSearched(true);

    const text = searchFree.trim();
    try {
      const results = await ProductService.listarProdutos(text);
      setDbProducts(results);
      if (results.length > 0) {
        setSelectedModalProduct(results[0]);
      } else {
        setSelectedModalProduct(null);
      }
    } catch (err) {
      console.error(err);
      setDbProducts([]);
      setSelectedModalProduct(null);
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const triggerSearch = async () => {
    setHasSearched(true);

    try {
      const allProds = await ProductService.listarProdutos();
      const filtered = [];
      for (const prod of allProds) {
        const matchesGroup = selectedGroupId ? prod.grupo_id === Number(selectedGroupId) : true;
        let matchesVehicle = true;
        if (selectedVehicleId) {
          const targetModel = carroModelos.find((m) => m.id.toString() === selectedVehicleId);
          if (!targetModel) {
            matchesVehicle = false;
          } else {
            // Load full details for checking applications
            const fullProd = await ProductService.buscarProduto(prod.id!);
            matchesVehicle = fullProd?.aplicacoes?.some((app: any) => app.modelo === targetModel.nome) || false;
          }
        }
        if (matchesGroup && matchesVehicle) {
          filtered.push(prod);
        }
      }
      setDbProducts(filtered);
      if (filtered.length > 0) {
        setSelectedModalProduct(filtered[0]);
      } else {
        setSelectedModalProduct(null);
      }
    } catch (err) {
      console.error(err);
      setDbProducts([]);
      setSelectedModalProduct(null);
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const modalResults = dbProducts;

  const activeSelectedProd = selectedModalProduct && modalResults.some((p: Produto) => p.id === selectedModalProduct.id)
    ? selectedModalProduct
    : modalResults[0] || null;

  const activeSelectedProductImages = activeSelectedProd
    ? (activeSelectedProd.imagens || []).map((i: any) =>
        i.caminho_imagem.startsWith("http") ? i.caminho_imagem : convertFileSrc(i.caminho_imagem)
      )
    : [];

  // Keyboard navigation inside search results modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomModalOpen) {
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const currentIndex = modalResults.findIndex((p: Produto) => p.id === activeSelectedProd?.id);
        if (currentIndex < modalResults.length - 1) {
          setSelectedModalProduct(modalResults[currentIndex + 1]);
          setCurrentImageIndex(0);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const currentIndex = modalResults.findIndex((p: Produto) => p.id === activeSelectedProd?.id);
        if (currentIndex > 0) {
          setSelectedModalProduct(modalResults[currentIndex - 1]);
          setCurrentImageIndex(0);
        }
      } else if (e.key === "Enter" || e.key === "Insert") {
        if (activeSelectedProd) {
          e.preventDefault();
          onAddProduct(activeSelectedProd);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, modalResults, activeSelectedProd, onAddProduct, isZoomModalOpen]);

  // Auto-scroll selected row into view in the search results table
  useEffect(() => {
    if (!isOpen || !activeSelectedProd) return;
    const rowElement = document.getElementById(`search-prod-row-${activeSelectedProd.id}`);
    if (rowElement) {
      rowElement.scrollIntoView({
        behavior: "auto", // snappy scroll for keyboard navigation
        block: "nearest", // scroll only as much as needed to make it visible
      });
    }
  }, [activeSelectedProd, isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-55 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--colorNeutralBackground3)] border border-[var(--colorNeutralStroke1)] rounded w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Photo section */}
        <div className="flex gap-4 border-b border-[var(--colorNeutralStroke1)] p-3 bg-[var(--colorNeutralBackground2)] items-start justify-between">
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-[var(--colorNeutralForeground1)]">Pesquisa Avançada de Produtos</h3>
                <p className="text-xs text-[var(--colorNeutralForeground3)] mt-0.5 font-sans">Selecione o modo de pesquisa, filtre os produtos e adicione-os.</p>
              </div>
            </div>

            {/* Tab switch buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSearchMode("id");
                  setSelectedModalProduct(null);
                  setCurrentImageIndex(0);
                  setSearchId("");
                  setHasSearched(false);
                }}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                  searchMode === "id"
                    ? "bg-[var(--colorBrandBackground)] text-white shadow-sm font-bold"
                    : "bg-[var(--colorNeutralBackground3)] border border-[var(--colorNeutralStroke1)] text-[var(--colorNeutralForeground2)] hover:bg-[var(--colorNeutralBackground3Hover)] hover:text-[var(--colorNeutralForeground1)]"
                }`}
              >
                ID (F9)
              </button>
              <button
                onClick={() => {
                  setSearchMode("group_vehicle");
                  setSelectedModalProduct(null);
                  setCurrentImageIndex(0);
                  setSelectedGroupId("");
                  setSelectedVehicleId("");
                  setHasSearched(false);
                }}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                  searchMode === "group_vehicle"
                    ? "bg-[var(--colorBrandBackground)] text-white shadow-sm font-bold"
                    : "bg-[var(--colorNeutralBackground3)] border border-[var(--colorNeutralStroke1)] text-[var(--colorNeutralForeground2)] hover:bg-[var(--colorNeutralBackground3Hover)] hover:text-[var(--colorNeutralForeground1)]"
                }`}
              >
                Grupo + Veículo (F10)
              </button>
              <button
                onClick={() => {
                  setSearchMode("code");
                  setSelectedModalProduct(null);
                  setCurrentImageIndex(0);
                  setSearchCode("");
                  setHasSearched(false);
                }}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                  searchMode === "code"
                    ? "bg-[var(--colorBrandBackground)] text-white shadow-sm font-bold"
                    : "bg-[var(--colorNeutralBackground3)] border border-[var(--colorNeutralStroke1)] text-[var(--colorNeutralForeground2)] hover:bg-[var(--colorNeutralBackground3Hover)] hover:text-[var(--colorNeutralForeground1)]"
                }`}
              >
                Código Original (F11)
              </button>
              <button
                onClick={() => {
                  setSearchMode("free");
                  setSelectedModalProduct(null);
                  setCurrentImageIndex(0);
                  setSearchFree("");
                  setHasSearched(false);
                }}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                  searchMode === "free"
                    ? "bg-[var(--colorBrandBackground)] text-white shadow-sm font-bold"
                    : "bg-[var(--colorNeutralBackground3)] border border-[var(--colorNeutralStroke1)] text-[var(--colorNeutralForeground2)] hover:bg-[var(--colorNeutralBackground3Hover)] hover:text-[var(--colorNeutralForeground1)]"
                }`}
              >
                Busca Livre (F12)
              </button>
            </div>

            {/* Search inputs based on mode */}
            <div className="h-[52px] flex items-end">
              {searchMode === "id" ? (
                <div className="w-full max-w-lg space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--colorNeutralForeground3)]">ID do Produto</label>
                  <div className="relative flex gap-2">
                    <div className="relative flex-grow">
                      <input
                        ref={idInputRef}
                        type="text"
                        placeholder="Digite o ID exato do produto e pressione Enter..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            triggerIdSearch();
                          }
                        }}
                        className="w-full pl-9 pr-4 py-1.5 bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] rounded text-xs text-[var(--colorNeutralForeground1)] focus:outline-none focus:border-[var(--colorBrandStroke1)] transition-colors h-[32px]"
                      />
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--colorNeutralForeground3)]" />
                    </div>
                    <Button
                      onClick={triggerIdSearch}
                      appearance="primary"
                      style={{ height: "32px" }}
                    >
                      <Search className="h-3.5 w-3.5 mr-1" />
                      Buscar
                    </Button>
                  </div>
                </div>
              ) : searchMode === "code" ? (
                <div className="w-full max-w-lg space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--colorNeutralForeground3)]">Código Original</label>
                  <div className="relative flex gap-2">
                    <div className="relative flex-grow">
                      <input
                        ref={codeInputRef}
                        type="text"
                        placeholder="Digite o código original do produto e pressione Enter..."
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            triggerCodeSearch();
                          }
                        }}
                        className="w-full pl-9 pr-4 py-1.5 bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] rounded text-xs text-[var(--colorNeutralForeground1)] focus:outline-none focus:border-[var(--colorBrandStroke1)] transition-colors h-[32px]"
                      />
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--colorNeutralForeground3)]" />
                    </div>
                    <Button
                      onClick={triggerCodeSearch}
                      appearance="primary"
                      style={{ height: "32px" }}
                    >
                      <Search className="h-3.5 w-3.5 mr-1" />
                      Buscar
                    </Button>
                  </div>
                </div>
              ) : searchMode === "free" ? (
                <div className="w-full max-w-lg space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--colorNeutralForeground3)]">Busca Livre</label>
                  <div className="relative flex gap-2">
                    <div className="relative flex-grow">
                      <input
                        ref={freeInputRef}
                        type="text"
                        placeholder="Digite termo de busca (ID, Código, Grupo, Marca, Ref...) e pressione Enter..."
                        value={searchFree}
                        onChange={(e) => setSearchFree(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            triggerFreeSearch();
                          }
                        }}
                        className="w-full pl-9 pr-4 py-1.5 bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] rounded text-xs text-[var(--colorNeutralForeground1)] focus:outline-none focus:border-[var(--colorBrandStroke1)] transition-colors h-[32px]"
                      />
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--colorNeutralForeground3)]" />
                    </div>
                    <Button
                      onClick={triggerFreeSearch}
                      appearance="primary"
                      style={{ height: "32px" }}
                    >
                      <Search className="h-3.5 w-3.5 mr-1" />
                      Buscar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 items-end w-full max-w-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    <AutocompleteInput
                      label="Grupo"
                      placeholder="Buscar ou selecionar grupo..."
                      items={groupItems}
                      selectedValue={selectedGroupId}
                      onSelect={(id) => setSelectedGroupId(id)}
                      onClear={() => setSelectedGroupId("")}
                      inputRef={groupInputRef}
                      nextInputRef={vehicleInputRef}
                      resetTrigger={groupResetTrigger}
                    />
                    <AutocompleteInput
                      label="Veículo"
                      placeholder="Buscar ou selecionar veículo..."
                      items={vehicleItems}
                      selectedValue={selectedVehicleId}
                      onSelect={(id) => setSelectedVehicleId(id)}
                      onClear={() => setSelectedVehicleId("")}
                      inputRef={vehicleInputRef}
                      onSubmit={triggerSearch}
                    />
                  </div>
                  <Button
                    onClick={triggerSearch}
                    appearance="primary"
                    style={{ height: "32px" }}
                  >
                    <Search className="h-3.5 w-3.5 mr-1" />
                    Buscar
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 items-start shrink-0">
            <div 
              onClick={() => {
                if (activeSelectedProductImages.length > 0) {
                  setIsZoomModalOpen(true);
                }
              }}
              className={`w-52 h-52 bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] rounded flex items-center justify-center overflow-hidden relative shadow-inner group ${
                activeSelectedProductImages.length > 0 ? "cursor-zoom-in" : ""
              }`}
            >
              {activeSelectedProductImages.length > 0 ? (
                <>
                  <img
                    src={activeSelectedProductImages[currentImageIndex]}
                    alt={`Foto do produto ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300 hover:scale-102"
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
                        className="w-6 h-6 rounded-full bg-[var(--colorNeutralBackground6)] border border-[var(--colorNeutralStroke1)] text-[var(--colorNeutralForeground6)] flex items-center justify-center hover:bg-[var(--colorBrandBackground)] transition-colors cursor-pointer text-xs font-bold"
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
                        className="w-6 h-6 rounded-full bg-[var(--colorNeutralBackground6)] border border-[var(--colorNeutralStroke1)] text-[var(--colorNeutralForeground6)] flex items-center justify-center hover:bg-[var(--colorBrandBackground)] transition-colors cursor-pointer text-xs font-bold"
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-[var(--colorNeutralForeground3)] text-[10px]">
                  <Image className="h-7 w-7 mb-1 opacity-40" />
                  <span>Sem foto</span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              title="Fechar (ESC)"
              className="p-1.5 hover:bg-[var(--colorNeutralBackground3Hover)] border border-[var(--colorNeutralStroke1)] rounded text-[var(--colorNeutralForeground2)] hover:text-[var(--colorNeutralForeground1)] transition-all cursor-pointer focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results Table (Middle) */}
        <div className="flex-grow overflow-y-auto min-h-0 bg-[var(--colorNeutralBackground1)]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-[var(--colorNeutralBackground2)] z-10">
              <tr className="border-b border-[var(--colorNeutralStroke1)] text-[var(--colorNeutralForeground2)] font-bold bg-[var(--colorNeutralBackground2)]">
                <th className="py-2 px-3 pl-4">ID</th>
                <th className="py-2 px-3">Código Original</th>
                <th className="py-2 px-3">Grupo</th>
                <th className="py-2 px-3">Marca</th>
                <th className="py-2 px-3 text-right pr-6">Preço</th>
                <th className="py-2 px-3 text-center w-28">Ação (Insert)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--colorNeutralStroke1)]/20">
              {!hasSearched ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-[var(--colorNeutralForeground3)]">
                    Digite os termos de pesquisa e clique em Buscar ou pressione Enter.
                  </td>
                </tr>
              ) : modalResults.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-[var(--colorNeutralForeground3)]">
                    Nenhum produto encontrado. Refine os filtros acima.
                  </td>
                </tr>
              ) : (
                modalResults.map((prod: Produto, idx: number) => {
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
                        onAddProduct(prod);
                      }}
                      className={`hover:bg-[var(--colorSubtleBackgroundHover)] cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[var(--colorSubtleBackgroundSelected)] font-semibold text-[var(--colorNeutralForeground1Selected)] shadow-inner"
                          : idx % 2 === 0
                          ? "bg-[var(--colorNeutralBackground1)]"
                          : "bg-[var(--colorNeutralBackground2)]"
                      }`}
                    >
                      <td className={`py-1.5 px-3 pl-4 font-mono text-[var(--colorNeutralForeground3)] border-l-4 ${isSelected ? "border-[var(--colorBrandStroke1)]" : "border-transparent"}`}>{prod.id}</td>
                      <td className="py-1.5 px-3 font-semibold text-[var(--colorNeutralForeground1)]">{prod.codigo_original}</td>
                      <td className="py-1.5 px-3 text-[var(--colorNeutralForeground2)]">{prod.grupo_descricao || "Sem Grupo"}</td>
                      <td className="py-1.5 px-3 text-[var(--colorNeutralForeground3)]">{prod.marca_nome || "Sem Marca"}</td>
                      <td className="py-1.5 px-3 text-right pr-6 font-bold text-[var(--colorNeutralForeground1)]">
                        R$ {(prod.preco?.preco_venda || 0).toFixed(2)}
                      </td>
                      <td className="py-1.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <Button
                          onClick={() => onAddProduct(prod)}
                          appearance="primary"
                          style={{ height: "24px", minWidth: "32px", padding: "0" }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Specifications & Applications grids (Bottom) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 bg-[var(--colorNeutralBackground3)] border-t border-[var(--colorNeutralStroke1)] h-64 shrink-0 min-h-0">
          {/* Technical Specifications */}
          <div className="md:col-span-1 flex flex-col min-h-0 border border-[var(--colorNeutralStroke1)] rounded bg-[var(--colorNeutralBackground1)] p-2">
            <div className="flex items-center gap-1.5 mb-2 text-[var(--colorBrandStroke1)] font-bold text-xs uppercase tracking-wider">
              <FileText className="h-3.5 w-3.5" />
              <span>Especificações Técnicas</span>
            </div>
            <div className="flex-grow overflow-y-auto min-h-0 text-xs">
              {activeSelectedProd ? (
                (() => {
                  const specs = activeSelectedProd.especificacoes || [];
                  return specs.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--colorNeutralStroke1)] text-[var(--colorNeutralForeground3)] font-semibold text-[10px] uppercase">
                          <th className="pb-1.5">Tipo</th>
                          <th className="pb-1.5">Especificação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--colorNeutralStroke1)]/10 text-[var(--colorNeutralForeground2)]">
                        {specs.map((s: any, idx: number) => (
                          <tr
                            key={idx}
                            className={`hover:bg-[var(--colorSubtleBackgroundHover)] ${
                              idx % 2 === 0 ? "bg-[var(--colorNeutralBackground1)]" : "bg-[var(--colorNeutralBackground2)]"
                            }`}
                          >
                            <td className="py-1.5 font-medium text-[var(--colorNeutralForeground3)]">{s.tipo_especificacao || "Especificação"}</td>
                            <td className="py-1.5 font-semibold text-[var(--colorNeutralForeground1)]">{s.especificacao}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="h-full flex items-center justify-center text-[var(--colorNeutralForeground3)] italic">
                      Nenhuma especificação disponível para este produto.
                    </div>
                  );
                })()
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--colorNeutralForeground3)]">
                  Selecione um produto para visualizar as especificações.
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Applications */}
          <div className="md:col-span-2 flex flex-col min-h-0 border border-[var(--colorNeutralStroke1)] rounded bg-[var(--colorNeutralBackground1)] p-2">
            <div className="flex items-center gap-1.5 mb-2 text-[var(--colorBrandStroke1)] font-bold text-xs uppercase tracking-wider">
              <Car className="h-3.5 w-3.5" />
              <span>Aplicações de Veículos</span>
            </div>
            <div className="flex-grow overflow-y-auto min-h-0 text-xs">
              {activeSelectedProd ? (
                (() => {
                  const applications = (activeSelectedProd.aplicacoes || []).map((app: any) => {
                    const brand = carroMontadoras.find((b: CarroMontadora) => b.id === app.montadora_id);
                    return {
                      brandName: brand ? brand.nome : "Outros",
                      modelo: app.modelo,
                      ano: app.ano || (app.ano_inicial && app.ano_final ? `${app.ano_inicial}-${app.ano_final}` : app.ano_inicial || app.ano_final || ""),
                      detalhes: app.detalhes,
                    };
                  });

                  // Group applications by brand name
                  const groupedApps: { [key: string]: typeof applications } = {};
                  applications.forEach((app: any) => {
                    if (!groupedApps[app.brandName]) {
                      groupedApps[app.brandName] = [];
                    }
                    groupedApps[app.brandName].push(app);
                  });

                  const brandKeys = Object.keys(groupedApps);

                  return applications.length > 0 ? (
                    <table className="w-full text-left border-collapse table-fixed">
                      <thead>
                        <tr className="border-b border-[var(--colorNeutralStroke1)] text-[var(--colorNeutralForeground3)] font-semibold text-[10px] uppercase">
                          <th className="pb-1.5 w-1/4">Modelo</th>
                          <th className="pb-1.5 w-1/4">Ano</th>
                          <th className="pb-1.5 w-1/2">Detalhes</th>
                        </tr>
                      </thead>
                      <tbody className="text-[var(--colorNeutralForeground2)]">
                        {brandKeys.map((brandName) => (
                          <React.Fragment key={brandName}>
                            {/* Brand Header Row */}
                            <tr className="bg-[var(--colorNeutralBackground3)] font-bold border-y border-[var(--colorNeutralStroke1)]">
                              <td colSpan={3} className="py-1 px-2 text-[var(--colorBrandStroke1)] text-[11px] uppercase tracking-wider">
                                {brandName}
                              </td>
                            </tr>
                            {groupedApps[brandName].map((app: any, idx: number) => (
                              <tr
                                key={idx}
                                className={`hover:bg-[var(--colorSubtleBackgroundHover)] border-b border-[var(--colorNeutralStroke1)]/10 last:border-b-0 ${
                                  idx % 2 === 0 ? "bg-[var(--colorNeutralBackground1)]" : "bg-[var(--colorNeutralBackground2)]"
                                }`}
                              >
                                <td className="py-1.5 pl-3 font-semibold text-[var(--colorNeutralForeground1)]">{app.modelo}</td>
                                <td className="py-1.5 text-[var(--colorNeutralForeground2)]">{app.ano}</td>
                                <td className="py-1.5 text-[var(--colorNeutralForeground3)] truncate pr-2" title={app.detalhes}>{app.detalhes}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="h-full flex items-center justify-center text-[var(--colorNeutralForeground3)] italic">
                      Nenhuma aplicação registrada para este produto.
                    </div>
                  );
                })()
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--colorNeutralForeground3)]">
                  Selecione um produto para visualizar as aplicações.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Modal de Zoom da Imagem */}
      {isZoomModalOpen && activeSelectedProductImages[currentImageIndex] && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div 
            className="bg-[var(--colorNeutralBackground3)] border border-[var(--colorNeutralStroke1)] rounded overflow-hidden shadow-2xl relative flex flex-col items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-3 right-3 z-70 p-1.5 bg-black/60 hover:bg-[var(--colorBrandBackground)] border border-[var(--colorNeutralStroke1)] hover:border-transparent rounded-full text-white transition-all cursor-pointer shadow-md"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="w-[600px] h-[600px] max-w-[90vw] max-h-[90vh] flex items-center justify-center overflow-hidden rounded bg-[var(--colorNeutralBackground1)]">
              <img
                src={activeSelectedProductImages[currentImageIndex]}
                alt="Imagem ampliada"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
