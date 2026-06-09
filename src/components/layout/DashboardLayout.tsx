import React from "react";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { Sparkles } from "lucide-react";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  activeModule?: string;
  onSelectModule?: (moduleId: string) => void;
  onHomeClick?: () => void;
}

export function DashboardLayout({
  children,
  activeModule = "vendas",
  onSelectModule,
  onHomeClick,
}: DashboardLayoutProps) {
  return (
    <div className="h-screen bg-[#070a13] text-slate-100 flex flex-col font-sans select-none antialiased overflow-hidden">
      {/* Top Header Row */}
      <div className="flex h-16 border-b border-slate-800/80 bg-[#0e1626]/90 backdrop-blur-md relative z-50">
        {/* Junction Box: Home / Logo Button */}
        <button
          onClick={onHomeClick}
          className="w-16 h-16 flex items-center justify-center border-r border-slate-800/80 hover:bg-[#16223f]/50 text-slate-400 hover:text-white transition-all duration-350 cursor-pointer active:scale-95 group focus:outline-none"
          title="Início"
        >
          <div className="h-9 w-9 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all duration-300">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
        </button>

        {/* Topbar Content */}
        <Topbar />
      </div>

      {/* Main Container Row */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar activeModule={activeModule} onSelectModule={onSelectModule} />

        {/* Content Area (Maximized, no outer scrollbar) */}
        <main className="flex-1 p-3 md:p-4 bg-[#070a13] flex flex-col overflow-hidden h-[calc(100vh-4rem)]">
          <div className="w-full max-w-[99%] mx-auto flex-1 flex flex-col min-h-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
