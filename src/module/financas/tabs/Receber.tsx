
export default function Receber() {
  return (
    <div className="flex-1 rounded-xl border border-slate-850 bg-[#0e1626]/20 p-6 text-slate-300">
      <h2 className="text-lg font-bold text-slate-100 mb-3">Contas a Receber</h2>
      <p className="text-sm text-slate-400">
        Aqui você acompanha as faturas pendentes e os recebimentos programados.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-850 bg-[#070a13]/80 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Total a receber</p>
          <p className="mt-2 font-semibold text-slate-100">R$ 42.860,00</p>
        </div>
        <div className="rounded-2xl border border-slate-850 bg-[#070a13]/80 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Vencimentos próximos</p>
          <p className="mt-2 text-sm text-slate-300">5 faturas nos próximos 3 dias.</p>
        </div>
      </div>
    </div>
  );
}
