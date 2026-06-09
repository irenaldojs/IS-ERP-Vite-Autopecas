
export default function Frota() {
  return (
    <div className="flex-1 rounded-xl border border-slate-850 bg-[#0e1626]/20 p-6 text-slate-300">
      <h2 className="text-lg font-bold text-slate-100 mb-3">Frota</h2>
      <p className="text-sm text-slate-400">
        Gerencie a disponibilidade e o desempenho dos veículos da sua frota de entrega.
      </p>
      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-slate-850 bg-[#070a13]/80 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Veículos ativos</p>
          <p className="mt-2 font-semibold text-slate-100">12</p>
        </div>
        <div className="rounded-2xl border border-slate-850 bg-[#070a13]/80 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Última manutenção</p>
          <p className="mt-2 text-sm text-slate-300">Caminhão 04 revisado ontem.</p>
        </div>
      </div>
    </div>
  );
}
