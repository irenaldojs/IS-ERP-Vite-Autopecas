
export default function Orcamento() {
  return (
    <div className="flex-1 rounded-xl border border-slate-850 bg-[#0e1626]/20 p-6 text-slate-300">
      <h2 className="text-lg font-bold text-slate-100 mb-3">Orçamentos</h2>
      <p className="text-sm text-slate-400">
        Aqui você acompanha orçamentos salvos, edita valores e transforma orçamentos em vendas.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-850 bg-[#070a13]/80 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Último orçamento</p>
          <p className="mt-2 font-semibold text-slate-100">ORC-0012 • Cliente: Oficina Central</p>
          <p className="text-xs text-slate-500">Status: Em análise</p>
        </div>
        <div className="rounded-2xl border border-slate-850 bg-[#070a13]/80 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Ações rápidas</p>
          <p className="mt-2 text-sm text-slate-300">Filtre por cliente, converta orçamento ou gere relatório de proposta.</p>
        </div>
      </div>
    </div>
  );
}
