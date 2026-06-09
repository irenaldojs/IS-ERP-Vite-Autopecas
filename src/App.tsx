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
  MessageCircle,
  Truck,
  BarChart3,
  Search,
  Plus,
  Send,
  UserCheck,
  Clock,
  ArrowRight,
  Wallet,
  Printer,
  Coins,
  Banknote,
  FileUp,
  PlusCircle,
  Scale,
  List,
} from "lucide-react";

function App() {
  const [activeModule, setActiveModule] = useState("home");
  const [name, setName] = useState("");
  const [greetMsg, setGreetMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCaixaMaximized, setIsCaixaMaximized] = useState(false);

  // Cashier item state for mock Pre-Vendas
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Pastilha de Freio Cobreq (Par)", code: "FP-1092", qty: 1, price: 189.90 },
    { id: 2, name: "Óleo Motor Selenia 5W30 1L", code: "OL-3021", qty: 4, price: 42.50 },
    { id: 3, name: "Filtro de Combustível Fram", code: "FC-4009", qty: 1, price: 34.90 },
  ]);

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

  // Calculate cart totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = 15.00;
  const total = subtotal - discount;

  // Define screens for the Sales Module (Vendas)
  const vendasTabs = [
    {
      id: "orcamento",
      label: "Orçamento",
      icon: ClipboardList,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Action Bar */}
          <div className="flex justify-between items-center shrink-0">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Pesquisar orçamento..."
                className="w-full pl-9 pr-4 py-1.5 bg-[#0e1626]/40 border border-slate-800 rounded-lg text-xs text-slate-350 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-1.5 px-3 h-auto rounded-lg flex items-center gap-1.5 cursor-pointer">
              <Plus className="h-3.5 w-3.5" /> Novo Orçamento
            </Button>
          </div>

          {/* Table Container */}
          <div className="flex-1 border border-slate-850 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                    <th className="p-3">Nº</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Veículo</th>
                    <th className="p-3">Data</th>
                    <th className="p-3 text-right">Valor</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">#00982</td>
                    <td className="p-3 font-semibold text-slate-200">Marcos Rogério Silva</td>
                    <td className="p-3">Honda Civic 2018 2.0</td>
                    <td className="p-3">09/06/2026</td>
                    <td className="p-3 text-right font-semibold">R$ 1.250,00</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-450 border border-amber-500/20">Aguardando</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">#00981</td>
                    <td className="p-3 font-semibold text-slate-200">Juliana Nogueira Santos</td>
                    <td className="p-3">Chevrolet Onix 1.0 Turbo</td>
                    <td className="p-3">08/06/2026</td>
                    <td className="p-3 text-right font-semibold">R$ 394,80</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">Aprovado</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">#00980</td>
                    <td className="p-3 font-semibold text-slate-200">Auto Mecânica Souza</td>
                    <td className="p-3">Fiat Uno Vivace 1.0</td>
                    <td className="p-3">08/06/2026</td>
                    <td className="p-3 text-right font-semibold">R$ 145,00</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">Cancelado</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "whatsapp",
      label: "Whatsapp",
      icon: MessageCircle,
      component: (
        <div className="flex-1 w-full h-full flex gap-4 min-h-0 bg-[#070a13]">
          {/* Chat Sidebar */}
          <div className="w-64 border border-slate-850 rounded-xl bg-[#0e1626]/20 flex flex-col min-h-0 shrink-0">
            <div className="p-3 border-b border-slate-850/60 shrink-0">
              <input
                type="text"
                placeholder="Pesquisar conversa..."
                className="w-full pl-3 pr-3 py-1 bg-[#070a13] border border-slate-800 rounded-lg text-[11px] text-slate-350 focus:outline-none"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
              <button className="w-full flex items-center justify-between p-2 rounded-lg bg-[#16223f]/50 border border-slate-800 text-left cursor-pointer">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-200 truncate">Marcos Rogério</span>
                  <span className="text-[10px] text-slate-400 truncate">Orçamento #00982 enviado...</span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">12:35</span>
              </button>
              <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#0e1626]/40 text-left cursor-pointer">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-300 truncate">Oficina Central</span>
                  <span className="text-[10px] text-slate-505 truncate">Tudo certo com a entrega?</span>
                </div>
                <span className="text-[9px] text-slate-505 font-mono">Ontem</span>
              </button>
            </div>
          </div>

          {/* Active Chat Conversation */}
          <div className="flex-1 border border-slate-850 rounded-xl bg-[#0e1626]/10 flex flex-col min-h-0">
            {/* Header */}
            <div className="p-3 border-b border-slate-850/60 bg-[#0e1626]/40 flex justify-between items-center shrink-0 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-[10px]">MR</div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-200">Marcos Rogério Silva</span>
                  <span className="text-[9px] text-emerald-450 flex items-center gap-1 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-455 bg-[#16223f]/40 px-2 py-0.5 rounded border border-slate-800">Honda Civic 2018</span>
            </div>

            {/* Message Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 flex flex-col justify-end min-h-0 bg-[#070a13]/30">
              {/* Receiver */}
              <div className="bg-[#0e1626]/60 border border-slate-850 rounded-xl p-3 max-w-[80%] self-start text-xs text-slate-300 leading-relaxed shadow-sm">
                Olá, gostaria de cotar o jogo de pastilhas de freio dianteiras e filtros para o meu Civic 2018.
                <span className="block text-[9px] text-slate-500 text-right mt-1 font-mono">12:30</span>
              </div>
              {/* Sender */}
              <div className="bg-indigo-650 rounded-xl p-3 max-w-[80%] self-end text-xs text-slate-100 leading-relaxed shadow-md shadow-indigo-600/5">
                Com certeza, Marcos! Já montei o orçamento #00982 com peças originais e de reposição premium. O total ficou em R$ 1.250,00 com desconto para pagamento PIX.
                <span className="block text-[9px] text-slate-400 text-right mt-1 font-mono">12:34</span>
              </div>
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-slate-850/60 bg-[#0e1626]/40 flex gap-2 shrink-0 rounded-b-xl">
              <input
                type="text"
                placeholder="Escreva sua mensagem rápida..."
                className="flex-1 px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              />
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 h-auto rounded-lg cursor-pointer shrink-0">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "prevendas",
      label: "Pré-Vendas",
      icon: ShoppingCart,
      component: (
        <div className="flex-1 w-full h-full flex flex-col lg:flex-row gap-4 min-h-0 bg-[#070a13]">
          {/* Main cashier item entries */}
          <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/10 flex flex-col min-h-0">
            {/* Search items bar */}
            <div className="p-3 border-b border-slate-850/60 bg-[#0e1626]/30 flex gap-2 shrink-0 rounded-t-xl">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Pesquisar código, peça ou marca de veículo..."
                  className="w-full pl-9 pr-4 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-350 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <Button className="bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-300 text-xs font-semibold py-1.5 px-3 h-auto rounded-lg cursor-pointer">
                Consultar Estoque
              </Button>
            </div>

            {/* Cart Items Table */}
            <div className="flex-grow overflow-y-auto min-h-0">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850/60 text-slate-500 font-semibold bg-[#0e1626]/10">
                    <th className="p-2.5 pl-4">Código</th>
                    <th className="p-2.5">Descrição da Peça</th>
                    <th className="p-2.5 text-center">Qtd</th>
                    <th className="p-2.5 text-right">Unitário</th>
                    <th className="p-2.5 text-right pr-4">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/50 text-slate-355">
                  {cartItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#16223f]/10">
                      <td className="p-2.5 pl-4 font-mono text-slate-450">{item.code}</td>
                      <td className="p-2.5 font-semibold text-slate-250">{item.name}</td>
                      <td className="p-2.5 text-center font-semibold">{item.qty}</td>
                      <td className="p-2.5 text-right">R$ {item.price.toFixed(2)}</td>
                      <td className="p-2.5 text-right pr-4 font-bold text-slate-200">
                        R$ {(item.price * item.qty).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Checkout Totals Summary sidebar */}
          <div className="w-full lg:w-72 border border-slate-850 rounded-xl bg-[#0e1626]/40 p-4 flex flex-col justify-between shrink-0">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2">
                Resumo da Pré-venda
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-455">Subtotal:</span>
                  <span className="text-slate-250 font-semibold">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-455">Descontos:</span>
                  <span className="text-emerald-450 font-semibold">- R$ {discount.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-800/80 my-2 pt-2 flex justify-between text-sm">
                  <span className="font-bold text-slate-300">Total Líquido:</span>
                  <span className="font-extrabold text-indigo-400">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 pt-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-1.5 text-[10px] font-bold bg-[#16223f] border border-indigo-500/20 text-indigo-400 rounded-lg cursor-pointer">
                    PIX
                  </button>
                  <button className="py-1.5 text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-400 rounded-lg cursor-pointer">
                    Cartão
                  </button>
                </div>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-550 hover:to-violet-550 text-white text-xs font-bold py-2.5 h-auto rounded-lg shadow-lg shadow-indigo-600/10 cursor-pointer mt-4 uppercase tracking-wider">
              Lançar Pré-Venda
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "entregas",
      label: "Entregas",
      icon: Truck,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Status Row */}
          <div className="grid grid-cols-3 gap-4 shrink-0">
            <div className="bg-[#0e1626]/30 border border-slate-850 p-3.5 rounded-xl flex items-center justify-between">
              <span className="text-xs text-slate-400">Pendentes</span>
              <span className="text-lg font-bold text-amber-455">2</span>
            </div>
            <div className="bg-[#0e1626]/30 border border-slate-850 p-3.5 rounded-xl flex items-center justify-between">
              <span className="text-xs text-slate-400">Em Rota</span>
              <span className="text-lg font-bold text-indigo-400">1</span>
            </div>
            <div className="bg-[#0e1626]/30 border border-slate-850 p-3.5 rounded-xl flex items-center justify-between">
              <span className="text-xs text-slate-400">Finalizadas</span>
              <span className="text-lg font-bold text-emerald-455">14</span>
            </div>
          </div>

          {/* Delivery Board/List */}
          <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/20 p-4 space-y-3 overflow-y-auto min-h-0">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2">
              Ordens de Entrega do Dia
            </h4>

            {/* Delivery Items */}
            <div className="space-y-2.5">
              <div className="p-3 bg-[#070a13] border border-slate-850 rounded-xl flex flex-col sm:flex-row justify-between gap-3 text-xs">
                <div className="flex flex-col space-y-1">
                  <span className="font-bold text-slate-200">#ENT-9092 • Marcos Rogério Silva</span>
                  <span className="text-slate-500">Av. Paulista, 1200 - Bela Vista</span>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-semibold">Motoboy Carlos</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-455 border border-amber-500/20">Em Rota</span>
                </div>
              </div>

              <div className="p-3 bg-[#070a13] border border-slate-850 rounded-xl flex flex-col sm:flex-row justify-between gap-3 text-xs">
                <div className="flex flex-col space-y-1">
                  <span className="font-bold text-slate-300">#ENT-9091 • Auto Mecânica Souza</span>
                  <span className="text-slate-500">Rua Vergueiro, 3500 - Vila Mariana</span>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <span className="text-[10px] text-slate-505 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-semibold">Retirada Balcão</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#16223f] text-slate-400 border border-slate-800">Pendente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "relatorio",
      label: "Relatório",
      icon: BarChart3,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            <div className="bg-[#0e1626]/40 border border-slate-850 p-4 rounded-xl space-y-1 shadow-sm">
              <span className="text-[10px] font-bold text-slate-505 uppercase tracking-wider">Faturamento Hoje</span>
              <h4 className="text-base font-black text-slate-100">R$ 4.894,70</h4>
              <span className="text-[9px] text-emerald-450 font-semibold">+ 12% em relação a ontem</span>
            </div>
            <div className="bg-[#0e1626]/40 border border-slate-850 p-4 rounded-xl space-y-1 shadow-sm">
              <span className="text-[10px] font-bold text-slate-505 uppercase tracking-wider">Orçamentos Abertos</span>
              <h4 className="text-base font-black text-slate-100">8 Ativos</h4>
              <span className="text-[9px] text-indigo-400 font-semibold">Conversão de 65%</span>
            </div>
            <div className="bg-[#0e1626]/40 border border-slate-850 p-4 rounded-xl space-y-1 shadow-sm">
              <span className="text-[10px] font-bold text-slate-505 uppercase tracking-wider">Ticket Médio</span>
              <h4 className="text-base font-black text-slate-100">R$ 326,30</h4>
              <span className="text-[9px] text-indigo-400 font-semibold">Dentro da meta</span>
            </div>
          </div>

          {/* Chart Placeholder / Performance Box */}
          <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/20 p-4 space-y-4 min-h-0 flex flex-col justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2 shrink-0">
              Desempenho Semanal de Vendas
            </h4>

            {/* CSS Bar Chart Layout */}
            <div className="flex-1 flex items-end justify-around h-44 gap-2 pt-6 pb-2 px-6 shrink-0">
              <div className="flex flex-col items-center gap-1.5 w-8">
                <div className="bg-indigo-600/20 hover:bg-indigo-650/40 border border-indigo-600/30 w-full h-24 rounded-t-md transition-all duration-300 relative group">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">1.2k</span>
                </div>
                <span className="text-[9px] text-slate-500 font-semibold">SEG</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 w-8">
                <div className="bg-indigo-600/20 hover:bg-indigo-650/40 border border-indigo-600/30 w-full h-32 rounded-t-md transition-all duration-300 relative group">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">1.8k</span>
                </div>
                <span className="text-[9px] text-slate-500 font-semibold">TER</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 w-8">
                <div className="bg-indigo-600/20 hover:bg-indigo-650/40 border border-indigo-600/30 w-full h-20 rounded-t-md transition-all duration-300 relative group">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">950</span>
                </div>
                <span className="text-[9px] text-slate-505 font-semibold">QUA</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 w-8">
                <div className="bg-indigo-600/30 hover:bg-indigo-650/50 border border-indigo-500/40 w-full h-40 rounded-t-md transition-all duration-300 relative group">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">2.4k</span>
                </div>
                <span className="text-[9px] text-slate-455 font-bold">QUI</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 w-8">
                <div className="bg-indigo-600/20 hover:bg-indigo-650/40 border border-indigo-600/30 w-full h-14 rounded-t-md transition-all duration-300 relative group">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">600</span>
                </div>
                <span className="text-[9px] text-slate-505 font-semibold">SEX</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Define screens for the Cashier Module (Caixa)
  const caixaTabs = [
    {
      id: "prevendas",
      label: "Pré-Vendas",
      icon: ClipboardList,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Action Bar */}
          <div className="flex justify-between items-center shrink-0">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar pré-venda pendente..."
                className="w-full pl-9 pr-4 py-1.5 bg-[#0e1626]/40 border border-slate-800 rounded-lg text-xs text-slate-355 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="text-[10px] text-slate-400 bg-[#0e1626]/20 px-3 py-1.5 rounded-lg border border-slate-800">
              Estação de Caixa: <strong className="text-slate-200">Terminal 01</strong>
            </div>
          </div>

          {/* Pending pre-sales table */}
          <div className="flex-1 border border-slate-850 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-450 font-semibold">
                    <th className="p-3">Código PV</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Vendedor</th>
                    <th className="p-3">Data</th>
                    <th className="p-3 text-right">Valor Total</th>
                    <th className="p-3 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">#PV-9821</td>
                    <td className="p-3 font-semibold text-slate-200">Marcos Rogério Silva</td>
                    <td className="p-3">Irenaldo (Vendas)</td>
                    <td className="p-3">09/06/2026</td>
                    <td className="p-3 text-right font-bold text-slate-100">R$ 267,30</td>
                    <td className="p-3 text-center">
                      <Button className="bg-indigo-650 hover:bg-indigo-555 text-white text-[10px] py-1 px-2.5 h-auto rounded cursor-pointer font-bold uppercase tracking-wider">
                        Receber e Emitir
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">#PV-9820</td>
                    <td className="p-3 font-semibold text-slate-200">Auto Mecânica Souza</td>
                    <td className="p-3">Irenaldo (Vendas)</td>
                    <td className="p-3">09/06/2026</td>
                    <td className="p-3 text-right font-bold text-slate-100">R$ 145,00</td>
                    <td className="p-3 text-center">
                      <Button className="bg-indigo-650 hover:bg-indigo-555 text-white text-[10px] py-1 px-2.5 h-auto rounded cursor-pointer font-bold uppercase tracking-wider">
                        Receber e Emitir
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "emissao",
      label: "Emissão",
      icon: Printer,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Action Bar */}
          <div className="flex justify-between items-center shrink-0">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Notas Fiscais Emitidas (NFC-e / NF-e)
            </h4>
            <div className="flex gap-2">
              <Button className="bg-[#16223f]/40 border border-slate-800 text-slate-300 text-xs font-semibold py-1 px-2.5 h-auto rounded-lg cursor-pointer">
                Ver Inutilizações
              </Button>
            </div>
          </div>

          {/* Invoices List */}
          <div className="flex-1 border border-slate-850 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                    <th className="p-3">Nº Cupom</th>
                    <th className="p-3">Tipo</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Data Emissão</th>
                    <th className="p-3 text-right">Valor</th>
                    <th className="p-3 text-center">Sefaz Status</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">00010928</td>
                    <td className="p-3 font-semibold text-slate-400">NFC-e (65)</td>
                    <td className="p-3">Consumidor Não Identificado</td>
                    <td className="p-3">09/06/2026 00:44</td>
                    <td className="p-3 text-right font-semibold">R$ 89,90</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 uppercase tracking-wider">Autorizada</span>
                    </td>
                    <td className="p-3 text-center flex justify-center gap-1.5">
                      <button className="p-1 hover:bg-[#16223f] border border-slate-800 rounded text-slate-300 transition-colors cursor-pointer" title="Imprimir Danfe">
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">00010927</td>
                    <td className="p-3 font-semibold text-slate-400">NFC-e (65)</td>
                    <td className="p-3">Juliana Nogueira Santos</td>
                    <td className="p-3">08/06/2026 18:21</td>
                    <td className="p-3 text-right font-semibold">R$ 394,80</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 uppercase tracking-wider">Autorizada</span>
                    </td>
                    <td className="p-3 text-center flex justify-center gap-1.5">
                      <button className="p-1 hover:bg-[#16223f] border border-slate-800 rounded text-slate-300 transition-colors cursor-pointer" title="Imprimir Danfe">
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "caixa_operacoes",
      label: "Caixa",
      icon: Coins,
      component: (
        <div className="flex-1 w-full h-full flex flex-col md:flex-row gap-4 min-h-0 bg-[#070a13]">
          {/* Caixa Status & Summary */}
          <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/20 p-6 flex flex-col justify-between min-h-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Resumo Financeiro do Caixa (Turno Atual)
                </h4>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  Caixa Aberto
                </span>
              </div>

              {/* Balances list */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-[#070a13] border border-slate-850 rounded-lg">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Abertura</span>
                  <p className="text-sm font-bold text-slate-300">R$ 200,00</p>
                </div>
                <div className="p-3 bg-[#070a13] border border-slate-850 rounded-lg">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Entradas</span>
                  <p className="text-sm font-bold text-emerald-450">R$ 850,00</p>
                </div>
                <div className="p-3 bg-[#070a13] border border-slate-850 rounded-lg">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Saídas (Sangria)</span>
                  <p className="text-sm font-bold text-red-400">R$ 50,00</p>
                </div>
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                  <span className="text-[9px] font-bold text-indigo-450 uppercase">Saldo Atual</span>
                  <p className="text-sm font-black text-indigo-300">R$ 1.000,00</p>
                </div>
              </div>
            </div>

            {/* Cash Operations (Sangria / Suprimento / Fechamento) */}
            <div className="flex gap-2 pt-6 border-t border-slate-850 mt-6 shrink-0">
              <Button className="bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-350 text-xs font-semibold py-2 px-4 h-auto rounded-lg cursor-pointer">
                Sangria (Retirada)
              </Button>
              <Button className="bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-350 text-slate-350 text-xs font-semibold py-2 px-4 h-auto rounded-lg cursor-pointer">
                Suprimento (Aporte)
              </Button>
              <Button className="ml-auto bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 text-xs font-semibold py-2 px-4 h-auto rounded-lg cursor-pointer">
                Fechar Caixa (Fim de Turno)
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Define screens for the Stock Module (Estoque)
  const estoqueTabs = [
    {
      id: "entrada",
      label: "Entrada",
      icon: FileUp,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Action Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            {/* XML Import Zone */}
            <div className="md:col-span-2 border border-dashed border-slate-800 bg-[#0e1626]/20 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500/35 transition-colors">
              <FileUp className="h-7 w-7 text-indigo-400 mb-2" />
              <span className="text-xs font-bold text-slate-200">Importar XML de NFe</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Arraste o arquivo XML do fornecedor ou clique para selecionar</p>
            </div>
            {/* Manual Entrada Form Card */}
            <div className="bg-[#0e1626]/30 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Lançamento</span>
                <h4 className="text-xs font-bold text-slate-200">Entrada Manual</h4>
                <p className="text-[10px] text-slate-500">Lance notas de fornecedores sem XML</p>
              </div>
              <Button className="w-full bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-205 text-[10px] py-1.5 h-auto rounded-lg cursor-pointer mt-3">
                Nova Entrada Manual
              </Button>
            </div>
          </div>

          {/* Recent entries table */}
          <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="p-3 border-b border-slate-850/60 bg-[#0e1626]/40 flex justify-between items-center shrink-0">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notas Fiscais de Entrada Importadas</h4>
            </div>
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                    <th className="p-3 pl-4">Nº Nota</th>
                    <th className="p-3">Fornecedor</th>
                    <th className="p-3">Chave de Acesso</th>
                    <th className="p-3">Data Entrada</th>
                    <th className="p-3 text-right pr-4">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">002.190.283</td>
                    <td className="p-3 font-semibold text-slate-200">Distribuidora DPK Autopeças</td>
                    <td className="p-3 font-mono text-slate-500">352606...908123</td>
                    <td className="p-3">09/06/2026</td>
                    <td className="p-3 text-right pr-4 font-bold">R$ 4.390,20</td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">001.209.182</td>
                    <td className="p-3 font-semibold text-slate-200">Cofap Sistemas de Suspensão</td>
                    <td className="p-3 font-mono text-slate-500">352606...908990</td>
                    <td className="p-3">08/06/2026</td>
                    <td className="p-3 text-right pr-4 font-bold">R$ 12.800,00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "cadastro",
      label: "Cadastro",
      icon: PlusCircle,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Cadastro Form Card */}
          <div className="border border-slate-850 rounded-xl bg-[#0e1626]/20 p-5 space-y-4 max-w-3xl mx-auto w-full">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2">
              Cadastrar Nova Autopeça
            </h4>
            
            <form className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Código Interno</label>
                  <input type="text" className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none" placeholder="EX: AP-1092" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Descrição do Produto</label>
                  <input type="text" className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none" placeholder="EX: Jogo Pastilha de Freio Dianteira" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Marca</label>
                  <input type="text" className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none" placeholder="EX: Cobreq" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Categoria</label>
                  <select className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-400 focus:outline-none">
                    <option>Freios</option>
                    <option>Motor</option>
                    <option>Suspensão</option>
                    <option>Elétrica</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Preço Custo</label>
                  <input type="text" className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-305 focus:outline-none" placeholder="R$ 0,00" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Preço Venda</label>
                  <input type="text" className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-305 focus:outline-none" placeholder="R$ 0,00" />
                </div>
              </div>

              <Button type="button" className="bg-indigo-650 hover:bg-indigo-555 text-white font-bold py-2 px-4 h-auto rounded-lg cursor-pointer uppercase tracking-wider">
                Salvar Produto
              </Button>
            </form>
          </div>
        </div>
      ),
    },
    {
      id: "balanco",
      label: "Balanço",
      icon: Scale,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Action Row */}
          <div className="flex justify-between items-center shrink-0">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Inventário e Balanço de Estoque
            </h4>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-1.5 px-3 h-auto rounded-lg cursor-pointer">
              Iniciar Novo Balanço
            </Button>
          </div>

          {/* Active Balance Tasks */}
          <div className="border border-slate-850 rounded-xl bg-[#0e1626]/20 p-4 space-y-3">
            <div className="p-3 bg-[#070a13] border border-slate-850 rounded-xl flex flex-col sm:flex-row justify-between gap-3 text-xs">
              <div className="flex flex-col space-y-1">
                <span className="font-bold text-slate-200">Balanço Geral - Setor Freios (Estante A)</span>
                <span className="text-slate-500 font-mono text-[10px]">Contagem iniciada em 09/06/2026</span>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                {/* Custom CSS Progress Bar */}
                <div className="w-32 bg-slate-850 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-indigo-550 h-full w-[45%]" />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">45% Concluído</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-450 border border-amber-500/20">Em Andamento</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "lista",
      label: "Lista",
      icon: List,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Filter Bar */}
          <div className="flex gap-2 shrink-0">
            <div className="relative flex-grow max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Pesquisar no catálogo..."
                className="w-full pl-9 pr-4 py-1.5 bg-[#0e1626]/40 border border-slate-800 rounded-lg text-xs text-slate-350 focus:outline-none"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                    <th className="p-3 pl-4">Código</th>
                    <th className="p-3">Peça</th>
                    <th className="p-3">Marca</th>
                    <th className="p-3">Categoria</th>
                    <th className="p-3 text-right">Preço Venda</th>
                    <th className="p-3 text-center">Quantidade</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">FP-1092</td>
                    <td className="p-3 font-semibold text-slate-200">Pastilha de Freio Cobreq (Par)</td>
                    <td className="p-3">Cobreq</td>
                    <td className="p-3">Freios</td>
                    <td className="p-3 text-right">R$ 189,90</td>
                    <td className="p-3 text-center font-bold">12 UN</td>
                    <td className="p-3 text-center">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">OL-3021</td>
                    <td className="p-3 font-semibold text-slate-200">Óleo Motor Selenia 5W30 1L</td>
                    <td className="p-3">Selenia</td>
                    <td className="p-3">Motor</td>
                    <td className="p-3 text-right">R$ 42,50</td>
                    <td className="p-3 text-center font-bold">4 UN</td>
                    <td className="p-3 text-center">
                      <span className="h-2 w-2 rounded-full bg-red-500 inline-block animate-pulse" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
            key="vendas"
            tabs={vendasTabs}
            defaultTabId="orcamento"
            title="Vendas"
            icon={ShoppingCart}
          />
        </div>
      ) : activeModule === "caixa" ? (
        <div className="flex-1 flex flex-col min-h-0 h-full">
          {/* Module Sub-tabs Container with integrated title */}
          <ModuleTabContainer
            key="caixa"
            tabs={caixaTabs}
            defaultTabId="prevendas"
            title="Caixa"
            icon={Wallet}
            isMaximized={isCaixaMaximized}
            onMaximizeToggle={() => setIsCaixaMaximized(!isCaixaMaximized)}
          />
        </div>
      ) : activeModule === "estoque" ? (
        <div className="flex-1 flex flex-col min-h-0 h-full">
          {/* Module Sub-tabs Container with integrated title */}
          <ModuleTabContainer
            key="estoque"
            tabs={estoqueTabs}
            defaultTabId="entrada"
            title="Estoque"
            icon={Box}
          />
        </div>
      ) : (
        /* Modules Dashboard (Home View) */
        <div className="space-y-6 flex-grow flex flex-col justify-between">
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
              <p className="text-xs text-slate-400 max-w-xl font-medium">
                Selecione o módulo abaixo para iniciar as operações do ERP. Módulos adicionais serão habilitados conforme o nível de acesso da estação.
              </p>
            </div>

            {/* Module Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {/* Vendas Card (Active) */}
              <ModuleCard
                title="Vendas & Faturamento"
                description="Lançamento de orçamentos rápidos, Whatsapp, pré-vendas integradas, entregas e relatórios."
                icon={ShoppingCart}
                onClick={() => setActiveModule("vendas")}
              />

              {/* Caixa Card (Active) */}
              <ModuleCard
                title="Frente de Caixa"
                description="Importação de pré-vendas, recebimento de valores, suprimentos, sangria e emissão de NFC-e."
                icon={Wallet}
                onClick={() => setActiveModule("caixa")}
              />

              {/* Estoque Card (Active) */}
              <ModuleCard
                title="Controle de Estoque"
                description="Cadastro de autopeças, importação de XML de compras, inventário e controle de balanço."
                icon={Box}
                onClick={() => setActiveModule("estoque")}
              />

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

          {/* Relocated Developer / Connection Tests section (Bottom of Home View) */}
          <div className="border-t border-slate-850/60 pt-6 mt-8 space-y-4">
            <div className="flex items-center gap-2 text-slate-455">
              <Terminal className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Painel de Desenvolvimento</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Connection Status Card */}
              <div className="bg-[#0e1626]/20 border border-slate-850/80 rounded-xl p-4 flex items-center justify-between text-xs text-slate-450">
                <span className="flex items-center gap-2">
                  <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                  Terminal: <strong className="text-slate-200">CAIXA-01</strong>
                </span>
                <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  {typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ ? (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      Tauri Shell
                    </>
                  ) : (
                    <>
                      <Server className="h-3.5 w-3.5 text-blue-500" />
                      Vite Browser (1420)
                    </>
                  )}
                </span>
              </div>

              {/* Tauri Greet Test Form */}
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  greet();
                }}
              >
                <input
                  type="text"
                  className="flex-1 px-3 py-1.5 bg-[#0e1626]/20 border border-slate-850 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  onChange={(e) => setName(e.currentTarget.value)}
                  placeholder="Nome para saudar..."
                  value={name}
                />
                <Button
                  type="submit"
                  disabled={loading || !name}
                  className="text-xs bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-200 py-1.5 px-3 h-auto cursor-pointer"
                >
                  {loading ? "Testando..." : "Saudar Rust"}
                </Button>
              </form>
            </div>

            {greetMsg && (
              <div className="p-3 bg-[#0e1626]/25 border border-slate-850 rounded-xl text-[11px] font-mono text-slate-400 border-l-2 border-l-indigo-500">
                {greetMsg}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default App;
