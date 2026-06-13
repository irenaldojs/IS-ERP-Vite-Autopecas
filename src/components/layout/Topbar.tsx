import { useState, useEffect, useRef } from "react";
import { Monitor, User, Clock, Sun, Moon } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function Topbar() {
  const [time, setTime] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="flex-grow flex items-center justify-between px-6 bg-[var(--colorNeutralBackground2)] border-b border-[var(--colorNeutralStroke1)]">
      {/* Left side: Module Indicator */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold tracking-wider text-[var(--colorNeutralForeground3)] uppercase">
          IS-ERP Autopeças
        </span>
        <span className="text-[var(--colorNeutralStroke1)]">/</span>
        <span className="text-xs font-bold text-[var(--colorNeutralForeground1)] tracking-wide uppercase">
          Terminal Operacional
        </span>
      </div>

      {/* Right side: System Info & Profile */}
      <div className="flex items-center gap-6">
        {/* Workstation & User Metadata */}
        <div className="hidden md:flex items-center gap-3 text-xs font-medium text-[var(--colorNeutralForeground2)]">
          {/* Workstation */}
          <div className="flex items-center gap-1.5 bg-[var(--colorNeutralBackground3)] px-3 py-1.5 rounded border border-[var(--colorNeutralStroke1)]">
            <Monitor className="h-3.5 w-3.5 text-[var(--colorBrandStroke1)]" />
            <span>Micro: <strong className="text-[var(--colorNeutralForeground1)]">CAIXA-01</strong></span>
          </div>

          {/* User */}
          <div className="flex items-center gap-1.5 bg-[var(--colorNeutralBackground3)] px-3 py-1.5 rounded border border-[var(--colorNeutralStroke1)]">
            <User className="h-3.5 w-3.5 text-[var(--colorBrandStroke1)]" />
            <span>Operador: <strong className="text-[var(--colorNeutralForeground1)]">Irenaldo Silva</strong></span>
          </div>

          {/* Real-time Clock */}
          <div className="flex items-center gap-1.5 bg-[var(--colorNeutralBackground3)] px-3 py-1.5 rounded border border-[var(--colorNeutralStroke1)] font-mono">
            <Clock className="h-3.5 w-3.5 text-[var(--colorBrandStroke1)]" />
            <span>{formatDateTime(time)}</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center p-2 rounded border border-[var(--colorNeutralStroke1)] bg-[var(--colorNeutralBackground3)] hover:bg-[var(--colorNeutralBackground3Hover)] text-[var(--colorNeutralForeground1)] cursor-pointer focus:outline-none transition-colors duration-150"
            title={theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5 text-amber-500" /> : <Moon className="h-3.5 w-3.5 text-indigo-400" />}
          </button>
        </div>

        {/* Profile Button / Dropdown Toggle */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="group flex items-center gap-2.5 p-0.5 rounded-full hover:bg-[var(--colorNeutralBackground1Hover)] cursor-pointer transition-all duration-200 focus:outline-none"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[var(--colorBrandBackground)] to-[var(--colorBrandBackgroundHover)] flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-[var(--colorNeutralStroke1)] group-hover:scale-102 transition-transform duration-200">
              IS
            </div>
          </button>

          {/* Profile Click Menu */}
          <div
            className={`absolute right-0 mt-2 w-48 bg-[var(--colorNeutralBackground3)] border border-[var(--colorNeutralStroke1)] rounded shadow-xl py-2 transition-all duration-200 z-50 ${
              isDropdownOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            <div className="px-4 py-1.5 border-b border-[var(--colorNeutralStroke1)] mb-1.5">
              <p className="text-[10px] text-[var(--colorNeutralForeground4)] uppercase font-bold tracking-wider">Logado como</p>
              <p className="text-xs font-semibold text-[var(--colorNeutralForeground1)] truncate">Irenaldo Silva</p>
            </div>
            <button
              onClick={() => setIsDropdownOpen(false)}
              className="w-full text-left px-4 py-2 text-xs text-[var(--colorNeutralForeground2)] hover:bg-[var(--colorSubtleBackgroundHover)] hover:text-[var(--colorNeutralForeground1)] cursor-pointer transition-colors duration-150"
            >
              Configurações da Conta
            </button>
            <button
              onClick={() => setIsDropdownOpen(false)}
              className="w-full text-left px-4 py-2 text-xs text-[var(--colorNeutralForeground2)] hover:bg-[var(--colorSubtleBackgroundHover)] hover:text-[var(--colorNeutralForeground1)] cursor-pointer transition-colors duration-150"
            >
              Trocar de Turno
            </button>
            <div className="border-t border-[var(--colorNeutralStroke1)] mt-1.5 pt-1.5">
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="w-full text-left px-4 py-2 text-xs text-[var(--colorPaletteRedForeground1)] hover:bg-[var(--colorNeutralBackground4Hover)] cursor-pointer transition-colors duration-150 font-medium"
              >
                Sair do Sistema
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
