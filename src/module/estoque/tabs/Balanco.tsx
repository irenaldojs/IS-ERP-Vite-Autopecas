import { Button } from "@fluentui/react-components";

export default function Balanco() {
  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
      {/* Action Row */}
      <div className="flex justify-between items-center shrink-0">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inventário e Balanço de Estoque</h4>
        <Button appearance="primary">Iniciar Novo Balanço</Button>
      </div>

      {/* Active Balance Tasks */}
      <div className="border border-slate-850 rounded-xl bg-[#0e1626]/20 p-4 space-y-3">
        <div className="p-3 bg-[#070a13] border border-slate-850 rounded-xl flex flex-col sm:flex-row justify-between gap-3 text-xs">
          <div className="flex flex-col space-y-1">
            <span className="font-bold text-slate-200">Balanço Geral - Setor Freios (Estante A)</span>
            <span className="text-slate-500 font-mono text-[10px]">Contagem iniciada em 09/06/2026</span>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            <div className="w-32 bg-slate-850 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-indigo-550 h-full w-[45%]" />
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">45% Concluído</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-450 border border-amber-500/20">Em Andamento</span>
          </div>
        </div>
      </div>
    </div>
  );
}
