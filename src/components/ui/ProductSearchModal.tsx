import React, { useState, useEffect, useRef } from "react";
import { Button } from "@fluentui/react-components";
import { Search, Image, X, Plus, FileText, Car } from "lucide-react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
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
} from "../../../mocks/products.mock";
import {
  Produto,
  ProdutoGrupo,
  ProdutoMarca,
  ProdutoAplicacaoLista,
  ProdutoTipoEspecificacao,
  ProdutoEspecificacao,
  CarroMontadora,
  CarroModelo,
  Imagem,
  ProdutoImagem,
} from "../../types/products.entities";

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: any) => void;
  initialSearchMode?: "id" | "group_vehicle" | "code" | "free";
}

interface AutocompleteInputProps {
  label: string;
  placeholder: string;
  items: Array<{ id: string; label: string }>;
  selectedValue: string;
  onSelect: (id: string) => void;
  onClear: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  nextInputRef?: React.RefObject<HTMLInputElement | null>;
  onSubmit?: () => void;
  resetTrigger?: number;
}

function AutocompleteInput({
  label,
  placeholder,
  items,
  selectedValue,
  onSelect,
  onClear,
  inputRef,
  nextInputRef,
  onSubmit,
  resetTrigger,
}: AutocompleteInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync initial/selected value with text
  useEffect(() => {
    if (selectedValue) {
      const match = items.find((item) => item.id === selectedValue);
      if (match) {
        setInputValue(match.label);
      }
    } else {
      setInputValue("");
    }
  }, [selectedValue, items]);

  // Reset internal input value when resetTrigger updates
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      setInputValue("");
      onClear();
    }
  }, [resetTrigger]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = inputValue.trim() === ""
    ? []
    : items.filter((item) =>
        item.label.toLowerCase().includes(inputValue.toLowerCase())
      );

  const showDropdown = isOpen && filteredItems.length > 0 && inputValue.trim() !== "";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent modal keyboard shortcuts from firing
    if (!isOpen) {
      if (e.key === "Enter") {
        if (onSubmit) {
          onSubmit();
        }
      } else if (e.key === "ArrowDown" && inputValue.trim() !== "") {
        setIsOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[activeIndex]) {
        onSelect(filteredItems[activeIndex].id);
        setInputValue(filteredItems[activeIndex].label);
        setIsOpen(false);
        if (nextInputRef?.current) {
          nextInputRef.current.focus();
        } else if (onSubmit) {
          onSubmit();
        }
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.trim() === "") {
      setIsOpen(false);
      onClear();
    } else {
      setIsOpen(true);
      setActiveIndex(0);
    }
  };

  const handleSelectItem = (item: { id: string; label: string }) => {
    onSelect(item.id);
    setInputValue(item.label);
    setIsOpen(false);
    if (nextInputRef?.current) {
      nextInputRef.current.focus();
    }
  };

  return (
    <div ref={containerRef} className="space-y-1 relative w-full">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--colorNeutralForeground3)]">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.trim() !== "") {
              setIsOpen(true);
            }
          }}
          className="w-full px-3 py-1.5 bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] rounded text-xs text-[var(--colorNeutralForeground1)] focus:outline-none focus:border-[var(--colorBrandStroke1)] transition-colors h-[32px] pr-8"
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => {
              setInputValue("");
              onClear();
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-2 text-[var(--colorNeutralForeground3)] hover:text-[var(--colorNeutralForeground1)] cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {showDropdown && (
        <ul className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-[var(--colorNeutralBackground3)] border border-[var(--colorNeutralStroke1)] rounded shadow-xl z-50 divide-y divide-[var(--colorNeutralStroke1)]/30">
          {filteredItems.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`px-3 py-2 text-xs cursor-pointer transition-colors ${
                  isActive 
                    ? "bg-[var(--colorSubtleBackgroundSelected)] text-[var(--colorNeutralForeground1Selected)] font-semibold" 
                    : "text-[var(--colorNeutralForeground1)] hover:bg-[var(--colorSubtleBackgroundHover)]"
                }`}
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function ProductSearchModal({ isOpen, onClose, onAddProduct, initialSearchMode = "group_vehicle" }: ProductSearchModalProps) {
  const [searchMode, setSearchMode] = useState<"id" | "group_vehicle" | "code" | "free">(initialSearchMode);
  const [searchId, setSearchId] = useState("");
  const [appliedSearchId, setAppliedSearchId] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [appliedSearchCode, setAppliedSearchCode] = useState("");
  const [searchFree, setSearchFree] = useState("");
  const [appliedSearchFree, setAppliedSearchFree] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [appliedGroupId, setAppliedGroupId] = useState<string>("");
  const [appliedVehicleId, setAppliedVehicleId] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedModalProduct, setSelectedModalProduct] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearchMode(initialSearchMode);
      setSearchId("");
      setAppliedSearchId("");
      setSearchCode("");
      setAppliedSearchCode("");
      setSearchFree("");
      setAppliedSearchFree("");
      setSelectedGroupId("");
      setSelectedVehicleId("");
      setAppliedGroupId("");
      setAppliedVehicleId("");
      setHasSearched(false);
      setSelectedModalProduct(null);
      setCurrentImageIndex(0);
    }
  }, [isOpen, initialSearchMode]);

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

  const groupItems = produtoGrupos.map((g: ProdutoGrupo) => ({
    id: g.id.toString(),
    label: g.descricao || "",
  }));

  const vehicleItems = carroModelos.map((m: CarroModelo) => {
    const brand = carroMontadoras.find((b: CarroMontadora) => b.id === m.montadora_id);
    return {
      id: m.id.toString(),
      label: brand ? `${brand.nome} ${m.nome}` : m.nome,
    };
  });

  useEscapeKey(isOpen && !isZoomModalOpen, onClose);
  useEscapeKey(isZoomModalOpen, () => setIsZoomModalOpen(false));

  const triggerIdSearch = () => {
    setAppliedSearchId(searchId.trim());
    setHasSearched(true);

    const targetId = searchId.trim();
    const results = produtos.filter((prod) => 
      targetId ? prod.id.toString() === targetId : false
    );

    if (results.length > 0) {
      setSelectedModalProduct(results[0]);
    } else {
      setSelectedModalProduct(null);
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const triggerCodeSearch = () => {
    setAppliedSearchCode(searchCode.trim());
    setHasSearched(true);

    const code = searchCode.toLowerCase().trim();
    const results = produtos.filter((prod) => 
      code ? prod.codigo_original.toLowerCase().includes(code) : false
    );

    if (results.length > 0) {
      setSelectedModalProduct(results[0]);
    } else {
      setSelectedModalProduct(null);
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const triggerFreeSearch = () => {
    setAppliedSearchFree(searchFree.trim());
    setHasSearched(true);

    const text = searchFree.toLowerCase().trim();
    const results = produtos.filter((prod) => {
      if (!text) return false;
      const group = produtoGrupos.find((g) => g.id === prod.grupo_id);
      const brand = produtoMarcas.find((m) => m.id === prod.marca_id);
      return (
        prod.id.toString().includes(text) ||
        prod.codigo_original.toLowerCase().includes(text) ||
        (prod.referencia && prod.referencia.toLowerCase().includes(text)) ||
        (group?.descricao && group.descricao.toLowerCase().includes(text)) ||
        (brand?.nome && brand.nome.toLowerCase().includes(text))
      );
    });

    if (results.length > 0) {
      setSelectedModalProduct(results[0]);
    } else {
      setSelectedModalProduct(null);
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const triggerSearch = () => {
    setAppliedGroupId(selectedGroupId);
    setAppliedVehicleId(selectedVehicleId);
    setHasSearched(true);

    // Compute results immediately to focus the first one
    const matchesGroup = (prod: Produto) => selectedGroupId ? prod.grupo_id === Number(selectedGroupId) : true;
    const matchesVehicle = (prod: Produto) => {
      if (!selectedVehicleId) return true;
      const targetModel = carroModelos.find((m) => m.id.toString() === selectedVehicleId);
      if (!targetModel) return false;
      const appList = produtoAplicacaoListas.find((list: ProdutoAplicacaoLista) => list.id === prod.aplicacao_lista_id);
      return appList ? appList.aplicaoes.some((app: any) => app.modelo === targetModel.nome) : false;
    };
    const results = produtos.filter((prod) => matchesGroup(prod) && matchesVehicle(prod));
    
    if (results.length > 0) {
      setSelectedModalProduct(results[0]);
    } else {
      setSelectedModalProduct(null);
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  // Filter products for modal
  const modalResults = !hasSearched
    ? []
    : produtos.filter((prod: Produto) => {
        if (searchMode === "id") {
          if (!appliedSearchId) return false;
          return prod.id.toString() === appliedSearchId;
        } else if (searchMode === "code") {
          if (!appliedSearchCode) return false;
          return prod.codigo_original.toLowerCase().includes(appliedSearchCode.toLowerCase());
        } else if (searchMode === "free") {
          if (!appliedSearchFree) return false;
          const text = appliedSearchFree.toLowerCase();
          const group = produtoGrupos.find((g) => g.id === prod.grupo_id);
          const brand = produtoMarcas.find((m) => m.id === prod.marca_id);
          return (
            prod.id.toString().includes(text) ||
            prod.codigo_original.toLowerCase().includes(text) ||
            (prod.referencia && prod.referencia.toLowerCase().includes(text)) ||
            (group?.descricao && group.descricao.toLowerCase().includes(text)) ||
            (brand?.nome && brand.nome.toLowerCase().includes(text))
          );
        } else {
          const matchesGroup = appliedGroupId ? prod.grupo_id === Number(appliedGroupId) : true;
          let matchesVehicle = true;
          if (appliedVehicleId) {
            const targetModel = carroModelos.find((m) => m.id.toString() === appliedVehicleId);
            if (!targetModel) {
              matchesVehicle = false;
            } else {
              const appList = produtoAplicacaoListas.find((list: ProdutoAplicacaoLista) => list.id === prod.aplicacao_lista_id);
              matchesVehicle = appList ? appList.aplicaoes.some((app: any) => app.modelo === targetModel.nome) : false;
            }
          }
          return matchesGroup && matchesVehicle;
        }
      });

  // Ensure activeSelectedProd defaults to first result if current selected is not in results
  const activeSelectedProd = selectedModalProduct && modalResults.some((p: Produto) => p.id === selectedModalProduct.id)
    ? selectedModalProduct
    : modalResults[0] || null;

  const activeSelectedProductImages = activeSelectedProd
    ? (() => {
        const dbImages = produtoImagens
          .filter((pi: ProdutoImagem) => pi.produto_id === activeSelectedProd.id)
          .map((pi: ProdutoImagem) => imagens.find((i: Imagem) => i.id === pi.imagem_id))
          .filter((i: any): i is Imagem => !!i)
          .map((i: Imagem) => i.url_imagem);
        
        return dbImages;
      })()
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
                  setAppliedSearchId("");
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
                  setAppliedGroupId("");
                  setAppliedVehicleId("");
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
                  setAppliedSearchCode("");
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
                  setAppliedSearchFree("");
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
                  const group = produtoGrupos.find((g: ProdutoGrupo) => g.id === prod.grupo_id);
                  const brand = produtoMarcas.find((m: ProdutoMarca) => m.id === prod.marca_id);
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
                      <td className="py-1.5 px-3 text-[var(--colorNeutralForeground2)]">{group?.descricao || "Sem Grupo"}</td>
                      <td className="py-1.5 px-3 text-[var(--colorNeutralForeground3)]">{brand?.nome || "Sem Marca"}</td>
                      <td className="py-1.5 px-3 text-right pr-6 font-bold text-[var(--colorNeutralForeground1)]">
                        R$ {prod.preco.toFixed(2)}
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
                  const specs = produtoEspecificacoes
                    .filter((spec: ProdutoEspecificacao) => spec.produto_id === activeSelectedProd.id)
                    .map((spec: ProdutoEspecificacao) => {
                      const type = produtoTipoEspecificacoes.find((t: ProdutoTipoEspecificacao) => t.id === spec.tipo_id);
                      return {
                        tipo: type ? type.tipo_especificacao : "Especificação",
                        valor: spec.especificacao,
                      };
                    });
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
                            <td className="py-1.5 font-medium text-[var(--colorNeutralForeground3)]">{s.tipo}</td>
                            <td className="py-1.5 font-semibold text-[var(--colorNeutralForeground1)]">{s.valor}</td>
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
                  const appsList = produtoAplicacaoListas.find((list: ProdutoAplicacaoLista) => list.id === activeSelectedProd.aplicacao_lista_id);
                  const applications = appsList
                    ? appsList.aplicaoes.map((app: any) => {
                        const model = carroModelos.find((m: CarroModelo) => m.nome === app.modelo);
                        const brand = model ? carroMontadoras.find((b: CarroMontadora) => b.id === model.montadora_id) : null;
                        return {
                          brandName: brand ? brand.nome : "Outros",
                          modelo: app.modelo,
                          ano: app.ano,
                          detalhes: app.detalhes,
                        };
                      })
                    : [];

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
