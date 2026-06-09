import React, { useState } from "react";
import { LucideIcon } from "lucide-react";

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
}

export function ModuleTabContainer({ tabs, defaultTabId, title, icon: Icon }: ModuleTabContainerProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || (tabs[0]?.id || ""));

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className="flex flex-col w-full h-full flex-1 min-h-0 space-y-3">
      {/* Header Row: Title on Left, Tabs on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/60 pb-2.5 gap-3 shrink-0">
        {title && (
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-indigo-400" />}
            <h2 className="text-xs font-extrabold text-slate-200 tracking-wider uppercase">
              {title}
            </h2>
          </div>
        )}

        {/* Tab Buttons (smaller and compact) */}
        <div className="flex items-center bg-[#0e1626]/30 p-1 rounded-lg gap-1 self-start sm:self-auto border border-slate-850/40">
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
