import { LucideIcon, ArrowUpRight } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  badge?: string;
}

export function ModuleCard({ title, description, icon: Icon, onClick, badge }: ModuleCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col justify-between items-start p-5 w-full aspect-square bg-[#0e1626]/55 border border-slate-850 hover:border-indigo-500/30 rounded-xl cursor-pointer hover:bg-[#121c32]/60 hover:shadow-lg hover:shadow-indigo-500/5 focus:outline-none active:scale-[0.97] transition-all duration-300 overflow-hidden"
    >
      {/* Background soft glow effect on hover */}
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/8 transition-colors duration-300" />

      {/* Top Row: Icon + Badge/Arrow */}
      <div className="w-full flex items-center justify-between">
        <div className="h-16 w-16 rounded-xl bg-[#16223f]/40 border border-indigo-500/15 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:border-indigo-500/35 group-hover:bg-[#16223f] group-hover:scale-105 transition-all duration-300 shadow-md shadow-indigo-950/20">
          <Icon className="h-8 w-8" />
        </div>

        {badge ? (
          <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {badge}
          </span>
        ) : (
          <div className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:bg-[#16223f]/55 transition-all duration-300">
            <ArrowUpRight className="h-4.5 w-4.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        )}
      </div>

      {/* Bottom Content: Title + Description */}
      <div className="space-y-1.5 z-10 w-full text-left">
        <h3 className="text-sm font-bold text-slate-100 tracking-tight group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-400 leading-normal group-hover:text-slate-300 transition-colors line-clamp-3">
          {description}
        </p>
      </div>

      {/* Lower outline border transition */}
      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-violet-500 group-hover:w-full transition-all duration-500" />
    </button>
  );
}
