import { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@fluentui/react-components";
import {
  CartRegular,
  AddRegular,
  SearchRegular,
  FolderOpenRegular,
  DeleteRegular,
  SaveRegular,
  DismissRegular,
} from "@fluentui/react-icons";
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
    tipo_venda: "Balcão" | "Entrega";
    faturada: boolean;
    forma_pagamento: string;
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
  const [searchModalMode, setSearchModalMode] = useState<"id" | "group_vehicle" | "code" | "free">("code");
  const [isSavedBudgetsModalOpen, setIsSavedBudgetsModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [loadedBudgetId, setLoadedBudgetId] = useState<string | null>(null);
  const budgets = useAppStore((state) => state.budgets);
  const loadedBudget = loadedBudgetId ? budgets.find((b) => b.id === loadedBudgetId) : null;

  const handleSelectBudget = (budget: OrcamentoType) => {
    setClientName(budget.cliente_nome || "");
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

  // Listen for keyboard shortcuts (F3: clear, F4: save, F5: pre-venda, F8: saved budgets, F10: group+vehicle, F11: original code)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering shortcuts when writing in input elements, except for function keys (F3, F4, etc.)
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;
      
      const isFKey = e.key.startsWith("F") && !isNaN(Number(e.key.substring(1)));

      if (isInput && !isFKey) {
        return;
      }

      // If any of our modals are open, do not intercept hotkeys (especially Esc which closes modals)
      const isModalOpen = isSearchModalOpen || isSavedBudgetsModalOpen || isSaveModalOpen || isPreVendaModalOpen;
      if (isModalOpen) return;

      if (e.key === "F3") {
        e.preventDefault();
        handleClearList();
      } else if (e.key === "F4") {
        e.preventDefault();
        setIsSaveModalOpen(true);
      } else if (e.key === "F5") {
        e.preventDefault();
        if (activeSaleItems.length === 0) {
          showToast("Adicione pelo menos um item à lista!", "error");
          return;
        }
        setIsPreVendaModalOpen(true);
      } else if (e.key === "F8") {
        e.preventDefault();
        setIsSavedBudgetsModalOpen(true);
      } else if (e.key === "F9") {
        e.preventDefault();
        setSearchModalMode("id");
        setIsSearchModalOpen(true);
      } else if (e.key === "F10") {
        e.preventDefault();
        setSearchModalMode("group_vehicle");
        setIsSearchModalOpen(true);
      } else if (e.key === "F11") {
        e.preventDefault();
        setSearchModalMode("code");
        setIsSearchModalOpen(true);
      } else if (e.key === "F12") {
        e.preventDefault();
        setSearchModalMode("free");
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isSearchModalOpen,
    isSavedBudgetsModalOpen,
    isSaveModalOpen,
    isPreVendaModalOpen,
    activeSaleItems,
    handleClearList,
    showToast,
    setSearchModalMode,
  ]);

  return (
    <div className="flex-1 w-full h-full flex flex-col lg:flex-row gap-4 min-h-0 bg-[var(--colorNeutralBackground1)] text-[var(--colorNeutralForeground1)]">
      {/* Main List Entry Area */}
      <div className="flex-grow border border-[var(--colorNeutralStroke1)] rounded bg-[var(--colorNeutralBackground1)] flex flex-col min-h-0">
        {/* Product ID Input & Add Button */}
        <div className="p-2 border-b border-[var(--colorNeutralStroke1)] bg-[var(--colorNeutralBackground2)] flex gap-4 shrink-0 rounded-t items-end">
          <div className="flex-grow space-y-1">
            <div className="flex items-center gap-3">
              <Input
                ref={inputIdRef}
                type="text"
                value={productSearchQuery}
                onChange={(_, data) => {
                  setProductSearchQuery(data.value);
                  if (data.value === "") setCurrentProduct(undefined);
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
                style={{ width: "96px" }}
                contentBefore={<SearchRegular />}
              />
              <Input
                readOnly
                value={currentProduct ? `${currentProduct.originalCode ? currentProduct.originalCode + ' - ' : ''}${currentProduct.name} - ${currentProduct.brand}` : "Aguardando código..."}
                contentAfter={loadedBudgetId ? (
                  <span className="text-[10px] font-mono font-bold bg-[var(--colorSubtleBackgroundSelected)] text-[var(--colorNeutralForeground1Selected)] border border-[var(--colorNeutralStroke1)] px-2 py-0.5 rounded ml-2 shrink-0 select-none">
                    Editando: {loadedBudgetId}
                  </span>
                ) : undefined}
                style={{ flexGrow: 1 }}
              />
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              ref={addBtnRef}
              onClick={handleAddProduct}
              appearance="primary"
              style={{ height: "32px", fontWeight: "bold" }}
              title="Adicionar Produto"
              icon={<AddRegular />}
            />
            <Button
              onClick={() => {
                setSearchModalMode("code");
                setIsSearchModalOpen(true);
              }}
              style={{ height: "32px" }}
              title="Pesquisar Produto (F9-F12)"
              icon={<SearchRegular />}
            >
              Pesquisar
              <span className="text-[10px] text-[var(--colorNeutralForeground4)] font-mono bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] px-1 py-0.5 rounded leading-none select-none ml-1.5">F9-F12</span>
            </Button>
            <Button
              onClick={() => setIsSavedBudgetsModalOpen(true)}
              style={{ height: "32px" }}
              title="Procurar Orçamentos Salvos (F8)"
              icon={<FolderOpenRegular />}
            >
              Carregar
              <span className="text-[10px] text-[var(--colorNeutralForeground4)] font-mono bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] px-1 py-0.5 rounded leading-none select-none ml-1.5">F8</span>
            </Button>
          </div>
        </div>

        {/* Cart Items Table */}
        <div className="flex-grow overflow-y-auto min-h-0 bg-[var(--colorNeutralBackground1)]">
          <Table size="extra-small" aria-label="Itens do orçamento">
            <TableHeader>
              <TableRow style={{ borderBottom: "1px solid var(--colorNeutralStroke1)" }}>
                <TableHeaderCell style={{ width: "72px", paddingLeft: "16px" }}>Código</TableHeaderCell>
                <TableHeaderCell>Cód. Original</TableHeaderCell>
                <TableHeaderCell>Descrição da Peça</TableHeaderCell>
                <TableHeaderCell>Referência</TableHeaderCell>
                <TableHeaderCell>Marca</TableHeaderCell>
                <TableHeaderCell style={{ width: "80px", textAlign: "center" }}>Qtd</TableHeaderCell>
                <TableHeaderCell style={{ width: "96px", textAlign: "right" }}>Unitário</TableHeaderCell>
                <TableHeaderCell style={{ width: "96px", textAlign: "right", paddingRight: "16px" }}>Total</TableHeaderCell>
                <TableHeaderCell style={{ width: "48px", textAlign: "center" }}>Ação</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSaleItems.map((item, index) => (
                <TableRow
                  key={item.codigo_produto}
                  style={{ cursor: "pointer" }}
                  className={`${
                    selectedItemCode === item.codigo_produto
                      ? "bg-[var(--colorSubtleBackgroundSelected)] font-semibold text-[var(--colorNeutralForeground1Selected)]"
                      : index % 2 === 0
                      ? "bg-[var(--colorNeutralBackground1)]"
                      : "bg-[var(--colorNeutralBackground2)]"
                  }`}
                  onClick={() => {
                    setSelectedItemCode(item.codigo_produto);
                    document.getElementById(`qty-input-${index}`)?.focus();
                  }}
                >
                  <TableCell style={{ paddingLeft: "16px" }}>
                    <span className="font-mono text-[var(--colorNeutralForeground3)] select-all">{item.codigo_produto}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-[var(--colorNeutralForeground3)]">-</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-[var(--colorNeutralForeground1)]">{item.nome_produto}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-[var(--colorNeutralForeground3)]">-</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-[var(--colorNeutralForeground3)]">{item.marca_produto}</span>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Input
                      id={`qty-input-${index}`}
                      type="number"
                      size="small"
                      min={1}
                      style={{ width: "56px" }}
                      value={item.quantidade.toString()}
                      onFocus={(e) => {
                        e.target.select();
                        setSelectedItemCode(item.codigo_produto);
                      }}
                      onChange={(_, data) => {
                        const val = data.value === "" ? 0 : parseInt(data.value);
                        setActiveSaleItems((prev: OrcamentoItem[]) =>
                          prev.map((i) =>
                            i.codigo_produto === item.codigo_produto
                              ? { ...i, quantidade: val, subtotal: val * i.preco_unitario }
                              : i
                          )
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          document.getElementById(`qty-input-${index + 1}`)?.focus();
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault();
                          document.getElementById(`qty-input-${index - 1}`)?.focus();
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    <span className="font-semibold text-[var(--colorNeutralForeground1)]">
                      R$ {item.preco_unitario.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell style={{ textAlign: "right", paddingRight: "16px" }}>
                    <span className="font-bold text-[var(--colorNeutralForeground1)]">
                      R$ {item.subtotal.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Button
                      size="small"
                      icon={<DismissRegular />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSaleItems((prev: OrcamentoItem[]) =>
                          prev.filter((i) => i.codigo_produto !== item.codigo_produto)
                        );
                        if (selectedItemCode === item.codigo_produto) {
                          setSelectedItemCode(null);
                        }
                        showToast(`${item.nome_produto} removido!`, "info");
                      }}
                      style={{ color: "var(--colorPaletteRedForeground1)" }}
                      title="Remover Item"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {activeSaleItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} style={{ textAlign: "center", padding: "40px" }}>
                    <div className="flex flex-col items-center justify-center space-y-2 py-8">
                      <CartRegular className="h-8 w-8 text-[var(--colorNeutralForeground4)] opacity-40 animate-pulse" />
                      <span className="text-xs font-semibold text-[var(--colorNeutralForeground4)]">
                        Tabela limpa. Insira o ID do produto acima ou faça uma Pesquisa Avançada.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Sidebar: Selected Product Image Preview & Checkout Totals */}
      <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0">
        {/* Selected Item Image */}
        <div className="border border-[var(--colorNeutralStroke1)] rounded bg-[var(--colorNeutralBackground2)] p-3 flex flex-col items-center justify-center h-48 shrink-0">
          {activeItem && activeItemImage ? (
            <div className="w-full h-full bg-[var(--colorNeutralBackground1)] rounded border border-[var(--colorNeutralStroke1)] flex items-center justify-center p-2 relative overflow-hidden group">
              <img
                src={activeItemImage}
                alt={activeItem.name}
                className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-[var(--colorNeutralForeground3)] py-4">
              <SearchRegular className="h-6 w-6 text-[var(--colorNeutralForeground4)] mb-1 opacity-50" />
              <span className="text-xs font-semibold">Sem item selecionado</span>
              <span className="text-[10px] text-[var(--colorNeutralForeground4)] mt-1">
                Selecione um item para ver a imagem
              </span>
            </div>
          )}
        </div>

        {/* Resumo da Venda Box */}
        <div className="border border-[var(--colorNeutralStroke1)] rounded bg-[var(--colorNeutralBackground2)] p-4 flex flex-col justify-between flex-grow">
          <div className="space-y-4">
            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--colorNeutralForeground3)] uppercase">Total Líquido:</span>
                <span className="text-2xl font-black text-[var(--colorBrandStroke1)]">R$ {totalSale.toFixed(2)}</span>
              </div>
              <div className="space-y-3 pt-3 border-t border-[var(--colorNeutralStroke1)]/30">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[var(--colorNeutralForeground3)]">À vista (5% desc.):</span>
                  <span className="text-xl font-black text-[var(--colorPaletteGreenForeground1)]">R$ {cashSaleValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[var(--colorNeutralForeground3)]">Parcelas:</span>
                  {maxInstallments > 0 ? (
                    <span className="text-xs text-[var(--colorNeutralForeground2)] text-right">
                      Até <span className="text-[var(--colorNeutralForeground1)] font-bold text-sm">{maxInstallments}x</span> de <span className="text-[var(--colorBrandStroke1)] font-bold text-base">R$ {installmentAmount.toFixed(2)}</span>
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-[var(--colorPaletteRedForeground1)]">Indisponível</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-6 w-full">
            {/* Vender (Pré-Venda) - Botão de Ação Primária em Destaque */}
            <Button
              onClick={() => {
                if (activeSaleItems.length === 0) {
                  showToast("Adicione pelo menos um item à lista!", "error");
                  return;
                }
                setIsPreVendaModalOpen(true);
              }}
              appearance="primary"
              style={{
                width: "100%",
                height: "42px",
                backgroundColor: "var(--colorPaletteGreenBackground3)",
                borderColor: "var(--colorPaletteGreenBorder2)",
                color: "var(--colorPaletteGreenForeground1)",
                fontWeight: "bold"
              }}
              title="Vender (Pré-Venda)"
              icon={<CartRegular />}
            >
              <div className="flex justify-between items-center w-full">
                <span>Fechar Venda</span>
                <span className="text-[9px] font-mono bg-[var(--colorPaletteGreenBackground1)] border border-[var(--colorPaletteGreenBorder1)] text-[var(--colorPaletteGreenForeground1)] px-1.5 py-0.5 rounded leading-none select-none ml-2">F5</span>
              </div>
            </Button>

            <div className="flex gap-2 w-full">
              {/* Salvar Orçamento */}
              <Button
                onClick={() => setIsSaveModalOpen(true)}
                style={{ flex: 1, height: "38px" }}
                title="Salvar Orçamento"
                icon={<SaveRegular />}
              >
                <div className="flex justify-between items-center w-full">
                  <span>Salvar</span>
                  <span className="text-[9px] text-[var(--colorNeutralForeground4)] font-mono bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] px-1 py-0.5 rounded leading-none select-none ml-1.5">F4</span>
                </div>
              </Button>

              {/* Limpar Lista */}
              <Button
                onClick={handleClearList}
                style={{ flex: 1, height: "38px", color: "var(--colorPaletteRedForeground1)" }}
                title="Limpar Lista"
                icon={<DeleteRegular />}
              >
                <div className="flex justify-between items-center w-full">
                  <span>Limpar</span>
                  <span className="text-[9px] text-[var(--colorPaletteRedForeground2)] font-mono bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] px-1 py-0.5 rounded leading-none select-none ml-1.5">F3</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Product Search Modal */}
      <ProductSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onAddProduct={handleAddProductFromModal}
        initialSearchMode={searchModalMode}
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