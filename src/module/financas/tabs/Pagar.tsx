
export default function Pagar() {
  return (
    <div className="flex-1 rounded-xl border border-slate-850 bg-[#0e1626]/20 p-6 text-slate-300">
      <h2 className="text-lg font-bold text-slate-100 mb-3">Contas a Pagar</h2>
      <p className="text-sm text-slate-400">
        Visualize obrigações financeiras e gerencie os pagamentos futuros com controle.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-850 bg-[#070a13]/80 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Total a pagar</p>
          <p className="mt-2 font-semibold text-slate-100">R$ 18.720,00</p>
        </div>
        <div className="rounded-2xl border border-slate-850 bg-[#070a13]/80 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Próximo vencimento</p>
          <p className="mt-2 text-sm text-slate-300">Pagamento da transportadora em 2 dias.</p>
        </div>
      </div>
    </div>
  );
}
