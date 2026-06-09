import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Server, ShieldCheck, Terminal, Cpu } from "lucide-react";

function App() {
  const [activeModule, setActiveModule] = useState("vendas");
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

  return (
    <DashboardLayout
      activeModule={activeModule}
      onSelectModule={setActiveModule}
      onHomeClick={() => setActiveModule("home")}
    >
      {activeModule === "vendas" ? (
        <div className="space-y-6">
          {/* Module Header */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                <ShoppingCart className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-100">
                Módulo de Vendas
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Gerencie orçamentos, pedidos de vendas e emissão de notas fiscais de peças.
            </p>
          </div>

          {/* Grid Layout containing empty state and development test cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Empty Main Area (VS Code / Dark style) */}
            <div className="lg:col-span-2 min-h-[420px] border border-dashed border-slate-800 bg-[#0e1626]/20 rounded-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group">
              {/* Premium Glow effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none transition-all duration-300 group-hover:bg-indigo-500/8" />

              <div className="h-14 w-14 rounded-2xl bg-[#0e1626]/80 border border-slate-800 flex items-center justify-center mb-5 text-slate-400 group-hover:scale-105 transition-transform duration-300 shadow-md">
                <ShoppingCart className="h-6 w-6 text-indigo-400" />
              </div>
              
              <h3 className="text-base font-bold text-slate-100 tracking-tight">
                Nenhuma Venda Aberta
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 max-w-sm leading-relaxed">
                O fluxo de Ponto de Venda (PDV) e emissão rápida será carregado aqui. Comece criando um orçamento ou pedido.
              </p>
            </div>

            {/* Side column: Developer Tools & Tauri IPC Bridge Test */}
            <div className="space-y-6">
              {/* Connection Status Card */}
              <div className="bg-[#0e1626]/50 border border-slate-850 rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
                  <Cpu className="h-4 w-4 text-indigo-400" />
                  <h4 className="text-sm font-semibold text-slate-200">
                    Status do Terminal
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-450">Ambiente do App:</span>
                    <span className="flex items-center gap-1.5 font-semibold text-slate-250">
                      {typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-emerald-450">Tauri Shell</span>
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
                    <span className="text-slate-450">Porta Host:</span>
                    <span className="font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">1420</span>
                  </div>
                </div>
              </div>

              {/* Tauri Greet Test Form */}
              <div className="bg-[#0e1626]/50 border border-slate-850 rounded-2xl p-6 shadow-md space-y-4">
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
                      className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-[#070a13] text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-xs transition-all placeholder:text-slate-600"
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
                  <div className="p-3 bg-[#070a13] border border-slate-850 rounded-xl text-[11px] font-mono text-slate-400 break-words leading-relaxed border-l-2 border-l-indigo-500">
                    {greetMsg}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Dashboard Home State (Vite/Tauri welcome) */
        <div className="flex flex-col items-center justify-center min-h-[450px] text-center space-y-5 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="h-16 w-16 bg-[#0e1626] border border-slate-800 rounded-2xl flex items-center justify-center text-indigo-400 shadow-lg relative group">
            <Cpu className="h-8 w-8 animate-pulse text-indigo-400" />
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
          </div>
          
          <div className="space-y-2 max-w-sm">
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              Bem-vindo ao IS-ERP Autopeças
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              O sistema operacional está pronto para uso. Navegue pelos módulos disponíveis na barra lateral à esquerda.
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default App;
