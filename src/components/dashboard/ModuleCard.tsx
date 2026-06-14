import { LucideIcon, ArrowUpRight } from "lucide-react";

export type ModuleColor = "blue" | "emerald" | "slate" | "amber";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  badge?: string;
  color?: ModuleColor;
}

const colorSchemes = {
  blue: {
    bgHover: "dark:hover:bg-blue-950/15 dark:hover:border-blue-500/30 hover:bg-blue-50/50 hover:border-blue-300",
    iconBg: "bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 group-hover:dark:text-blue-300 group-hover:border-blue-300 group-hover:dark:border-blue-500/40 group-hover:bg-blue-100/60 group-hover:dark:bg-blue-500/20",
    glow: "bg-blue-500/5 dark:bg-blue-500/5 group-hover:bg-blue-500/10 group-hover:dark:bg-blue-500/10",
    line: "from-blue-500 to-indigo-500",
    arrow: "group-hover:text-blue-600 group-hover:dark:text-blue-400 group-hover:bg-blue-100/50 group-hover:dark:bg-blue-950/40",
    badge: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
  },
  emerald: {
    bgHover: "dark:hover:bg-emerald-950/15 dark:hover:border-emerald-500/30 hover:bg-emerald-50/50 hover:border-emerald-300",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 group-hover:dark:text-emerald-300 group-hover:border-emerald-300 group-hover:dark:border-emerald-500/40 group-hover:bg-emerald-100/60 group-hover:dark:bg-emerald-500/20",
    glow: "bg-emerald-500/5 dark:bg-emerald-500/5 group-hover:bg-emerald-500/10 group-hover:dark:bg-emerald-500/10",
    line: "from-emerald-500 to-teal-500",
    arrow: "group-hover:text-emerald-600 group-hover:dark:text-emerald-400 group-hover:bg-emerald-100/50 group-hover:dark:bg-emerald-950/40",
    badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
  },
  slate: {
    bgHover: "dark:hover:bg-slate-800/15 dark:hover:border-slate-500/30 hover:bg-slate-100/50 hover:border-slate-300",
    iconBg: "bg-slate-50 dark:bg-slate-500/10 border border-slate-200 dark:border-slate-500/20 text-slate-600 dark:text-slate-400 group-hover:text-slate-700 group-hover:dark:text-slate-300 group-hover:border-slate-350 group-hover:dark:border-slate-500/40 group-hover:bg-slate-200/60 group-hover:dark:bg-slate-500/20",
    glow: "bg-slate-500/5 dark:bg-slate-500/5 group-hover:bg-slate-500/10 group-hover:dark:bg-slate-500/10",
    line: "from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-600",
    arrow: "group-hover:text-slate-700 group-hover:dark:text-slate-400 group-hover:bg-slate-200/50 group-hover:dark:bg-slate-950/40",
    badge: "bg-slate-50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20"
  },
  amber: {
    bgHover: "dark:hover:bg-amber-950/15 dark:hover:border-amber-500/30 hover:bg-amber-50/50 hover:border-amber-300",
    iconBg: "bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 group-hover:text-amber-700 group-hover:dark:text-amber-300 group-hover:border-amber-300 group-hover:dark:border-amber-500/40 group-hover:bg-amber-100/60 group-hover:dark:bg-amber-500/20",
    glow: "bg-amber-500/5 dark:bg-amber-500/5 group-hover:bg-amber-500/10 group-hover:dark:bg-amber-500/10",
    line: "from-amber-500 to-yellow-500",
    arrow: "group-hover:text-amber-600 group-hover:dark:text-amber-400 group-hover:bg-amber-100/50 group-hover:dark:bg-amber-950/40",
    badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
  }
};

export function ModuleCard({ title, description, icon: Icon, onClick, badge, color = "blue" }: ModuleCardProps) {
  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center justify-between p-4 w-full bg-slate-50/40 dark:bg-[#0d1527]/40 border border-slate-200/80 dark:border-slate-800/80 ${scheme.bgHover} rounded-xl cursor-pointer hover:bg-white hover:shadow-md dark:hover:shadow-lg focus:outline-none active:scale-[0.98] transition-all duration-300 overflow-hidden text-left`}
    >
      {/* Background soft glow effect on hover */}
      <div className={`absolute -right-4 -bottom-4 w-16 h-16 ${scheme.glow} rounded-full blur-xl transition-all duration-300 group-hover:scale-150`} />

      {/* Main Content Layout (Icon + Title & Desc) */}
      <div className="flex items-center gap-3.5 z-10 flex-1 min-w-0">
        {/* Compact Icon Container */}
        <div className={`h-11 w-11 rounded-lg ${scheme.iconBg} flex items-center justify-center transition-all duration-300 group-hover:scale-105 shrink-0 shadow-sm`}>
          <Icon className="h-5.5 w-5.5" />
        </div>

        {/* Text Content */}
        <div className="space-y-0.5 min-w-0">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight group-hover:text-slate-900 group-hover:dark:text-white transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal group-hover:text-slate-600 group-hover:dark:text-slate-300 transition-colors truncate">
            {description}
          </p>
        </div>
      </div>

      {/* Right Side action indicator (Badge or mini arrow) */}
      <div className="z-10 ml-3 shrink-0">
        {badge ? (
          <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${scheme.badge}`}>
            {badge}
          </span>
        ) : (
          <div className={`h-6 w-6 rounded-md flex items-center justify-center text-slate-400 dark:text-slate-500/80 ${scheme.arrow} transition-all duration-300`}>
            <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        )}
      </div>

      {/* Lower colored accent bar */}
      <span className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${scheme.line} group-hover:w-full transition-all duration-500`} />
    </button>
  );
}

