import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Pendentes() {
  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
      {/* Action Row */}
      <div className="flex justify-between items-center shrink-0">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input type="text" placeholder="Buscar garantia pendente..." className="w-full pl-9 pr-4 py-1.5 bg-[#0e1626]/40 border border-slate-800 rounded-lg text-xs text-slate-355 focus:outline-none" />
        </div>
        <Button className="bg-indigo-650 hover:bg-indigo-555 text-white text-xs font-semibold py-1.5 px-3 h-auto rounded-lg flex items-center gap-1.5 cursor-pointer">
          <Plus className="h-3.5 w-3.5" /> Abrir Chamado
        </Button>
      </div>

      {/* Pending Warranties Table */}
      <div className="flex-1 border border-slate-855 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                <th className="p-3">Cód. Chamado</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Peça / Produto</th>
                <th className="p-3">Data Abertura</th>
                <th className="p-3 text-center">Prazo Decorrido</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              <tr className="hover:bg-[#16223f]/10">
                <td className="p-3 font-mono text-indigo-400">#GAR-4512</td>
                <td className="p-3 font-semibold text-slate-200">Oficina Multimarcas Silva</td>
                <td className="p-3">Amortecedor Dianteiro Cofap (Cofap)</td>
                <td className="p-3">07/06/2026</td>
                <td className="p-3 text-center font-semibold text-slate-400">2 dias</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#16223f] text-slate-400 border border-slate-800 uppercase tracking-wider">Aguardando Envio</span>
                </td>
              </tr>
              <tr className="hover:bg-[#16223f]/10">
                <td className="p-3 font-mono text-indigo-400">#GAR-4511</td>
                <td className="p-3 font-semibold text-slate-200">Ricardo Rodrigues Mendes</td>
                <td className="p-3">Bomba de Combustível Bosch (Bosch)</td>
                <td className="p-3">06/06/2026</td>
                <td className="p-3 text-center font-semibold text-slate-400">3 dias</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">Em Laudo Local</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
