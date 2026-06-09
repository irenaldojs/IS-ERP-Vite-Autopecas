import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { ModuleTabContainer } from "@/components/layout/ModuleTabContainer";
import {
  ShoppingCart,
  Server,
  ShieldCheck,
  Terminal,
  Cpu,
  Box,
  DollarSign,
  LayoutGrid,
  ClipboardList,
} from "lucide-react";

function App() {
  const [activeModule, setActiveModule] = useState("home");
  const [name, setName] = useState("");
  const [greetMsg, setGreetMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function greet() {
    if (!name) return;
    setLoading(true);
    try {
      if (typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__) {
        setGreetMsg(await invoke("greet", { name }));
      } else {
        // Mock response if running in regular browser
        await new Promise((resolve) => setTimeout(resolve, 600));
        setGreetMsg(`Olá, ${name}! (Mensagem mock: Executando no navegador sem o Tauri)`);
      }
    } catch (error) {
      console.error("Erro ao invocar Tauri:", error);
      setGreetMsg(`Olá, ${name}! (Erro: ${error})`);
    } finally {
      setLoading(false);
    }
  }

  // Define screens for the Sales Module
  const vendasTabs = [
    {
      id: "pdv",
      label: "PDV (Caixa)",
      icon: ShoppingCart,
      component: (
        <div className="flex-1 w-full h-full border border-dashed border-slate-800 bg-[#0e1626]/20 rounded-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group min-h-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 blur-[90px] rounded-full pointer-events-none transition-all duration-300 group-hover:bg-indigo-500/8" />
          <div className="h-14 w-14 rounded-2xl bg-[#0e1626]/80 border border-slate-800 flex items-center justify-center mb-5 text-slate-400 group-hover:scale-105 transition-transform duration-300 shadow-md">
            <ShoppingCart className="h-6 w-6 text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight">
            Nenhuma Venda Aberta
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 max-w-sm leading-relaxed">
            O fluxo de Ponto de Venda (PDV), abertura de cupom e faturamento rápido de notas fiscais será executado aqui.
          </p>
        </div>
      ),
    },
    {
      id: "orcamentos",
      label: "Orçamentos",
      icon: ClipboardList,
      component: (
        <div className="flex-1 w-full h-full border border-dashed border-slate-800 bg-[#0e1626]/20 rounded-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group min-h-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 blur-[90px] rounded-full pointer-events-none transition-all duration-300 group-hover:bg-indigo-500/8" />
          <div className="h-14 w-14 rounded-2xl bg-[#0e1626]/80 border border-slate-800 flex items-center justify-center mb-5 text-slate-400 group-hover:scale-105 transition-transform duration-300 shadow-md">
            <ClipboardList className="h-6 w-6 text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight">
            Nenhum Orçamento Iniciado
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 max-w-sm leading-relaxed">
            Crie propostas comerciais e orçamentos rápidos de autopeças. Converta orçamentos em vendas com apenas um clique.
          </p>
        </div>
      ),
    },
    {
      id: "developer",
      label: "Conexão & Testes",
      icon: Terminal,
      component: (
        <div className="flex-1 h-full overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 pr-1">
          {/* Connection Status Card */}
          <div className="bg-[#0e1626]/50 border border-slate-850 rounded-2xl p-6 shadow-md space-y-4 self-start">
            <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
              <Cpu className="h-4 w-4 text-indigo-400" />
              <h4 className="text-sm font-semibold text-slate-200">
                Status do Terminal
              </h4>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Ambiente do App:</span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                  {typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-emerald-400">Tauri Shell</span>
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="text-indigo-400">Vite Browser</span>
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Porta Host:</span>
                <span className="font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">1420</span>
              </div>
            </div>
          </div>

          {/* Tauri Greet Test Form */}
          <div className="bg-[#0e1626]/50 border border-slate-850 rounded-2xl p-6 shadow-md space-y-4 self-start">
            <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
              <Terminal className="h-4 w-4 text-indigo-400" />
              <h4 className="text-sm font-semibold text-slate-200">
                Teste de IPC (Rust Bridge)
              </h4>
            </div>

            <form
              className="space-y-3.5"
              onSubmit={(e) => {
                e.preventDefault();
                greet();
              }}
            >
              <div className="space-y-1.5">
                <label htmlFor="greet-input" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Nome do Operador
                </label>
                <input
                  id="greet-input"
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-[#070a13] text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-xs transition-all placeholder:text-slate-650"
                  onChange={(e) => setName(e.currentTarget.value)}
                  placeholder="Digite para testar a comunicação..."
                  value={name}
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !name}
                variant="default"
                className="w-full text-xs font-semibold cursor-pointer shadow-md disabled:opacity-40 py-2 h-auto bg-indigo-600 text-white hover:bg-indigo-500 border-none transition-all duration-200 hover:shadow-indigo-500/25"
              >
                {loading ? "Chamando..." : "Saudar Backend"}
              </Button>
            </form>

            {greetMsg && (
              <div className="p-3 bg-[#070a13] border border-slate-850 rounded-xl text-[11px] font-mono text-slate-400 break-words leading-relaxed border-l-2 border-l-indigo-500 animate-fade-in">
                {greetMsg}
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      activeModule={activeModule}
      onSelectModule={setActiveModule}
      onHomeClick={() => setActiveModule("home")}
    >
      {activeModule === "vendas" ? (
        <div className="flex-1 flex flex-col min-h-0 h-full">
          {/* Module Sub-tabs Container with integrated title */}
          <ModuleTabContainer
            tabs={vendasTabs}
            defaultTabId="pdv"
            title="Vendas"
            icon={ShoppingCart}
          />
        </div>
      ) : (
        /* Modules Dashboard (Home View) */
        <div className="space-y-6">
          {/* Dashboard Header */}
          <div className="flex flex-col gap-1.5 relative">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                <LayoutGrid className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-100">
                Módulos do Sistema
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              Selecione o módulo abaixo para iniciar as operações do ERP. Módulos adicionais serão habilitados conforme o nível de acesso da estação.
            </p>
          </div>

          {/* Module Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {/* Vendas Card (Active) */}
            <ModuleCard
              title="Vendas & Faturamento"
              description="Abertura de PDV, lançamento de orçamentos rápidos, finalização de notas e controle de caixa."
              icon={ShoppingCart}
              onClick={() => setActiveModule("vendas")}
            />

            {/* Estoque Card (Placeholder / Coming Soon) */}
            <div className="opacity-40 cursor-not-allowed">
              <ModuleCard
                title="Controle de Estoque"
                description="Cadastro de autopeças, controle de prateleiras, inventários e entrada automática de XML."
                icon={Box}
                onClick={() => {}}
                badge="Em breve"
              />
            </div>

            {/* Financeiro Card (Placeholder / Coming Soon) */}
            <div className="opacity-40 cursor-not-allowed">
              <ModuleCard
                title="Fluxo Financeiro"
                description="Controle de fluxo de caixa diário, contas a pagar, recebimentos e boletos."
                icon={DollarSign}
                onClick={() => {}}
                badge="Em breve"
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default App;
