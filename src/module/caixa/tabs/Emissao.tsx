import { Button } from "@fluentui/react-components";
import { Printer } from "lucide-react";

export default function Emissao(props: any) {
  const { invoices } = props.app;

  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
      {/* Action Bar */}
      <div className="flex justify-between items-center shrink-0">
        <h4 className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider">Notas Fiscais Emitidas (NFC-e / NF-e)</h4>
        <div className="flex gap-2">
          <Button size="small">Ver Inutilizações</Button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="flex-1 border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col shadow-sm dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-[#0e1626]/60 text-slate-650 dark:text-slate-400 font-semibold">
                <th className="p-3">Nº Cupom</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Data Emissão</th>
                <th className="p-3 text-right">Valor</th>
                <th className="p-3 text-center">Sefaz Status</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-850 text-slate-600 dark:text-slate-300">
              {invoices.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-[#16223f]/10 border-b border-slate-100 dark:border-slate-850">
                  <td className="p-3 font-mono text-indigo-650 dark:text-indigo-400">{inv.id}</td>
                  <td className="p-3 font-semibold text-slate-500 dark:text-slate-400">{inv.type}</td>
                  <td className="p-3 text-slate-850 dark:text-slate-200 font-semibold">{inv.client}</td>
                  <td className="p-3">{inv.date}</td>
                  <td className="p-3 text-right font-mono font-semibold">R$ {inv.total.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-500/20 uppercase tracking-wider">{inv.status}</span>
                  </td>
                  <td className="p-3 text-center flex justify-center gap-1.5">
                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-[#16223f] border border-slate-250 dark:border-slate-800 rounded text-slate-600 dark:text-slate-300 transition-colors cursor-pointer" title="Imprimir Danfe">
                      <Printer className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500 font-semibold">Nenhuma nota fiscal emitida.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
