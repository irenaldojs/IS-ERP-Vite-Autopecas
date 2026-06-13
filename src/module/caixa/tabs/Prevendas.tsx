import { Button } from "@fluentui/react-components";
import { Search } from "lucide-react";

export default function Prevendas(props: any) {
  const { preSales, handleReceivePreSale } = props.app;

  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
      {/* Action Bar */}
      <div className="flex justify-between items-center shrink-0">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar pré-venda pendente..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#0e1626]/40 border border-slate-800 rounded-lg text-xs text-slate-355 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="text-[10px] text-slate-400 bg-[#0e1626]/20 px-3 py-1.5 rounded-lg border border-slate-800">
          Estação de Caixa: <strong className="text-slate-200">Terminal 01</strong>
        </div>
      </div>

      {/* Pending pre-sales table */}
      <div className="flex-1 border border-slate-850 rounded-xl bg-[#0e1626]/20 overflow-hidden min-h-0 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-850 bg-[#0e1626]/60 text-slate-450 font-semibold">
                <th className="p-3">Código PV</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Vendedor</th>
                <th className="p-3">Data</th>
                <th className="p-3 text-right">Valor Total</th>
                <th className="p-3 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              {preSales
                .filter((pv: any) => pv.status === "Pendente")
                .map((pv: any) => (
                  <tr key={pv.id} className="hover:bg-[#16223f]/10">
                    <td className="p-3 font-mono text-indigo-400">{pv.id}</td>
                    <td className="p-3 font-semibold text-slate-200">{pv.client}</td>
                    <td className="p-3">{pv.seller}</td>
                    <td className="p-3">{pv.date}</td>
                    <td className="p-3 text-right font-bold text-slate-100">R$ {pv.total.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <Button
                        onClick={() => handleReceivePreSale(pv.id)}
                        appearance="primary"
                        size="small"
                      >
                        Receber e Emitir
                      </Button>
                    </td>
                  </tr>
                ))}
              {preSales.filter((pv: any) => pv.status === "Pendente").length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500 font-semibold">
                    Nenhuma pré-venda pendente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
