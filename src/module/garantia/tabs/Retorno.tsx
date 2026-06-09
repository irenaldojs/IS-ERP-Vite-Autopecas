import { Button } from "@/components/ui/button";

export default function Retorno() {
  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Laudos de Retorno e Decisões dos Fabricantes</h4>
      </div>

      {/* Return Warranties Table */}
      <div className="flex-1 border border-slate-855 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                <th className="p-3">Cód. Chamado</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Fabricante</th>
                <th className="p-3">Data Parecer</th>
                <th className="p-3 text-center">Decisão Laudo</th>
                <th className="p-3 text-center">Resolução / Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              <tr className="hover:bg-[#16223f]/10">
                <td className="p-3 font-mono text-indigo-400">#GAR-4505</td>
                <td className="p-3 font-semibold text-slate-200">Mecânica do Gordo</td>
                <td className="p-3">Cofap Suspensões</td>
                <td className="p-3">09/06/2026</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">Procedente</span>
                </td>
                <td className="p-3 text-center">
                  <Button className="bg-indigo-650 hover:bg-indigo-555 text-white text-[10px] py-1 px-2.5 h-auto rounded cursor-pointer font-bold uppercase tracking-wider">Gerar Crédito Cliente</Button>
                </td>
              </tr>
              <tr className="hover:bg-[#16223f]/10">
                <td className="p-3 font-mono text-indigo-400">#GAR-4504</td>
                <td className="p-3 font-semibold text-slate-200">Fernanda Mendes Souza</td>
                <td className="p-3">Vela NGK (Unidade)</td>
                <td className="p-3">08/06/2026</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">Rejeitado</span>
                </td>
                <td className="p-3 text-center">
                  <Button className="bg-indigo-650 hover:bg-indigo-555 text-white text-[10px] py-1 px-2.5 h-auto rounded cursor-pointer font-bold uppercase tracking-wider">Marcar Reenvio</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
