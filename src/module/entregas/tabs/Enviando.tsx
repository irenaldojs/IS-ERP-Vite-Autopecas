
export default function Enviando() {
  return (
    <div className="flex-1 rounded-xl border border-slate-850 bg-[#0e1626]/20 p-6 text-slate-300">
      <h2 className="text-lg font-bold text-slate-100 mb-3">Em Rota</h2>
      <p className="text-sm text-slate-400">
        Acompanhe as entregas em transporte neste momento e verifique o status de cada rota.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-850 bg-[#070a13]/80 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Veículos ativos</p>
          <p className="mt-2 font-semibold text-slate-100">5 em rota</p>
        </div>
        <div className="rounded-2xl border border-slate-850 bg-[#070a13]/80 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Tempo estimado</p>
          <p className="mt-2 text-sm text-slate-300">2 entregas com previsão de chegada em até 45 minutos.</p>
        </div>
      </div>
    </div>
  );
}
