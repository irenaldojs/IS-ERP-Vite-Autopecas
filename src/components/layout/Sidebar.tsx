import { ShoppingCart, Wallet, Box } from "lucide-react";

interface SidebarProps {
  activeModule?: string;
  onSelectModule?: (moduleId: string) => void;
}

export function Sidebar({ activeModule = "vendas", onSelectModule }: SidebarProps) {
  const modules = [
    {
      id: "vendas",
      label: "Vendas",
      icon: ShoppingCart,
      tooltip: "Módulo de Vendas",
    },
    {
      id: "caixa",
      label: "Caixa",
      icon: Wallet,
      tooltip: "Módulo de Caixa & PDV",
    },
    {
      id: "estoque",
      label: "Estoque",
      icon: Box,
      tooltip: "Módulo de Estoque",
    },
  ];

  return (
    <aside className="w-16 h-[calc(100vh-4rem)] border-r border-slate-800/80 bg-[#0e1626]/90 flex flex-col justify-between items-center py-4 sticky top-16 left-0 z-40 select-none">
      {/* Top Section: Navigation Icons */}
      <div className="w-full flex flex-col items-center gap-2">
        {modules.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <div key={item.id} className="relative group w-full flex justify-center">
              {/* Vertical Active Line Indicator (VS Code style) */}
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full transition-all duration-300 ${
                  isActive ? "bg-indigo-500 scale-100" : "bg-transparent scale-0 group-hover:scale-50 group-hover:bg-slate-700"
                }`}
              />

              {/* Icon Button */}
              <button
                onClick={() => onSelectModule?.(item.id)}
                className={`h-11 w-11 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none ${
                  isActive
                    ? "bg-[#16223f] text-white shadow-inner shadow-indigo-500/10"
                    : "text-slate-500 hover:text-slate-200 hover:bg-slate-850/40"
                }`}
                title={item.tooltip}
              >
                <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? "scale-105" : "group-hover:scale-105"}`} />
              </button>

              {/* Floating Tooltip (VS Code style) */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 rounded-lg shadow-xl opacity-0 scale-95 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-250 z-50 whitespace-nowrap">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section: Client indicators or versions */}
      <div className="text-[9px] font-mono text-slate-600 tracking-wider">
        ERP
      </div>
    </aside>
  );
}
