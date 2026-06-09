export default function Relatorios() {
  return (
    <div className="flex-1 rounded-xl border border-slate-850 bg-[#0e1626]/20 p-6 text-slate-300">
      <h2 className="text-lg font-bold text-slate-100 mb-3">Relatórios</h2>
      <p className="text-sm text-slate-400">Gere relatórios de vendas, orçamentos e pré-vendas para revisar performance comercial.</p>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-slate-800 bg-[#070a13]/80 p-4">
          <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Resumo de Vendas</h3>
          <p className="text-sm font-semibold text-slate-200">Total de vendas do período atual</p>
          <p className="text-xs text-slate-500 mt-2">Visualize vendas por cliente, produtos e canais de atendimento.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#070a13]/80 p-4">
          <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Orçamentos e Pré-Vendas</h3>
          <p className="text-sm font-semibold text-slate-200">Acompanhe conversão de orçamentos em vendas efetivas</p>
          <p className="text-xs text-slate-500 mt-2">Relatórios simplificados para analisar o desempenho comercial.</p>
        </div>
      </div>
    </div>
  );
}
