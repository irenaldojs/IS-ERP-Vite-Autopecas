import { ShoppingCart, Wallet, Box, ShieldCheck, Truck, DollarSign, Receipt, BarChart3, Archive } from "lucide-react";

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
      id: "produto",
      label: "Produtos",
      icon: Box,
      tooltip: "Módulo de Produtos & Cadastros",
    },
    {
      id: "estoque",
      label: "Estoque",
      icon: Archive,
      tooltip: "Módulo de Estoque",
    },
    {
      id: "garantia",
      label: "Garantia",
      icon: ShieldCheck,
      tooltip: "Módulo de Garantia",
    },
    {
      id: "entregas",
      label: "Entregas",
      icon: Truck,
      tooltip: "Módulo de Entregas & Logística",
    },
    {
      id: "financas",
      label: "Finanças",
      icon: DollarSign,
      tooltip: "Módulo Financeiro",
    },
    {
      id: "faturamento",
      label: "Faturamento",
      icon: Receipt,
      tooltip: "Módulo de Faturamento & Fiscal",
    },
    {
      id: "gerencia",
      label: "Gerência",
      icon: BarChart3,
      tooltip: "Módulo Gerencial & BI",
    },
  ];

  return (
    <aside className="w-16 h-[calc(100vh-4rem)] border-r border-[var(--colorNeutralStroke1)] bg-[var(--colorNeutralBackground2)] flex flex-col justify-between items-center py-4 sticky top-16 left-0 z-40 select-none">
      {/* Top Section: Navigation Icons */}
      <div className="w-full flex flex-col items-center gap-2">
        {modules.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <div key={item.id} className="relative group w-full flex justify-center">
              {/* Vertical Active Line Indicator */}
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full transition-all duration-300 ${
                  isActive ? "bg-[var(--colorBrandStroke1)] scale-100" : "bg-transparent scale-0 group-hover:scale-50 group-hover:bg-[var(--colorNeutralStroke1)]"
                }`}
              />

              {/* Icon Button */}
              <button
                onClick={() => onSelectModule?.(item.id)}
                className={`h-11 w-11 rounded flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none ${
                  isActive
                    ? "bg-[var(--colorSubtleBackgroundSelected)] text-[var(--colorNeutralForeground1Selected)] font-semibold"
                    : "text-[var(--colorNeutralForeground2)] hover:text-[var(--colorNeutralForeground1)] hover:bg-[var(--colorSubtleBackgroundHover)]"
                }`}
                title={item.tooltip}
              >
                <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? "scale-105" : "group-hover:scale-105"}`} />
              </button>

              {/* Floating Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-[var(--colorNeutralBackground6)] border border-[var(--colorNeutralStroke1)] text-xs font-semibold text-[var(--colorNeutralForeground6)] rounded shadow-xl opacity-0 scale-95 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-250 z-50 whitespace-nowrap">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section: Client indicators or versions */}
      <div className="text-[9px] font-mono text-[var(--colorNeutralForeground3)] tracking-wider">
        ERP
      </div>
    </aside>
  );
}
