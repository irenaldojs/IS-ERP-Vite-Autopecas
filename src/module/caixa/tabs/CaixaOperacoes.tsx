import { Button } from "@fluentui/react-components";

export default function CaixaOperacoes(props: any) {
  const { openingBalance, cashInflow, cashOutflow, currentBalance } = props.app;

  return (
    <div className="flex-1 w-full h-full flex flex-col md:flex-row gap-4 min-h-0">
      {/* Caixa Status & Summary */}
      <div className="flex-grow border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 p-6 flex flex-col justify-between min-h-0 shadow-sm dark:shadow-none">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-3">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resumo Financeiro do Caixa (Turno Atual)</h4>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 uppercase tracking-wider">Caixa Aberto</span>
          </div>

          {/* Balances list */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-850 rounded-lg">
              <span className="text-[9px] font-bold text-slate-500 uppercase">Abertura</span>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">R$ {openingBalance.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-850 rounded-lg">
              <span className="text-[9px] font-bold text-slate-500 uppercase">Entradas</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">R$ {cashInflow.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-850 rounded-lg">
              <span className="text-[9px] font-bold text-slate-500 uppercase">Saídas (Sangria)</span>
              <p className="text-sm font-bold text-red-600 dark:text-red-400 font-mono">R$ {cashOutflow.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-lg">
              <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Saldo Atual</span>
              <p className="text-sm font-black text-indigo-750 dark:text-indigo-300 font-mono">R$ {currentBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Cash Operations (Sangria / Suprimento / Fechamento) */}
        <div className="flex gap-2 pt-6 border-t border-slate-200 dark:border-slate-850 mt-6 shrink-0">
          <Button>Sangria (Retirada)</Button>
          <Button>Suprimento (Aporte)</Button>
          <Button style={{ marginLeft: "auto", color: "var(--colorPaletteRedForeground1)" }}>Fechar Caixa (Fim de Turno)</Button>
        </div>
      </div>
    </div>
  );
}
