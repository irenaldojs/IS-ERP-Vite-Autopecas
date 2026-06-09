import React, { useState } from "react";
import { LucideIcon, Maximize2, Minimize2 } from "lucide-react";

export interface ModuleTab {
  id: string;
  label: string;
  icon: LucideIcon;
  component: React.ReactNode;
}

interface ModuleTabContainerProps {
  tabs: ModuleTab[];
  defaultTabId?: string;
  title?: string;
  icon?: LucideIcon;
  isMaximized?: boolean;
  onMaximizeToggle?: () => void;
}

export function ModuleTabContainer({
  tabs,
  defaultTabId,
  title,
  icon: Icon,
  isMaximized = false,
  onMaximizeToggle,
}: ModuleTabContainerProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || (tabs[0]?.id || ""));

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className="flex flex-col w-full h-full flex-1 min-h-0 space-y-3">
      {/* Header Row: Title/Controls on Left, Tabs/Restore on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/60 pb-2.5 gap-3 shrink-0">
        <div className="flex items-center gap-3">
          {title && (
            <div className="flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4 text-indigo-400" />}
              <h2 className="text-xs font-extrabold text-slate-200 tracking-wider uppercase">
                {title}
              </h2>
            </div>
          )}

          {/* Maximize Toggle Button next to the Title */}
          {onMaximizeToggle && (
            <button
              onClick={onMaximizeToggle}
              className={`p-1 rounded hover:bg-[#16223f]/50 border border-transparent hover:border-slate-800 text-slate-500 hover:text-slate-200 cursor-pointer transition-all duration-200 focus:outline-none`}
              title={isMaximized ? "Restaurar layout padrão" : "Modo de Foco (Tela Cheia)"}
            >
              {isMaximized ? (
                <Minimize2 className="h-3.5 w-3.5 text-indigo-400" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Right side: Tabs & Full-screen Exit Button */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Tab Buttons (smaller and compact) */}
          <div className="flex items-center bg-[#0e1626]/30 p-1 rounded-lg gap-1 border border-slate-850/40">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = tab.id === activeTabId;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer focus:outline-none ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "text-slate-450 hover:text-slate-200 hover:bg-[#16223f]/30"
                  }`}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* High-contrast Exit Fullscreen Button in upper-right corner */}
          {isMaximized && onMaximizeToggle && (
            <button
              onClick={onMaximizeToggle}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 hover:border-red-900/60 text-red-400 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 focus:outline-none"
              title="Voltar ao sistema com barras de navegação"
            >
              <Minimize2 className="h-3 w-3" />
              <span>Voltar ao Sistema</span>
            </button>
          )}
        </div>
      </div>

      {/* Screen Viewport (Stretched) */}
      <div className="flex-1 w-full min-h-0 flex flex-col focus:outline-none">
        {activeTab ? activeTab.component : (
          <div className="text-center text-xs text-slate-500 py-10">
            Nenhuma tela selecionada.
          </div>
        )}
      </div>
    </div>
  );
}
