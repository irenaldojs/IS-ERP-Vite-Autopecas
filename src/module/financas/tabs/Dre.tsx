
export default function Dre() {
  return (
    <div className="flex-1 rounded-xl border border-slate-850 bg-[#0e1626]/20 p-6 text-slate-300">
      <h2 className="text-lg font-bold text-slate-100 mb-3">DRE</h2>
      <p className="text-sm text-slate-400">
        Relatório de resultados para visualizar lucros e perdas em períodos selecionados.
      </p>
      <div className="mt-6 rounded-2xl border border-slate-850 bg-[#070a13]/80 p-4 text-slate-300">
        <p className="text-xs uppercase tracking-wider text-slate-500">Último trimestre</p>
        <p className="mt-2 font-semibold text-slate-100">Receita líquida prevista em R$ 25.430,00</p>
      </div>
    </div>
  );
}
