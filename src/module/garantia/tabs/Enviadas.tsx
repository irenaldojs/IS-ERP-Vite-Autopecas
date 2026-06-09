
export default function Enviadas() {
  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
      {/* Action Bar */}
      <div className="flex justify-between items-center shrink-0">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Garantias Enviadas para os Fabricantes</h4>
      </div>

      {/* Shipped Warranties Table */}
      <div className="flex-1 border border-slate-855 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                <th className="p-3">Cód. Chamado</th>
                <th className="p-3">Fabricante</th>
                <th className="p-3">Data Envio</th>
                <th className="p-3">Código Rastreio</th>
                <th className="p-3 text-center">NF de Remessa</th>
                <th className="p-3 text-center">Sefaz Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              <tr className="hover:bg-[#16223f]/10">
                <td className="p-3 font-mono text-indigo-400">#GAR-4509</td>
                <td className="p-3 font-semibold text-slate-200">Cofap Suspensões</td>
                <td className="p-3">01/06/2026</td>
                <td className="p-3 font-mono text-slate-500">QD908239023BR</td>
                <td className="p-3 text-center font-mono">00019283</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">Em Análise</span>
                </td>
              </tr>
              <tr className="hover:bg-[#16223f]/10">
                <td className="p-3 font-mono text-indigo-400">#GAR-4508</td>
                <td className="p-3 font-semibold text-slate-200">Bosch Brasil Ltda</td>
                <td className="p-3">30/05/2026</td>
                <td className="p-3 font-mono text-slate-500">QD908123992BR</td>
                <td className="p-3 text-center font-mono">00019278</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">Em Análise</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
