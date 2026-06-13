import { useMemo, useEffect } from "react";
import { useLocation, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { FluentProvider, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { ModuleTabContainer } from "@/components/layout/ModuleTabContainer";
import { CATALOG_PRODUCTS, useAppStore } from "@/store/useAppStore";
import type { Orcamento as OrcamentoType } from "@/types/sales.entities";
import { usuarios } from "../mocks/products.mock";
import {
  ShoppingCart,
  ShieldCheck,
  Box,
  DollarSign,
  Truck,
  Wallet,
  Receipt,
  BarChart3,
  List,
  ClipboardList,
  Printer,
  Coins,
  FileUp,
  PlusCircle,
  Scale,
  Send,
  Map,
  Navigation,
  TrendingUp,
  FileText,
  Sliders,
  ShieldAlert,
  Users,
  Settings,
  LayoutGrid,
  Archive,
  Activity,
  Handshake,
} from "lucide-react";
import Orcamento from "@/module/vendas/tabs/Orcamento";
import StatusVenda from "@/module/vendas/tabs/StatusVenda";
import Entregas from "@/module/vendas/tabs/Entregas";
import Relatorios from "@/module/vendas/tabs/Relatorios";
import Emissao from "@/module/caixa/tabs/Emissao";
import CaixaOperacoes from "@/module/caixa/tabs/CaixaOperacoes";
import Entrada from "@/module/estoque/tabs/Entrada";
import Cadastro from "@/module/estoque/tabs/Cadastro";
import Balanco from "@/module/estoque/tabs/Balanco";
import ListaEstoque from "@/module/estoque/tabs/Lista";
import Pendentes from "@/module/garantia/tabs/Pendentes";
import Enviadas from "@/module/garantia/tabs/Enviadas";
import Arquivo from "@/module/garantia/tabs/Arquivo";
import Retorno from "@/module/garantia/tabs/Retorno";
import CadastroProduto from "@/module/produto/tabs/CadastroProduto";
import Categorias from "@/module/produto/tabs/Categorias";
import Grupos from "@/module/produto/tabs/Grupos";
import Fabricantes from "@/module/produto/tabs/Fabricantes";


function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const activeModule = pathSegments[0] || "home";
  const vendasActiveTabId = activeModule === "vendas" ? pathSegments[1] || "orcamento" : "orcamento";

  const isCaixaMaximized = useAppStore((state) => state.isCaixaMaximized);
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }, [theme]);

  const clientName = useAppStore((state) => state.clientName);
  const setClientName = useAppStore((state) => state.setClientName);
  const vehicleName = useAppStore((state) => state.vehicleName);
  const setVehicleName = useAppStore((state) => state.setVehicleName);
  const productSearchQuery = useAppStore((state) => state.productSearchQuery);
  const setProductSearchQuery = useAppStore((state) => state.setProductSearchQuery);
  const showProductSuggestions = useAppStore((state) => state.showProductSuggestions);
  const setShowProductSuggestions = useAppStore((state) => state.setShowProductSuggestions);
  const activeSaleItems = useAppStore((state) => state.activeSaleItems);
  const setActiveSaleItems = useAppStore((state) => state.setActiveSaleItems);
  const discountValue = useAppStore((state) => state.discountValue);
  const setDiscountValue = useAppStore((state) => state.setDiscountValue);
  const budgets = useAppStore((state) => state.budgets);
  const setBudgets = useAppStore((state) => state.setBudgets);
  const preSales = useAppStore((state) => state.preSales);
  const setPreSales = useAppStore((state) => state.setPreSales);
  const invoices = useAppStore((state) => state.invoices);
  const setInvoices = useAppStore((state) => state.setInvoices);
  const openingBalance = useAppStore((state) => state.openingBalance);
  const cashOutflow = useAppStore((state) => state.cashOutflow);
  const cashInflow = useAppStore((state) => state.cashInflow);
  const currentBalance = useAppStore((state) => state.currentBalance);
  const setIsCaixaMaximized = useAppStore((state) => state.setIsCaixaMaximized);

  const filteredCatalog = useMemo(
    () =>
      productSearchQuery.trim()
        ? CATALOG_PRODUCTS.filter((product) =>
            [product.code, product.name, product.brand]
              .join(" ")
              .toLowerCase()
              .includes(productSearchQuery.toLowerCase())
          )
        : CATALOG_PRODUCTS,
    [productSearchQuery]
  );

  const subtotalSale = activeSaleItems.reduce((sum, item) => sum + item.quantidade * item.preco_unitario, 0);
  const totalSale = Math.max(0, subtotalSale - discountValue);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    console.log(`[${type}] ${message}`);
  };

  const handleSelectModule = (moduleId: string) => {
    if (moduleId === "home") {
      navigate("/");
    } else {
      navigate(`/${moduleId}`);
    }
  };

  const handleHomeClick = () => navigate("/");

  const handleVendasTabChange = (tabId: string) => {
    navigate(`/vendas/${tabId}`);
  };

  const handleSaveBudget = (data?: {
    id?: string;
    cliente_nome: string;
    cliente_id?: number | null;
    telefone?: number | null;
    veiculo_modelo: string;
    desconto_total: number;
    data_validade?: string | null;
    status: OrcamentoType["status"];
    observacoes?: string | null;
  }) => {
    const cliente_nome = data?.cliente_nome ?? clientName ?? "Consumidor Final";
    const cliente_id = data?.cliente_id ?? null;
    const telefone = data?.telefone ?? null;
    const veiculo_modelo = data?.veiculo_modelo ?? vehicleName ?? "Sem veículo";
    const desconto_total = data?.desconto_total ?? discountValue ?? 0;
    const data_validade = data?.data_validade ?? null;
    const status = data?.status ?? "Enviado";
    const subtotal = activeSaleItems.reduce((sum, item) => sum + item.quantidade * item.preco_unitario, 0);
    const total = Math.max(0, subtotal - desconto_total);

    setBudgets((prev) => {
      const exists = data?.id ? prev.some((b) => b.id === data.id) : false;
      if (exists) {
        return prev.map((b) =>
          b.id === data?.id
            ? {
                ...b,
                cliente_nome,
                cliente_id,
                telefone,
                veiculo_modelo,
                total,
                status,
                items: [...activeSaleItems],
                desconto_total,
                data_validade,
                observacoes: data?.observacoes || null,
              }
            : b
        );
      } else {
        const newId = data?.id || `ORC-${prev.length + 1}`;
        return [
          ...prev,
          {
            id: newId,
            cliente_nome,
            cliente_id,
            telefone,
            veiculo_modelo,
            data_criacao: new Date().toLocaleDateString("pt-BR"),
            data_validade,
            total,
            status,
            items: [...activeSaleItems],
            desconto_total,
            observacoes: data?.observacoes || null,
          },
        ];
      }
    });
    showToast(data?.id ? `Orçamento ${data.id} atualizado.` : "Orçamento salvo com sucesso.");
  };

  const handleSavePreSale = (data?: {
    client: string;
    clientId?: number | null;
    provisionalContact?: string;
    sellerId: number;
    discount: number;
    notes: string;
    tipo_venda: "Balcão" | "Entrega";
    faturada: boolean;
    forma_pagamento: string;
  }) => {
    const finalClientName = data?.client || clientName || "Consumidor Final";
    const discountVal = data !== undefined ? data.discount : discountValue;
    const finalTotal = Math.max(0, subtotalSale - discountVal);
    
    // Find seller name
    const sellerObj = usuarios.find((u) => u.id === data?.sellerId);
    const sellerName = sellerObj?.nome || "Vendedor Padrão";

    setPreSales((prev) => [
      ...prev,
      {
        id: `PV-${prev.length + 1}`,
        client: finalClientName,
        seller: sellerName,
        date: new Date().toLocaleDateString("pt-BR"),
        total: finalTotal,
        status: data?.faturada ? "Faturado - Pendente" : "Pendente",
        // Adicionando as informações extras mapeadas no objeto da pré-venda
        tipo_venda: data?.tipo_venda,
        forma_pagamento: data?.forma_pagamento,
        faturada: data?.faturada,
      },
    ]);
    showToast(`Pré-venda PV-${preSales.length + 1} (${data?.tipo_venda}) registrada via ${data?.forma_pagamento}.`, "success");
    setActiveSaleItems([]);
    setDiscountValue(0);
    setClientName("");
  };

  const handleReceivePreSale = (id: string) => {
    setPreSales((prev) =>
      prev.map((sale) =>
        sale.id === id ? { ...sale, status: "Pago" } : sale
      )
    );
    showToast("Pré-venda recebida e atualizada.");
  };

  const appProps = {
    clientName,
    setClientName,
    vehicleName,
    setVehicleName,
    productSearchQuery,
    setProductSearchQuery,
    showProductSuggestions,
    setShowProductSuggestions,
    filteredCatalog,
    activeSaleItems,
    setActiveSaleItems,
    subtotalSale,
    discountValue,
    setDiscountValue,
    totalSale,
    handleSaveBudget,
    handleSavePreSale,
    showToast,
    budgets,
    setBudgets,
    preSales,
    setPreSales,
    invoices,
    setInvoices,
    openingBalance,
    cashOutflow,
    cashInflow,
    currentBalance,
    handleReceivePreSale,
  };

  const vendasTabs = [
    {
      id: "orcamento",
      label: "Orçamento",
      icon: ClipboardList,
      component: (
        <Orcamento
          clientName={clientName}
          setClientName={setClientName}
          vehicleName={vehicleName}
          setVehicleName={setVehicleName}
          productSearchQuery={productSearchQuery}
          setProductSearchQuery={setProductSearchQuery}
          showProductSuggestions={showProductSuggestions}
          setShowProductSuggestions={setShowProductSuggestions}
          filteredCatalog={filteredCatalog}
          activeSaleItems={activeSaleItems}
          setActiveSaleItems={setActiveSaleItems}
          subtotalSale={subtotalSale}
          discountValue={discountValue}
          setDiscountValue={setDiscountValue}
          totalSale={totalSale}
          handleSaveBudget={handleSaveBudget}
          handleSavePreSale={handleSavePreSale}
          showToast={showToast}
        />
      ),
    },
    {
      id: "status-venda",
      label: "Status",
      icon: Handshake,
      component: <StatusVenda app={appProps} />,
    },
    {
      id: "entregas",
      label: "Entregas",
      icon: Truck,
      component: <Entregas />,
    },
    {
      id: "relatorios",
      label: "Relatórios",
      icon: BarChart3,
      component: <Relatorios />,
    },
  ];

  const caixaTabs = [
    {
      id: "prevendas",
      label: "Pré-Vendas",
      icon: Handshake,
      component: <StatusVenda app={appProps} />,
    },
    {
      id: "emissao",
      label: "Emissão",
      icon: Printer,
      component: <Emissao app={appProps} />,
    },
    {
      id: "caixa_operacoes",
      label: "Caixa",
      icon: Coins,
      component: <CaixaOperacoes app={appProps} />,
    },
  ];

  const estoqueTabs = [
    {
      id: "entrada",
      label: "Entrada",
      icon: FileUp,
      component: <Entrada />,
    },
    {
      id: "cadastro",
      label: "Cadastro",
      icon: PlusCircle,
      component: <Cadastro />,
    },
    {
      id: "balanco",
      label: "Balanço",
      icon: Scale,
      component: <Balanco />,
    },
    {
      id: "lista",
      label: "Lista",
      icon: List,
      component: <ListaEstoque />,
    },
  ];

  const garantiaTabs = [
    {
      id: "pendentes",
      label: "Pendentes",
      icon: ShieldCheck,
      component: <Pendentes />,
    },
    {
      id: "enviadas",
      label: "Enviadas",
      icon: Truck,
      component: <Enviadas />,
    },
    {
      id: "retorno",
      label: "Retorno",
      icon: Receipt,
      component: <Retorno />,
    },
    {
      id: "arquivo",
      label: "Arquivo",
      icon: Archive,
      component: <Arquivo />,
    },
  ];

  const produtoTabs = [
    {
      id: "cadastro-produto",
      label: "Produtos",
      icon: Box,
      component: <CadastroProduto />,
    },
    {
      id: "categorias",
      label: "Categorias",
      icon: List,
      component: <Categorias />,
    },
    {
      id: "grupos",
      label: "Grupos",
      icon: ClipboardList,
      component: <Grupos />,
    },
    {
      id: "fabricantes",
      label: "Fabricantes",
      icon: Sliders,
      component: <Fabricantes />,
    },
  ];


  const createPlaceholderTab = (title: string) => (
    <div className="flex-1 rounded-xl border border-slate-850 bg-[#0e1626]/20 p-6 text-slate-300">
      <h3 className="text-sm font-bold text-slate-100">{title}</h3>
      <p className="text-xs text-slate-500 mt-2">Tela em desenvolvimento. Conteúdo provisório criado para manter o fluxo de navegação do ERP.</p>
    </div>
  );

  const entregasTabs = [
    { id: "baias", label: "Baias", icon: Truck, component: createPlaceholderTab("Baías") },
    { id: "enviando", label: "Enviando", icon: Send, component: createPlaceholderTab("Em Envio") },
    { id: "mapa", label: "Mapa", icon: Map, component: createPlaceholderTab("Mapa de Entregas") },
    { id: "frota", label: "Frota", icon: Navigation, component: createPlaceholderTab("Frota") },
  ];

  const financasTabs = [
    { id: "receber", label: "Receber", icon: DollarSign, component: createPlaceholderTab("Contas a Receber") },
    { id: "pagar", label: "Pagar", icon: Receipt, component: createPlaceholderTab("Contas a Pagar") },
    { id: "fluxo", label: "Fluxo", icon: TrendingUp, component: createPlaceholderTab("Fluxo de Caixa") },
    { id: "dre", label: "DRE", icon: BarChart3, component: createPlaceholderTab("DRE") },
  ];

  const faturamentoTabs = [
    { id: "fiscal", label: "Fiscal", icon: FileText, component: createPlaceholderTab("Fiscal") },
    { id: "regras", label: "Regras", icon: Sliders, component: createPlaceholderTab("Regras") },
    { id: "correcoes", label: "Correções", icon: ShieldAlert, component: createPlaceholderTab("Correções") },
    { id: "relatorios", label: "Relatórios", icon: BarChart3, component: createPlaceholderTab("Relatórios") },
  ];

  const gerenciaTabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid, component: createPlaceholderTab("Dashboard") },
    { id: "usuarios", label: "Usuários", icon: Users, component: createPlaceholderTab("Usuários") },
    { id: "configuracoes", label: "Configurações", icon: Settings, component: createPlaceholderTab("Configurações") },
    { id: "auditoria", label: "Auditoria", icon: Activity, component: createPlaceholderTab("Auditoria") },
  ];

  return (
    <FluentProvider theme={theme === "dark" ? webDarkTheme : webLightTheme} style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
      <DashboardLayout activeModule={activeModule} onSelectModule={handleSelectModule} onHomeClick={handleHomeClick}>
        <Routes>
          <Route
            path="/"
            element={
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { id: "vendas", label: "Vendas", icon: ShoppingCart },
                  { id: "caixa", label: "Caixa", icon: Wallet },
                  { id: "produto", label: "Produtos", icon: Box },
                  { id: "estoque", label: "Estoque", icon: Archive },
                  { id: "garantia", label: "Garantia", icon: ShieldCheck },
                  { id: "entregas", label: "Entregas", icon: Truck },
                  { id: "financas", label: "Finanças", icon: DollarSign },
                  { id: "faturamento", label: "Faturamento", icon: Receipt },
                  { id: "gerencia", label: "Gerência", icon: BarChart3 },
                ].map((module) => (
                  <ModuleCard
                    key={module.id}
                    title={module.label}
                    icon={module.icon}
                    onClick={() => handleSelectModule(module.id)}
                    description={`Acesse o módulo de ${module.label.toLowerCase()}.`}
                  />
                ))}
              </div>
            }
          />

          <Route
            path="/vendas/*"
            element={
              <div className="flex-1 flex flex-col min-h-0 h-full">
                <ModuleTabContainer
                  tabs={vendasTabs}
                  activeTabId={vendasActiveTabId}
                  onTabChange={handleVendasTabChange}
                  title="Vendas"
                  icon={ShoppingCart}
                />
              </div>
            }
          />

          <Route
            path="/caixa/*"
            element={
              <div className="flex-1 flex flex-col min-h-0 h-full">
                <ModuleTabContainer
                  tabs={caixaTabs}
                  defaultTabId="prevendas"
                  title="Caixa"
                  icon={Wallet}
                  isMaximized={isCaixaMaximized}
                  onMaximizeToggle={() => setIsCaixaMaximized(!isCaixaMaximized)}
                />
              </div>
            }
          />

          <Route
            path="/produto/*"
            element={
              <div className="flex-1 flex flex-col min-h-0 h-full">
                <ModuleTabContainer
                  tabs={produtoTabs}
                  defaultTabId="cadastro-produto"
                  title="Produtos"
                  icon={Box}
                />
              </div>
            }
          />

          <Route
            path="/estoque/*"
            element={
              <div className="flex-1 flex flex-col min-h-0 h-full">
                <ModuleTabContainer
                  tabs={estoqueTabs}
                  defaultTabId="entrada"
                  title="Estoque"
                  icon={Box}
                />
              </div>
            }
          />

          <Route
            path="/garantia/*"
            element={
              <div className="flex-1 flex flex-col min-h-0 h-full">
                <ModuleTabContainer
                  tabs={garantiaTabs}
                  defaultTabId="pendentes"
                  title="Garantia"
                  icon={ShieldCheck}
                />
              </div>
            }
          />

          <Route
            path="/entregas/*"
            element={
              <div className="flex-1 flex flex-col min-h-0 h-full">
                <ModuleTabContainer
                  tabs={entregasTabs}
                  defaultTabId="baias"
                  title="Entregas"
                  icon={Truck}
                />
              </div>
            }
          />

          <Route
            path="/financas/*"
            element={
              <div className="flex-1 flex flex-col min-h-0 h-full">
                <ModuleTabContainer
                  tabs={financasTabs}
                  defaultTabId="receber"
                  title="Finanças"
                  icon={DollarSign}
                />
              </div>
            }
          />

          <Route
            path="/faturamento/*"
            element={
              <div className="flex-1 flex flex-col min-h-0 h-full">
                <ModuleTabContainer
                  tabs={faturamentoTabs}
                  defaultTabId="fiscal"
                  title="Faturamento"
                  icon={Receipt}
                />
              </div>
            }
          />

          <Route
            path="/gerencia/*"
            element={
              <div className="flex-1 flex flex-col min-h-0 h-full">
                <ModuleTabContainer
                  tabs={gerenciaTabs}
                  defaultTabId="dashboard"
                  title="Gerência"
                  icon={BarChart3}
                />
              </div>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </FluentProvider>
  );
}

export default App;
