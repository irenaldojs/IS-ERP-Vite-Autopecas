
export default function Mapa() {
  return (
    <div className="flex-1 rounded-xl border border-slate-850 bg-[#0e1626]/20 p-6 text-slate-300">
      <h2 className="text-lg font-bold text-slate-100 mb-3">Mapa de Entregas</h2>
      <p className="text-sm text-slate-400">
        Visualize a malha de rotas e a localização atual das entregas em trânsito.
      </p>
      <div className="mt-6 rounded-2xl border border-slate-850 bg-[#070a13]/80 p-6 text-center text-slate-500">
        <p className="font-semibold text-slate-200">Mapa interativo em breve</p>
        <p className="text-xs mt-2">O painel de localização será integrado aqui para rastrear entregas em tempo real.</p>
      </div>
    </div>
  );
}
