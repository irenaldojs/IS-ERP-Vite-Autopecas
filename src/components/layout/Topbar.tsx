import { useState, useEffect, useRef } from "react";
import { Monitor, User, Clock } from "lucide-react";

export function Topbar() {
  const [time, setTime] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="flex-grow flex items-center justify-between px-6 bg-[#0e1626]/40">
      {/* Left side: Module Indicator */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          IS-ERP Autopeças
        </span>
        <span className="text-slate-800">/</span>
        <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">
          Terminal Operacional
        </span>
      </div>

      {/* Right side: System Info & Profile */}
      <div className="flex items-center gap-6">
        {/* Workstation & User Metadata */}
        <div className="hidden md:flex items-center gap-3 text-xs font-medium text-slate-400">
          {/* Workstation */}
          <div className="flex items-center gap-1.5 bg-[#16223f]/50 px-3 py-1.5 rounded-lg border border-slate-850">
            <Monitor className="h-3.5 w-3.5 text-indigo-400" />
            <span>Micro: <strong className="text-slate-200">CAIXA-01</strong></span>
          </div>

          {/* User */}
          <div className="flex items-center gap-1.5 bg-[#16223f]/50 px-3 py-1.5 rounded-lg border border-slate-850">
            <User className="h-3.5 w-3.5 text-indigo-400" />
            <span>Operador: <strong className="text-slate-200">Irenaldo Silva</strong></span>
          </div>

          {/* Real-time Clock */}
          <div className="flex items-center gap-1.5 bg-[#16223f]/50 px-3 py-1.5 rounded-lg border border-slate-850 font-mono">
            <Clock className="h-3.5 w-3.5 text-indigo-400" />
            <span>{formatDateTime(time)}</span>
          </div>
        </div>

        {/* Profile Button / Dropdown Toggle */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="group flex items-center gap-2.5 p-0.5 rounded-full hover:bg-slate-800/65 cursor-pointer transition-all duration-200 focus:outline-none"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-slate-800 group-hover:scale-105 transition-transform duration-200">
              IS
            </div>
          </button>

          {/* Profile Click Menu */}
          <div
            className={`absolute right-0 mt-2 w-48 bg-[#0e1626] border border-slate-850 rounded-xl shadow-xl py-2 transition-all duration-200 z-50 ${
              isDropdownOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            <div className="px-4 py-1.5 border-b border-slate-800 mb-1.5">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Logado como</p>
              <p className="text-xs font-semibold text-slate-200 truncate">Irenaldo Silva</p>
            </div>
            <button
              onClick={() => setIsDropdownOpen(false)}
              className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:bg-[#16223f]/60 hover:text-white cursor-pointer transition-colors duration-150"
            >
              Configurações da Conta
            </button>
            <button
              onClick={() => setIsDropdownOpen(false)}
              className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:bg-[#16223f]/60 hover:text-white cursor-pointer transition-colors duration-150"
            >
              Trocar de Turno
            </button>
            <div className="border-t border-slate-800 mt-1.5 pt-1.5">
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-950/20 cursor-pointer transition-colors duration-150 font-medium"
              >
                Sair do Systema
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
