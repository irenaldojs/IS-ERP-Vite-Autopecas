export default function Entregas() {
  return (
    <div className="flex-1 rounded-xl border border-slate-850 bg-[#0e1626]/20 p-6 text-slate-300">
      <h2 className="text-lg font-bold text-slate-100 mb-3">Entregas</h2>
      <p className="text-sm text-slate-400">Acompanhe o status das entregas de vendas e mantenha o fluxo de logística integrado ao módulo de vendas.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-[#070a13]/80 p-4 text-slate-300">
          <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Em trânsito</h3>
          <p className="text-sm font-semibold text-slate-100">2 entregas em rota</p>
          <p className="text-xs text-slate-500 mt-2">Acompanhe o tempo estimado de chegada para cada pedido enviado.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#070a13]/80 p-4 text-slate-300">
          <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Aguardando separação</h3>
          <p className="text-sm font-semibold text-slate-100">4 pedidos prontos para expedição</p>
          <p className="text-xs text-slate-500 mt-2">Use este painel para garantir que as entregas do módulo de vendas sejam despachadas rapidamente.</p>
        </div>
      </div>
    </div>
  );
}
