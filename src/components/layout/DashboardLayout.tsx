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
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Header Row */}
      <div className="flex h-16 border-b border-slate-800/80 bg-[#0e1626]/90 backdrop-blur-md sticky top-0 z-50">
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
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar activeModule={activeModule} onSelectModule={onSelectModule} />

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-4rem)] bg-[#070a13]">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
