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
  Clock,
  Wallet,
  Printer,
  Coins,
  FileUp,
  PlusCircle,
  Scale,
  List,
  Archive,
  CornerDownLeft,
  MapPin,
  Layers,
  Navigation,
  Map,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  ShieldAlert,
  Receipt,
  Sliders,
} from "lucide-react";

function App() {
  const [activeModule, setActiveModule] = useState("home");
  const [name, setName] = useState("");
  const [greetMsg, setGreetMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCaixaMaximized, setIsCaixaMaximized] = useState(false);

  // Cashier item state for mock Pre-Vendas
  const [cartItems] = useState([
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
                className="w-full pl-3 pr-3 py-1 bg-[#070a13] border border-slate-800 rounded-lg text-[11px] text-slate-355 focus:outline-none"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
              <button className="w-full flex items-center justify-between p-2 rounded-lg bg-[#16223f]/50 border border-slate-800 text-left cursor-pointer">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-200 truncate">Marcos Rogério</span>
                  <span className="text-[10px] text-slate-400 truncate">Orçamento #00982 enviado...</span>
                </div>
                <span className="text-[9px] text-slate-505 font-mono">12:35</span>
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
                <span className="block text-[9px] text-slate-505 text-right mt-1 font-mono">12:30</span>
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
                      <td className="p-2.5 font-semibold text-slate-255">{item.name}</td>
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
                  <span className="text-slate-500">Rua Vergueiro, 3505 - Vila Mariana</span>
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
              <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider">Faturamento Hoje</span>
              <h4 className="text-base font-black text-slate-100">R$ 4.894,70</h4>
              <span className="text-[9px] text-emerald-450 font-semibold">+ 12% em relação a ontem</span>
            </div>
            <div className="bg-[#0e1626]/40 border border-slate-850 p-4 rounded-xl space-y-1 shadow-sm">
              <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider">Orçamentos Abertos</span>
              <h4 className="text-base font-black text-slate-100">8 Ativos</h4>
              <span className="text-[9px] text-indigo-400 font-semibold">Conversão de 65%</span>
            </div>
            <div className="bg-[#0e1626]/40 border border-slate-850 p-4 rounded-xl space-y-1 shadow-sm">
              <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider">Ticket Médio</span>
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
                <div className="bg-indigo-600/30 hover:bg-indigo-650/50 border border-indigo-505/40 w-full h-40 rounded-t-md transition-all duration-300 relative group">
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
                  <span className="text-[9px] font-bold text-slate-505 uppercase">Entradas</span>
                  <p className="text-sm font-bold text-emerald-450">R$ 850,00</p>
                </div>
                <div className="p-3 bg-[#070a13] border border-slate-850 rounded-lg">
                  <span className="text-[9px] font-bold text-slate-505 uppercase">Saídas (Sangria)</span>
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
              <Button className="bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-350 text-slate-355 text-xs font-semibold py-2 px-4 h-auto rounded-lg cursor-pointer">
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
                  <label className="text-[9px] font-bold text-slate-505 uppercase tracking-wider">Código Interno</label>
                  <input type="text" className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none" placeholder="EX: AP-1092" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[9px] font-bold text-slate-505 uppercase tracking-wider">Descrição do Produto</label>
                  <input type="text" className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none" placeholder="EX: Jogo Pastilha de Freio Dianteira" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-505 uppercase tracking-wider">Marca</label>
                  <input type="text" className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none" placeholder="EX: Cobreq" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-505 uppercase tracking-wider">Categoria</label>
                  <select className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-400 focus:outline-none">
                    <option>Freios</option>
                    <option>Motor</option>
                    <option>Suspensão</option>
                    <option>Elétrica</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-505 uppercase tracking-wider">Preço Custo</label>
                  <input type="text" className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-305 focus:outline-none" placeholder="R$ 0,00" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-505 uppercase tracking-wider">Preço Venda</label>
                  <input type="text" className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-305 focus:outline-none" placeholder="R$ 0,00" />
                </div>
              </div>

              <Button type="button" className="bg-indigo-655 hover:bg-indigo-555 text-white font-bold py-2 px-4 h-auto rounded-lg cursor-pointer uppercase tracking-wider">
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

  // Define screens for the Warranty Module (Garantia)
  const garantiaTabs = [
    {
      id: "pendentes",
      label: "Pendentes",
      icon: Clock,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Action Row */}
          <div className="flex justify-between items-center shrink-0">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar garantia pendente..."
                className="w-full pl-9 pr-4 py-1.5 bg-[#0e1626]/40 border border-slate-800 rounded-lg text-xs text-slate-355 focus:outline-none"
              />
            </div>
            <Button className="bg-indigo-650 hover:bg-indigo-555 text-white text-xs font-semibold py-1.5 px-3 h-auto rounded-lg flex items-center gap-1.5 cursor-pointer">
              <Plus className="h-3.5 w-3.5" /> Abrir Chamado
            </Button>
          </div>

          {/* Pending Warranties Table */}
          <div className="flex-1 border border-slate-855 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                    <th className="p-3">Cód. Chamado</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Peça / Produto</th>
                    <th className="p-3">Data Abertura</th>
                    <th className="p-3 text-center">Prazo Decorrido</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">#GAR-4512</td>
                    <td className="p-3 font-semibold text-slate-200">Oficina Multimarcas Silva</td>
                    <td className="p-3">Amortecedor Dianteiro Cofap (Cofap)</td>
                    <td className="p-3">07/06/2026</td>
                    <td className="p-3 text-center font-semibold text-slate-400">2 dias</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#16223f] text-slate-400 border border-slate-800 uppercase tracking-wider">Aguardando Envio</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">#GAR-4511</td>
                    <td className="p-3 font-semibold text-slate-200">Ricardo Rodrigues Mendes</td>
                    <td className="p-3">Bomba de Combustível Bosch (Bosch)</td>
                    <td className="p-3">06/06/2026</td>
                    <td className="p-3 text-center font-semibold text-slate-400">3 dias</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">Em Laudo Local</span>
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
      id: "enviadas",
      label: "Enviadas",
      icon: Send,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Action Bar */}
          <div className="flex justify-between items-center shrink-0">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Garantias Enviadas para os Fabricantes
            </h4>
          </div>

          {/* Shipped Warranties Table */}
          <div className="flex-1 border border-slate-855 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                    <th className="p-3">Cód. Chamado</th>
                    <th className="p-3">Fabricante</th>
                    <th className="p-3">Data Envio</th>
                    <th className="p-3">Código Rastreio</th>
                    <th className="p-3 text-center">NF de Remessa</th>
                    <th className="p-3 text-center">Sefaz Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">#GAR-4509</td>
                    <td className="p-3 font-semibold text-slate-200">Cofap Suspensões</td>
                    <td className="p-3">01/06/2026</td>
                    <td className="p-3 font-mono text-slate-500">QD908239023BR</td>
                    <td className="p-3 text-center font-mono">00019283</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">Em Análise</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">#GAR-4508</td>
                    <td className="p-3 font-semibold text-slate-200">Bosch Brasil Ltda</td>
                    <td className="p-3">30/05/2026</td>
                    <td className="p-3 font-mono text-slate-500">QD908123992BR</td>
                    <td className="p-3 text-center font-mono">00019278</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">Em Análise</span>
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
      id: "retorno",
      label: "Retorno",
      icon: CornerDownLeft,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex justify-between items-center shrink-0">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Laudos de Retorno e Decisões dos Fabricantes
            </h4>
          </div>

          {/* Return Warranties Table */}
          <div className="flex-1 border border-slate-855 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                    <th className="p-3">Cód. Chamado</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Fabricante</th>
                    <th className="p-3">Data Parecer</th>
                    <th className="p-3 text-center">Decisão Laudo</th>
                    <th className="p-3 text-center">Resolução / Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">#GAR-4505</td>
                    <td className="p-3 font-semibold text-slate-200">Mecânica do Gordo</td>
                    <td className="p-3">Cofap Suspensões</td>
                    <td className="p-3">09/06/2026</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">Procedente</span>
                    </td>
                    <td className="p-3 text-center">
                      <Button className="bg-indigo-650 hover:bg-indigo-555 text-white text-[10px] py-1 px-2.5 h-auto rounded cursor-pointer font-bold uppercase tracking-wider">
                        Gerar Crédito Cliente
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">#GAR-4504</td>
                    <td className="p-3 font-semibold text-slate-200">Fernanda Mendes Souza</td>
                    <td className="p-3">Magneti Marelli</td>
                    <td className="p-3">08/06/2026</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">Improcedente</span>
                    </td>
                    <td className="p-3 text-center">
                      <Button className="bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-300 text-[10px] py-1 px-2.5 h-auto rounded cursor-pointer font-bold uppercase tracking-wider">
                        Baixar Laudo (Negativa)
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
      id: "arquivo",
      label: "Arquivo",
      icon: Archive,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex justify-between items-center shrink-0">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Histórico de Garantias Encerradas (Arquivo)
            </h4>
          </div>

          {/* Archive Table */}
          <div className="flex-1 border border-slate-855 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                    <th className="p-3">Cód. Chamado</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Fabricante</th>
                    <th className="p-3">Data Arquivo</th>
                    <th className="p-3 text-center">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">#GAR-4498</td>
                    <td className="p-3 font-semibold text-slate-200">Mecânica do Gordo</td>
                    <td className="p-3">Cofap Suspensões</td>
                    <td className="p-3">28/05/2026</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">Peça Trocada</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">#GAR-4495</td>
                    <td className="p-3 font-semibold text-slate-200">Claudio Roberto Silva</td>
                    <td className="p-3">Bosch Brasil</td>
                    <td className="p-3">22/05/2026</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#16223f] text-slate-400 border border-slate-800 uppercase tracking-wider">Laudo Emitido (Negado)</span>
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

  // Define screens for the Deliveries Module (Entregas)
  const entregasTabs = [
    {
      id: "baias",
      label: "Baias",
      icon: Layers,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Action Row */}
          <div className="flex justify-between items-center shrink-0">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Baias de Separação e Carregamento (Logística)
            </h4>
          </div>

          {/* Bays Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            <div className="bg-[#0e1626]/30 border border-slate-850 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="font-bold text-xs text-slate-200">Baia 01 - ZONA SUL</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-450 border border-amber-500/20 uppercase tracking-wider">Aguardando</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-400">
                <p>Pedidos agrupados: <strong className="text-slate-250">5 volumes</strong></p>
                <p>Peso total: <strong className="text-slate-250">14.5 kg</strong></p>
                <p>Rota estimada: <strong className="text-slate-255">Sto. Amaro / Campo Belo</strong></p>
              </div>
              <Button className="w-full bg-indigo-650 hover:bg-indigo-555 text-white text-[10px] py-1.5 h-auto rounded-lg cursor-pointer">
                Liberar para Carregamento
              </Button>
            </div>

            <div className="bg-[#0e1626]/30 border border-slate-855 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="font-bold text-xs text-slate-200">Baia 02 - ZONA OESTE</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 uppercase tracking-wider">Carregado</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-400">
                <p>Pedidos agrupados: <strong className="text-slate-250">3 volumes</strong></p>
                <p>Peso total: <strong className="text-slate-250">8.2 kg</strong></p>
                <p>Rota estimada: <strong className="text-slate-255">Pinheiros / Lapa</strong></p>
              </div>
              <Button className="w-full bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-300 text-[10px] py-1.5 h-auto rounded-lg cursor-pointer">
                Despachar Portador
              </Button>
            </div>

            <div className="bg-[#0e1626]/30 border border-slate-855 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="font-bold text-xs text-slate-200">Baia 03 - ZONA NORTE</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider">Vazia</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-500">
                <p>Nenhum pedido vinculado a esta baia de carregamento.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "enviando",
      label: "Enviando",
      icon: Navigation,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex justify-between items-center shrink-0">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ordens de Entrega em Trânsito (Rota Ativa)
            </h4>
          </div>

          {/* Shipped Deliveries List */}
          <div className="flex-grow border border-slate-855 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                    <th className="p-3 pl-4">Código PV</th>
                    <th className="p-3">Cliente Destinatário</th>
                    <th className="p-3">Entregador / Portador</th>
                    <th className="p-3">Horário Saída</th>
                    <th className="p-3 text-center">Status de Trânsito</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">#PV-9821</td>
                    <td className="p-3 font-semibold text-slate-200">Marcos Rogério Silva</td>
                    <td className="p-3">Carlos Motoboy (Honda CG)</td>
                    <td className="p-3">09/06/2026 00:58</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-450 border border-amber-500/20 uppercase tracking-wider">Em Rota de Entrega</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">#PV-9815</td>
                    <td className="p-3 font-semibold text-slate-200">Auto Oficina Martins</td>
                    <td className="p-3">Jonas Fiorino (VUC)</td>
                    <td className="p-3">09/06/2026 00:30</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">A Caminho (Entrega 2/4)</span>
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
      id: "mapa",
      label: "Mapa",
      icon: MapPin,
      component: (
        <div className="flex-grow flex flex-col md:flex-row gap-4 h-full min-h-0 bg-[#070a13]">
          {/* Active Routes list */}
          <div className="w-full md:w-64 border border-slate-855 bg-[#0e1626]/20 rounded-xl p-4 flex flex-col shrink-0 min-h-0 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850 pb-2">
              Portadores Ativos
            </h4>
            <div className="space-y-2.5 text-xs flex-grow overflow-y-auto">
              <div className="p-2.5 bg-[#070a13]/80 border border-indigo-500/25 rounded-lg flex flex-col space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200">Carlos Motoboy</span>
                  <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/10">MOTO-01</span>
                </div>
                <span className="text-[10px] text-slate-500">Local: Av. Jabaquara, 450</span>
              </div>

              <div className="p-2.5 bg-[#0e1626]/10 border border-slate-850 rounded-lg flex flex-col space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-300">Jonas Fiorino</span>
                  <span className="text-[9px] text-slate-500 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">CARRO-02</span>
                </div>
                <span className="text-[10px] text-slate-500">Local: Rua Vergueiro, 2200</span>
              </div>
            </div>
          </div>

          {/* Styled Graphic Route Map representation */}
          <div className="flex-grow border border-slate-850 bg-[#0e1626]/10 rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-0">
            {/* Visual map mesh background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />

            {/* Stylized vector map routes */}
            <svg className="w-full max-w-lg h-48 text-slate-800 stroke-indigo-500/15 stroke-[1.5] fill-none shrink-0" viewBox="0 0 400 200">
              {/* Route lines */}
              <path d="M 50,50 Q 150,20 200,80 T 350,150" />
              <path d="M 50,150 Q 180,180 200,80 T 320,30" className="stroke-indigo-500/10" />
              
              {/* Map pin nodes */}
              <circle cx="50" cy="50" r="4" className="fill-indigo-600 stroke-indigo-500 stroke-2 animate-pulse" />
              <circle cx="200" cy="80" r="5" className="fill-indigo-400 stroke-indigo-400 stroke-2" />
              <circle cx="350" cy="150" r="4" className="fill-violet-600 stroke-violet-500 stroke-2" />

              {/* Courier active marker */}
              <g className="translate-x-[120px] translate-y-[38px] animate-pulse">
                <circle cx="0" cy="0" r="6" className="fill-indigo-500 stroke-white stroke-2" />
                <path d="M-3,-10 L3,-10 L0,-4 Z" className="fill-indigo-500" />
              </g>
            </svg>

            <span className="text-xs font-bold text-slate-300 z-10 mt-4 flex items-center gap-1.5 bg-[#0e1626] border border-slate-850 px-3 py-1.5 rounded-full shadow-md">
              <Map className="h-3.5 w-3.5 text-indigo-400" /> Rastreamento de Rotas Ativo (Mock)
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "frota",
      label: "Frota",
      icon: Truck,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex justify-between items-center shrink-0">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Frota de Veículos e Portadores Cadastrados
            </h4>
          </div>

          {/* Vehicles Grid list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 shrink-0">
            <div className="bg-[#0e1626]/40 border border-slate-850 p-4 rounded-xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-slate-200">Honda CG 160 Fan</span>
                    <span className="text-[10px] text-slate-500 font-mono">Placa: QWY-9283</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">Em Rota</span>
                </div>
                <div className="text-[10px] text-slate-400 space-y-0.5">
                  <p>Condutor: <strong className="text-slate-255">Carlos Motoboy</strong></p>
                  <p>Manutenção: <strong className="text-emerald-450">Ok (Revisado)</strong></p>
                </div>
              </div>
            </div>

            <div className="bg-[#0e1626]/40 border border-slate-855 p-4 rounded-xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-slate-200">Fiorino 1.4 Hard Working</span>
                    <span className="text-[10px] text-slate-500 font-mono">Placa: PXA-3021</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">Em Rota</span>
                </div>
                <div className="text-[10px] text-slate-400 space-y-0.5">
                  <p>Condutor: <strong className="text-slate-255">Jonas Fiorino</strong></p>
                  <p>Manutenção: <strong className="text-emerald-450">Ok (Revisado)</strong></p>
                </div>
              </div>
            </div>

            <div className="bg-[#0e1626]/40 border border-slate-855 p-4 rounded-xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-slate-200">Yamaha Factor 150</span>
                    <span className="text-[10px] text-slate-500 font-mono">Placa: RKI-4009</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider">Disponível</span>
                </div>
                <div className="text-[10px] text-slate-400 space-y-0.5">
                  <p>Condutor: <strong className="text-slate-500">Nenhum Vinculado</strong></p>
                  <p>Manutenção: <strong className="text-amber-450">Troca de óleo pendente</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Define screens for the Finance Module (Finanças)
  const financasTabs = [
    {
      id: "receber",
      label: "Contas a Receber",
      icon: TrendingUp,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Action and Summary Row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center shrink-0">
            <div className="flex gap-4 items-center">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Pesquisar contas a receber..."
                  className="w-full pl-9 pr-4 py-1.5 bg-[#0e1626]/40 border border-slate-800 rounded-lg text-xs text-slate-350 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-1 bg-[#0e1626]/40 p-1 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded cursor-pointer bg-slate-800">Todos</span>
                <span className="text-[10px] text-slate-500 hover:text-slate-300 px-2 py-0.5 rounded cursor-pointer">Pendentes</span>
                <span className="text-[10px] text-slate-500 hover:text-slate-300 px-2 py-0.5 rounded cursor-pointer">Vencidos</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between bg-[#0e1626]/30 border border-slate-850 px-3 py-1.5 rounded-xl text-[10px] font-semibold text-slate-400">
              <span className="flex items-center gap-1"><Coins className="h-3.5 w-3.5 text-indigo-400" /> Total a Receber: <strong className="text-slate-200">R$ 42.150,00</strong></span>
              <span className="h-3 w-[1px] bg-slate-800" />
              <span className="flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5 text-red-400" /> Vencidos: <strong className="text-red-400">R$ 5.400,00</strong></span>
            </div>
          </div>

          {/* Receivables Table */}
          <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                    <th className="p-3 pl-4">Fatura</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Vencimento</th>
                    <th className="p-3 text-right">Valor</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">#REC-1092</td>
                    <td className="p-3 font-semibold text-slate-200">Oficina Central de Freios Ltda</td>
                    <td className="p-3">15/06/2026</td>
                    <td className="p-3 text-right font-bold">R$ 1.840,00</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-450 border border-amber-500/20 uppercase tracking-wider">Pendente</span>
                    </td>
                    <td className="p-3 text-center">
                      <Button className="bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/20 text-emerald-450 text-[10px] py-1 px-2.5 h-auto rounded cursor-pointer font-bold uppercase tracking-wider flex items-center gap-1.5 mx-auto animate-pulse">
                        <MessageCircle className="h-3 w-3" /> Cobrar WhatsApp
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">#REC-1090</td>
                    <td className="p-3 font-semibold text-slate-200">Distribuidora de Peças Rápido</td>
                    <td className="p-3">05/06/2026</td>
                    <td className="p-3 text-right font-bold">R$ 5.400,00</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider animate-pulse">Vencido</span>
                    </td>
                    <td className="p-3 text-center">
                      <Button className="bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/20 text-emerald-450 text-[10px] py-1 px-2.5 h-auto rounded cursor-pointer font-bold uppercase tracking-wider flex items-center gap-1.5 mx-auto">
                        <MessageCircle className="h-3 w-3" /> Notificar WhatsApp
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">#REC-1088</td>
                    <td className="p-3 font-semibold text-slate-200">Juliano Souza Auto Mecânica</td>
                    <td className="p-3">01/06/2026</td>
                    <td className="p-3 text-right font-bold text-slate-400">R$ 890,00</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 uppercase tracking-wider">Pago</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-[10px] text-slate-500 font-semibold font-mono">Recebido Itaú</span>
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
      id: "pagar",
      label: "Contas a Pagar",
      icon: TrendingDown,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Action and Summary Row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center shrink-0">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Pesquisar contas a pagar..."
                className="w-full pl-9 pr-4 py-1.5 bg-[#0e1626]/40 border border-slate-800 rounded-lg text-xs text-slate-350 focus:outline-none"
              />
            </div>
            
            <div className="flex gap-2">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-1.5 px-3 h-auto rounded-lg flex items-center gap-1.5 cursor-pointer">
                <Plus className="h-3.5 w-3.5" /> Adicionar Despesa
              </Button>
            </div>
          </div>

          {/* Payables Table */}
          <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                    <th className="p-3 pl-4">Cód. Despesa</th>
                    <th className="p-3">Fornecedor / Descrição</th>
                    <th className="p-3">Categoria</th>
                    <th className="p-3">Vencimento</th>
                    <th className="p-3 text-right">Valor</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">#PAG-0891</td>
                    <td className="p-3 font-semibold text-slate-200">Cofap Componentes Distribuidora</td>
                    <td className="p-3">Fornecedor (Peças)</td>
                    <td className="p-3">12/06/2026</td>
                    <td className="p-3 text-right font-bold text-amber-450">R$ 12.450,00</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-450 border border-amber-500/20 uppercase tracking-wider">Pendente</span>
                    </td>
                    <td className="p-3 text-center">
                      <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] py-1 px-2.5 h-auto rounded cursor-pointer font-bold uppercase tracking-wider">
                        Dar Baixa
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">#PAG-0890</td>
                    <td className="p-3 font-semibold text-slate-200">Prefeitura de SP - IPTU Parcela 05</td>
                    <td className="p-3">Impostos / IPTU</td>
                    <td className="p-3">10/06/2026</td>
                    <td className="p-3 text-right font-bold">R$ 780,00</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-450 border border-amber-500/20 uppercase tracking-wider">Pendente</span>
                    </td>
                    <td className="p-3 text-center">
                      <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] py-1 px-2.5 h-auto rounded cursor-pointer font-bold uppercase tracking-wider">
                        Dar Baixa
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">#PAG-0888</td>
                    <td className="p-3 font-semibold text-slate-200">Enel Distribuidora S/A</td>
                    <td className="p-3">Despesa Fixa / Energia</td>
                    <td className="p-3">02/06/2026</td>
                    <td className="p-3 text-right font-bold text-slate-400">R$ 1.150,00</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 uppercase tracking-wider">Pago</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-[10px] text-slate-500 font-semibold font-mono">Pago Bradesco</span>
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
      id: "fluxo",
      label: "Fluxo de Caixa",
      icon: Activity,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Cash flow Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
            <div className="bg-[#0e1626]/30 border border-slate-850 p-3.5 rounded-xl flex flex-col space-y-1">
              <span className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Banco Itaú</span>
              <span className="text-sm font-extrabold text-slate-100">R$ 45.230,00</span>
              <span className="text-[9px] text-emerald-450 font-semibold flex items-center gap-0.5">Conciliação Ok</span>
            </div>
            <div className="bg-[#0e1626]/30 border border-slate-855 p-3.5 rounded-xl flex flex-col space-y-1">
              <span className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Banco Bradesco</span>
              <span className="text-sm font-extrabold text-slate-100">R$ 12.890,00</span>
              <span className="text-[9px] text-slate-500 font-semibold">Sem pendências</span>
            </div>
            <div className="bg-[#0e1626]/30 border border-slate-855 p-3.5 rounded-xl flex flex-col space-y-1">
              <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Caixa Interno (Balcão)</span>
              <span className="text-sm font-extrabold text-slate-100">R$ 3.450,00</span>
              <span className="text-[9px] text-indigo-400 font-semibold">Turno 01 Aberto</span>
            </div>
            <div className="bg-indigo-900/10 border border-indigo-500/20 p-3.5 rounded-xl flex flex-col space-y-1 shadow-inner shadow-indigo-500/5">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Total Disponível</span>
              <span className="text-sm font-black text-indigo-300">R$ 61.570,00</span>
              <span className="text-[9px] text-indigo-400 font-semibold">Soma de Caixas e Bancos</span>
            </div>
          </div>

          {/* Daily operations log */}
          <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="p-3 border-b border-slate-850/60 bg-[#0e1626]/40 flex justify-between items-center shrink-0">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Últimos Lançamentos Diários</h5>
              <span className="text-[9px] font-mono text-slate-500">09/06/2026</span>
            </div>
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/40 text-slate-455 font-semibold">
                    <th className="p-2.5 pl-4">Hora</th>
                    <th className="p-2.5">Descrição</th>
                    <th className="p-2.5">Categoria</th>
                    <th className="p-2.5">Origem/Destino</th>
                    <th className="p-2.5 text-right pr-4">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-2.5 pl-4 font-mono text-slate-550">01:10</td>
                    <td className="p-2.5 font-semibold text-slate-200">Recebimento Venda #00981</td>
                    <td className="p-2.5 text-slate-400">Venda Balcão</td>
                    <td className="p-2.5 font-mono text-indigo-400">Caixa Interno</td>
                    <td className="p-2.5 text-right pr-4 font-bold text-emerald-450">+ R$ 379,80</td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-2.5 pl-4 font-mono text-slate-550">00:55</td>
                    <td className="p-2.5 font-semibold text-slate-200">Pagamento Frete Logística</td>
                    <td className="p-2.5 text-slate-400">Despesa Entrega</td>
                    <td className="p-2.5 font-mono text-slate-500">Caixa Interno</td>
                    <td className="p-2.5 text-right pr-4 font-bold text-rose-450">- R$ 50,00</td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-2.5 pl-4 font-mono text-slate-550">00:15</td>
                    <td className="p-2.5 font-semibold text-slate-200">Recebimento Fatura #REC-1088</td>
                    <td className="p-2.5 text-slate-400">Fatura Cliente</td>
                    <td className="p-2.5 font-mono text-indigo-400">Banco Itaú</td>
                    <td className="p-2.5 text-right pr-4 font-bold text-emerald-450">+ R$ 890,00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "dre",
      label: "DRE Simplificado",
      icon: FileText,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          <div className="flex justify-between items-center shrink-0">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Demonstrativo do Resultado do Exercício (DRE) - Competência Atual
            </h4>
            <div className="text-[10px] text-slate-455 bg-[#16223f]/40 px-2.5 py-1 rounded border border-slate-800 font-bold">
              Junho / 2026
            </div>
          </div>

          {/* DRE Structure */}
          <div className="border border-slate-850 rounded-xl bg-[#0e1626]/20 p-4 space-y-1.5 font-mono text-xs text-slate-300">
            <div className="flex justify-between items-center py-1 border-b border-slate-850/30">
              <span className="font-bold text-slate-200">(+) Receita Bruta de Vendas</span>
              <span className="text-slate-100 font-bold">R$ 145.200,00</span>
            </div>
            <div className="flex justify-between items-center py-1 text-rose-455">
              <span>(-) Devoluções de Venda & Abatimentos</span>
              <span>- R$ 2.400,00</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-850 font-bold text-slate-200 bg-[#0e1626]/60 px-2 rounded">
              <span>(=) Receita Líquida</span>
              <span className="text-indigo-400">R$ 142.800,00</span>
            </div>
            <div className="flex justify-between items-center py-1 text-rose-455">
              <span>(-) Custo da Mercadoria Vendida (CMV)</span>
              <span>- R$ 78.500,00</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-850 font-bold text-slate-200 bg-[#0e1626]/60 px-2 rounded">
              <span>(=) Resultado Bruto (Lucro Bruto)</span>
              <span className="text-indigo-400">R$ 64.300,00</span>
            </div>
            
            {/* Expenses Breakdown */}
            <div className="pl-4 space-y-1 text-slate-500 text-[11px] py-1">
              <div className="flex justify-between">
                <span>(-) Salários e Encargos da Equipe</span>
                <span>- R$ 12.000,00</span>
              </div>
              <div className="flex justify-between">
                <span>(-) Aluguel, IPTU e Luz da Loja</span>
                <span>- R$ 5.500,00</span>
              </div>
              <div className="flex justify-between">
                <span>(-) Investimentos em Marketing & Vendas</span>
                <span>- R$ 4.600,00</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-850 font-bold text-slate-200 bg-[#0e1626]/60 px-2 rounded">
              <span>(=) LAJIDA (EBITDA)</span>
              <span className="text-indigo-400">R$ 42.200,00</span>
            </div>
            <div className="flex justify-between items-center py-1 text-rose-455">
              <span>(-) Depreciação / Juros de Operação</span>
              <span>- R$ 3.200,00</span>
            </div>
            <div className="flex justify-between items-center py-2 font-black text-sm bg-emerald-500/5 border border-emerald-500/10 text-emerald-450 px-2.5 rounded shadow-sm shadow-emerald-500/2">
              <span>(=) LUCRO LÍQUIDO DO PERÍODO</span>
              <span>R$ 39.000,00</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Define screens for the Billing Module (Faturamento)
  const faturamentoTabs = [
    {
      id: "fiscal",
      label: "Painel Fiscal",
      icon: Receipt,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Action Row with Status */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center shrink-0">
            <div className="flex gap-4 items-center">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Pesquisar nota fiscal..."
                  className="w-full pl-9 pr-4 py-1.5 bg-[#0e1626]/40 border border-slate-800 rounded-lg text-xs text-slate-350 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-[#0e1626]/30 border border-slate-850 px-3 py-1.5 rounded-xl text-[10px] font-semibold text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Sefaz Autorizadora (SEFAZ-SP): <strong className="text-emerald-450 uppercase">Online</strong></span>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                    <th className="p-3 pl-4">Nota / Chave</th>
                    <th className="p-3">Tipo</th>
                    <th className="p-3">Destinatário</th>
                    <th className="p-3 text-right">Valor</th>
                    <th className="p-3 text-center">Status Sefaz</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">#NFT-5812</td>
                    <td className="p-3">NF-e (Venda)</td>
                    <td className="p-3 font-semibold text-slate-200">Auto Mecânica Silva & Filho</td>
                    <td className="p-3 text-right font-bold">R$ 1.840,00</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-455 border border-emerald-500/20 uppercase tracking-wider">Autorizada</span>
                    </td>
                    <td className="p-3 text-center flex justify-center gap-1.5">
                      <Button className="bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-305 text-[9px] py-1 px-2 h-auto rounded cursor-pointer font-bold uppercase tracking-wider">
                        XML
                      </Button>
                      <Button className="bg-indigo-650 hover:bg-indigo-555 text-white text-[9px] py-1 px-2 h-auto rounded cursor-pointer font-bold uppercase tracking-wider">
                        DANFE
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">#NFT-5811</td>
                    <td className="p-3">NFC-e (Consumidor)</td>
                    <td className="p-3 font-semibold text-slate-200">Venda Consumidor Balcão</td>
                    <td className="p-3 text-right font-bold">R$ 189,90</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-455 border border-emerald-500/20 uppercase tracking-wider">Autorizada</span>
                    </td>
                    <td className="p-3 text-center flex justify-center gap-1.5">
                      <Button className="bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-305 text-[9px] py-1 px-2 h-auto rounded cursor-pointer font-bold uppercase tracking-wider">
                        XML
                      </Button>
                      <Button className="bg-indigo-650 hover:bg-indigo-555 text-white text-[9px] py-1 px-2 h-auto rounded cursor-pointer font-bold uppercase tracking-wider">
                        DANFE
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">#NFT-5810</td>
                    <td className="p-3">NF-e (Remessa)</td>
                    <td className="p-3 font-semibold text-slate-200">Distribuidora Confiança Ltda</td>
                    <td className="p-3 text-right font-bold">R$ 5.400,00</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider animate-pulse">Rejeitada</span>
                    </td>
                    <td className="p-3 text-center flex justify-center gap-1.5">
                      <Button className="bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-305 text-[9px] py-1 px-2 h-auto rounded cursor-pointer font-bold uppercase tracking-wider">
                        Ver Erro
                      </Button>
                      <Button className="bg-amber-600 hover:bg-amber-500 text-white text-[9px] py-1 px-2 h-auto rounded cursor-pointer font-bold uppercase tracking-wider">
                        Corrigir
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
      id: "regras",
      label: "Regras Tributárias",
      icon: Sliders,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Action Row */}
          <div className="flex justify-between items-center shrink-0">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Regras Fiscais & Alíquotas de Autopeças (Substituição Tributária)
            </h4>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-1.5 px-3 h-auto rounded-lg flex items-center gap-1.5 cursor-pointer">
              <Plus className="h-3.5 w-3.5" /> Adicionar Regra por NCM
            </Button>
          </div>

          {/* Tax Matrix Table */}
          <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                    <th className="p-3 pl-4">NCM</th>
                    <th className="p-3">Descrição da Categoria</th>
                    <th className="p-3 text-center">ICMS Interno</th>
                    <th className="p-3 text-center">ICMS ST</th>
                    <th className="p-3 text-center">MVA Ajustado</th>
                    <th className="p-3 text-center">PIS/COFINS</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">8708.29.99</td>
                    <td className="p-3 font-semibold text-slate-200">Pastilhas de freio e componentes</td>
                    <td className="p-3 text-center font-mono">18.00%</td>
                    <td className="p-3 text-center">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">Sim</span>
                    </td>
                    <td className="p-3 text-center font-mono">45.28%</td>
                    <td className="p-3 text-center">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#16223f] text-slate-400 border border-slate-800 uppercase">Monofásico</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-slate-500 hover:text-slate-200 cursor-pointer font-bold">Editar</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">2710.19.32</td>
                    <td className="p-3 font-semibold text-slate-200">Óleos lubrificantes de motor</td>
                    <td className="p-3 text-center font-mono">18.00%</td>
                    <td className="p-3 text-center">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">Sim</span>
                    </td>
                    <td className="p-3 text-center font-mono">38.90%</td>
                    <td className="p-3 text-center">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#16223f] text-slate-400 border border-slate-800 uppercase">Monofásico</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-slate-500 hover:text-slate-200 cursor-pointer font-bold">Editar</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">8708.80.00</td>
                    <td className="p-3 font-semibold text-slate-200">Amortecedores de suspensão</td>
                    <td className="p-3 text-center font-mono">18.00%</td>
                    <td className="p-3 text-center">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#16223f] text-slate-500 border border-slate-800 uppercase">Não</span>
                    </td>
                    <td className="p-3 text-center font-mono">-</td>
                    <td className="p-3 text-center">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">Normal</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-slate-500 hover:text-slate-200 cursor-pointer font-bold">Editar</span>
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
      id: "correcoes",
      label: "CC-e & Cancelamento",
      icon: CornerDownLeft,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Action Row */}
          <div className="flex justify-between items-center shrink-0">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Histórico de Retificações e Cancelamento de Notas
            </h4>
            <div className="flex gap-2">
              <Button className="bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-305 text-xs font-semibold py-1.5 px-3 h-auto rounded-lg cursor-pointer">
                Carta de Correção (CC-e)
              </Button>
              <Button className="bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/20 text-rose-400 text-xs font-semibold py-1.5 px-3 h-auto rounded-lg cursor-pointer">
                Solicitar Cancelamento NF-e
              </Button>
            </div>
          </div>

          {/* Modifications log */}
          <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                    <th className="p-3 pl-4">Nota</th>
                    <th className="p-3">Operação</th>
                    <th className="p-3">Detalhamento / Correção</th>
                    <th className="p-3">Data Evento</th>
                    <th className="p-3 text-center">Status Protocolo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">#NFT-5801</td>
                    <td className="p-3 font-semibold">CC-e (Carta de Correção)</td>
                    <td className="p-3 text-slate-400">Corrigido Placa do Transportador de PXA-3021 para PXA-3022</td>
                    <td className="p-3">08/06/2026 15:45</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-455 border border-emerald-500/20 uppercase tracking-wider">Homologado Sefaz</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#16223f]/10">
                    <td className="p-3 pl-4 font-mono text-indigo-400">#NFT-5799</td>
                    <td className="p-3 font-semibold text-rose-455">Cancelamento de Nota</td>
                    <td className="p-3 text-slate-400">Cancelamento total por desistência da compra e devolução da mercadoria</td>
                    <td className="p-3">06/06/2026 10:12</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-455 border border-rose-500/20 uppercase tracking-wider">Cancelado Sefaz</span>
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
      id: "relatorios",
      label: "Faturamento Consol.",
      icon: Scale,
      component: (
        <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
          {/* Billing Reports Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
            <div className="bg-[#0e1626]/30 border border-slate-850 p-3.5 rounded-xl flex flex-col space-y-1">
              <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Total NF-e</span>
              <span className="text-sm font-extrabold text-slate-100">R$ 98.400,00</span>
              <span className="text-[9px] text-indigo-400 font-semibold">Emitido em 24 notas</span>
            </div>
            <div className="bg-[#0e1626]/30 border border-slate-855 p-3.5 rounded-xl flex flex-col space-y-1">
              <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Total NFC-e</span>
              <span className="text-sm font-extrabold text-slate-100">R$ 44.400,00</span>
              <span className="text-[9px] text-indigo-400 font-semibold">Emitido em 210 cupons</span>
            </div>
            <div className="bg-[#0e1626]/30 border border-slate-855 p-3.5 rounded-xl flex flex-col space-y-1">
              <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Impostos Totais Estimados</span>
              <span className="text-sm font-extrabold text-rose-400">R$ 25.704,00</span>
              <span className="text-[9px] text-slate-500 font-semibold">DAS/Tributos Simples Nac.</span>
            </div>
            <div className="bg-indigo-900/10 border border-indigo-500/20 p-3.5 rounded-xl flex flex-col space-y-1 shadow-inner shadow-indigo-500/5">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Total Faturamento</span>
              <span className="text-sm font-black text-indigo-300">R$ 142.800,00</span>
              <span className="text-[9px] text-indigo-400 font-semibold">Competência Junho/2026</span>
            </div>
          </div>

          {/* Simple Styled CSS Graph */}
          <div className="border border-slate-850 rounded-xl bg-[#0e1626]/20 p-4 space-y-4 shrink-0">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Faturamento Diário dos Últimos 5 Dias</h5>
            <div className="h-32 flex items-end justify-between gap-4 pt-4 px-2 font-mono text-[9px] text-slate-500">
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-[#16223f]/50 border border-slate-800 rounded-t h-[40%] flex items-center justify-center font-bold text-indigo-400">R$ 18k</div>
                <span>05/06</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-[#16223f]/50 border border-slate-800 rounded-t h-[55%] flex items-center justify-center font-bold text-indigo-400">R$ 24k</div>
                <span>06/06</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-[#16223f]/50 border border-slate-800 rounded-t h-[20%] flex items-center justify-center font-bold text-indigo-400">R$ 8k</div>
                <span>07/06</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-indigo-550/80 border border-indigo-500/25 rounded-t h-[75%] flex items-center justify-center font-bold text-slate-100">R$ 32k</div>
                <span>08/06</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-indigo-650 rounded-t h-[90%] flex items-center justify-center font-bold text-slate-100 shadow-lg shadow-indigo-600/5">R$ 38k</div>
                <span>09/06</span>
              </div>
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
      ) : activeModule === "garantia" ? (
        <div className="flex-1 flex flex-col min-h-0 h-full">
          {/* Module Sub-tabs Container with integrated title */}
          <ModuleTabContainer
            key="garantia"
            tabs={garantiaTabs}
            defaultTabId="pendentes"
            title="Garantia"
            icon={ShieldCheck}
          />
        </div>
      ) : activeModule === "entregas" ? (
        <div className="flex-1 flex flex-col min-h-0 h-full">
          {/* Module Sub-tabs Container with integrated title */}
          <ModuleTabContainer
            key="entregas"
            tabs={entregasTabs}
            defaultTabId="baias"
            title="Entregas"
            icon={Truck}
          />
        </div>
      ) : activeModule === "financas" ? (
        <div className="flex-1 flex flex-col min-h-0 h-full">
          {/* Module Sub-tabs Container with integrated title */}
          <ModuleTabContainer
            key="financas"
            tabs={financasTabs}
            defaultTabId="receber"
            title="Financeiro"
            icon={DollarSign}
          />
        </div>
      ) : activeModule === "faturamento" ? (
        <div className="flex-1 flex flex-col min-h-0 h-full">
          {/* Module Sub-tabs Container with integrated title */}
          <ModuleTabContainer
            key="faturamento"
            tabs={faturamentoTabs}
            defaultTabId="fiscal"
            title="Faturamento & Fiscal"
            icon={Receipt}
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
                title="Vendas & Orçamentos"
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

              {/* Garantia Card (Active) */}
              <ModuleCard
                title="Controle de Garantias"
                description="Abertura de laudos de garantia, controle de remessa para fabricantes e retorno de peças."
                icon={ShieldCheck}
                onClick={() => setActiveModule("garantia")}
              />

              {/* Entregas Card (Active) */}
              <ModuleCard
                title="Logística & Entregas"
                description="Planejamento de rotas, controle de baias de carregamento, monitoramento e frota."
                icon={Truck}
                onClick={() => setActiveModule("entregas")}
              />

              {/* Financeiro Card (Active) */}
              <ModuleCard
                title="Fluxo Financeiro"
                description="Controle de fluxo de caixa diário, contas a pagar, recebimentos e boletos."
                icon={DollarSign}
                onClick={() => setActiveModule("financas")}
              />

              {/* Faturamento Card (Active) */}
              <ModuleCard
                title="Faturamento & Fiscal"
                description="Emissão de notas NF-e/NFC-e, monitoramento Sefaz, CC-e, regras tributárias e relatórios."
                icon={Receipt}
                onClick={() => setActiveModule("faturamento")}
              />

              {/* Gerencial Card (Placeholder / Coming Soon) */}
              <div className="opacity-40 cursor-not-allowed">
                <ModuleCard
                  title="Painel Gerencial"
                  description="Dashboard de BI, controle de permissões de usuários e logs de auditoria."
                  icon={BarChart3}
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
                  className="flex-1 px-3 py-1.5 bg-[#0e1626]/20 border border-slate-850 rounded-lg text-xs text-slate-350 focus:outline-none focus:border-indigo-500"
                  onChange={(e) => setName(e.currentTarget.value)}
                  placeholder="Nome para saudar..."
                  value={name}
                />
                <Button
                  type="submit"
                  disabled={loading || !name}
                  className="text-xs bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-205 py-1.5 px-3 h-auto cursor-pointer"
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
