
export default function Baias() {
  return (
    <div className="flex-1 rounded-xl border border-slate-850 bg-[#0e1626]/20 p-6 text-slate-300">
      <h2 className="text-lg font-bold text-slate-100 mb-3">Baías de Entrega</h2>
      <p className="text-sm text-slate-400">
        Monitore as ordens aguardando separação e embarque nas baías logísticas.
      </p>
      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-slate-850 bg-[#070a13]/80 p-4">
          <p className="text-xs text-slate-500">Pedidos nesta baía</p>
          <p className="mt-2 font-semibold text-slate-100">14 ordens</p>
        </div>
        <div className="rounded-2xl border border-slate-850 bg-[#070a13]/80 p-4">
          <p className="text-xs text-slate-500">Prioridade</p>
          <p className="mt-2 text-sm text-slate-300">Envios expressos e clientes VIP em primeiro lugar.</p>
        </div>
      </div>
    </div>
  );
}
