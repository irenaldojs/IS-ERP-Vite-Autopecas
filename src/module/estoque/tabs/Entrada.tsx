import { Button } from "@fluentui/react-components";
import { FileUp } from "lucide-react";

export default function Entrada() {
  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
      {/* Action Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        {/* XML Import Zone */}
        <div className="md:col-span-2 border border-dashed border-slate-800 bg-[#0e1626]/20 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500/35 transition-colors">
          <FileUp className="h-7 w-7 text-indigo-400 mb-2" />
          <span className="text-xs font-bold text-slate-200">Importar XML de NFe</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Arraste o arquivo XML do fornecedor ou clique para selecionar</p>
        </div>
        {/* Manual Entrada Form Card */}
        <div className="bg-[#0e1626]/30 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase">Lançamento</span>
            <h4 className="text-xs font-bold text-slate-200">Entrada Manual</h4>
            <p className="text-[10px] text-slate-500">Lance notas de fornecedores sem XML</p>
          </div>
          <Button style={{ marginTop: "12px", width: "100%" }}>Nova Entrada Manual</Button>
        </div>
      </div>

      {/* Recent entries table */}
      <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
        <div className="p-3 border-b border-slate-850/60 bg-[#0e1626]/40 flex justify-between items-center shrink-0">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notas Fiscais de Entrada Importadas</h4>
        </div>
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-455 font-semibold">
                <th className="p-3 pl-4">Nº Nota</th>
                <th className="p-3">Fornecedor</th>
                <th className="p-3">Chave de Acesso</th>
                <th className="p-3">Data Entrada</th>
                <th className="p-3 text-right pr-4">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              <tr className="hover:bg-[#16223f]/10">
                <td className="p-3 pl-4 font-mono text-indigo-400">002.190.283</td>
                <td className="p-3 font-semibold text-slate-200">Distribuidora DPK Autopeças</td>
                <td className="p-3 font-mono text-slate-500">352606...908123</td>
                <td className="p-3">09/06/2026</td>
                <td className="p-3 text-right pr-4 font-bold">R$ 4.390,20</td>
              </tr>
              <tr className="hover:bg-[#16223f]/10">
                <td className="p-3 pl-4 font-mono text-indigo-400">001.209.182</td>
                <td className="p-3 font-semibold text-slate-200">Cofap Sistemas de Suspensão</td>
                <td className="p-3 font-mono text-slate-500">352606...908990</td>
                <td className="p-3">08/06/2026</td>
                <td className="p-3 text-right pr-4 font-bold">R$ 12.800,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
