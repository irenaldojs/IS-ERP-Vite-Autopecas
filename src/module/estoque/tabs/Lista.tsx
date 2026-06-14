import { Search } from "lucide-react";

export default function ListaEstoque() {
  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
      {/* Filter Bar */}
      <div className="flex gap-2 shrink-0">
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Pesquisar no catálogo..." 
            className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-[#0e1626]/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none" 
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="flex-grow border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col shadow-sm dark:shadow-none">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-[#0e1626]/60 text-slate-650 dark:text-slate-400 font-semibold">
                <th className="p-3 pl-4">Código</th>
                <th className="p-3">Peça</th>
                <th className="p-3">Marca</th>
                <th className="p-3">Categoria</th>
                <th className="p-3 text-right">Preço Venda</th>
                <th className="p-3 text-center">Quantidade</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-850 text-slate-600 dark:text-slate-300">
              <tr className="hover:bg-slate-50/80 dark:hover:bg-[#16223f]/10 border-b border-slate-100 dark:border-slate-850">
                <td className="p-3 pl-4 font-mono text-indigo-650 dark:text-indigo-400">FP-1092</td>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">Pastilha de Freio Cobreq (Par)</td>
                <td className="p-3">Cobreq</td>
                <td className="p-3">Freios</td>
                <td className="p-3 text-right font-mono font-semibold">R$ 189,90</td>
                <td className="p-3 text-center font-bold font-mono">12 UN</td>
                <td className="p-3 text-center">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                </td>
              </tr>
              <tr className="hover:bg-slate-50/80 dark:hover:bg-[#16223f]/10 border-b border-slate-100 dark:border-slate-850">
                <td className="p-3 pl-4 font-mono text-indigo-650 dark:text-indigo-400">OL-3021</td>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">Óleo Motor Selenia 5W30 1L</td>
                <td className="p-3">Selenia</td>
                <td className="p-3">Motor</td>
                <td className="p-3 text-right font-mono font-semibold">R$ 42,50</td>
                <td className="p-3 text-center font-bold font-mono">4 UN</td>
                <td className="p-3 text-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 inline-block animate-pulse" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
