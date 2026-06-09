
export default function Arquivo() {
  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
      {/* Action Bar */}
      <div className="flex justify-between items-center shrink-0">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Arquivo de Garantias</h4>
      </div>

      {/* Archived Warranties Table */}
      <div className="flex-1 border border-slate-855 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                <th className="p-3">Cód. Chamado</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Peça</th>
                <th className="p-3">Data Encerramento</th>
                <th className="p-3 text-center">Resolução</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              <tr className="hover:bg-[#16223f]/10">
                <td className="p-3 font-mono text-indigo-400">#GAR-4499</td>
                <td className="p-3 font-semibold text-slate-200">Auto Mecânica Santos</td>
                <td className="p-3">Filtro de Óleo Fram</td>
                <td className="p-3">01/06/2026</td>
                <td className="p-3 text-center">Crédito Concedido</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
