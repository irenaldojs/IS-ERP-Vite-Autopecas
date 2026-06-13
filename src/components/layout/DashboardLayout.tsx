import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { Sparkles } from "lucide-react";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  activeModule?: string;
  onSelectModule?: (moduleId: string) => void;
  onHomeClick?: () => void;
  hideLayout?: boolean;
}

export function DashboardLayout({
  children,
  activeModule = "vendas",
  onSelectModule,
  onHomeClick,
  hideLayout = false,
}: DashboardLayoutProps) {
  // Focus Mode / Standalone Maximized workstation view
  if (hideLayout) {
    return (
      <div className="h-screen w-screen bg-[var(--colorNeutralBackground1)] text-[var(--colorNeutralForeground1)] flex flex-col font-sans select-none antialiased overflow-hidden p-3.5">
        <div className="w-full h-full flex flex-col min-h-0">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[var(--colorNeutralBackground1)] text-[var(--colorNeutralForeground1)] flex flex-col font-sans select-none antialiased overflow-hidden">
      {/* Top Header Row */}
      <div className="flex h-16 border-b border-[var(--colorNeutralStroke1)] bg-[var(--colorNeutralBackground2)] relative z-50 shrink-0">
        {/* Junction Box: Home / Logo Button */}
        <button
          onClick={onHomeClick}
          className="w-16 h-16 flex items-center justify-center border-r border-[var(--colorNeutralStroke1)] hover:bg-[var(--colorNeutralBackground2Hover)] text-[var(--colorNeutralForeground2)] hover:text-[var(--colorNeutralForeground1)] transition-all duration-300 cursor-pointer active:scale-95 group focus:outline-none"
          title="Início"
        >
          <div className="h-9 w-9 bg-gradient-to-tr from-[var(--colorBrandBackground)] to-[var(--colorBrandBackgroundHover)] rounded flex items-center justify-center shadow-sm group-hover:scale-102 transition-all duration-300">
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
        <main className="flex-1 p-3 md:p-4 bg-[var(--colorNeutralBackground1)] flex flex-col overflow-hidden h-[calc(100vh-4rem)]">
          <div className="w-full max-w-[99%] mx-auto flex-1 flex flex-col min-h-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
