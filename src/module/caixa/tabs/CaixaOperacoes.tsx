import { Button } from "@/components/ui/button";

export default function CaixaOperacoes(props: any) {
  const { openingBalance, cashInflow, cashOutflow, currentBalance } = props.app;

  return (
    <div className="flex-1 w-full h-full flex flex-col md:flex-row gap-4 min-h-0 bg-[#070a13]">
      {/* Caixa Status & Summary */}
      <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/20 p-6 flex flex-col justify-between min-h-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resumo Financeiro do Caixa (Turno Atual)</h4>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">Caixa Aberto</span>
          </div>

          {/* Balances list */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-[#070a13] border border-slate-850 rounded-lg">
              <span className="text-[9px] font-bold text-slate-500 uppercase">Abertura</span>
              <p className="text-sm font-bold text-slate-300">R$ {openingBalance.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-[#070a13] border border-slate-850 rounded-lg">
              <span className="text-[9px] font-bold text-slate-505 uppercase">Entradas</span>
              <p className="text-sm font-bold text-emerald-450">R$ {cashInflow.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-[#070a13] border border-slate-850 rounded-lg">
              <span className="text-[9px] font-bold text-slate-505 uppercase">Saídas (Sangria)</span>
              <p className="text-sm font-bold text-red-400">R$ {cashOutflow.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <span className="text-[9px] font-bold text-indigo-450 uppercase">Saldo Atual</span>
              <p className="text-sm font-black text-indigo-350">R$ {currentBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Cash Operations (Sangria / Suprimento / Fechamento) */}
        <div className="flex gap-2 pt-6 border-t border-slate-850 mt-6 shrink-0">
          <Button className="bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-350 text-xs font-semibold py-2 px-4 h-auto rounded-lg cursor-pointer">Sangria (Retirada)</Button>
          <Button className="bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-350 text-slate-355 text-xs font-semibold py-2 px-4 h-auto rounded-lg cursor-pointer">Suprimento (Aporte)</Button>
          <Button className="ml-auto bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 text-xs font-semibold py-2 px-4 h-auto rounded-lg cursor-pointer">Fechar Caixa (Fim de Turno)</Button>
        </div>
      </div>
    </div>
  );
}
