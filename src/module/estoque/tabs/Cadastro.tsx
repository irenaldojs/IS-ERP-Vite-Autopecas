import { Button } from "@/components/ui/button";

export default function Cadastro() {
  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
      {/* Cadastro Form Card */}
      <div className="border border-slate-850 rounded-xl bg-[#0e1626]/20 p-5 space-y-4 max-w-3xl mx-auto w-full">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2">Cadastrar Nova Autopeça</h4>

        <form className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-505 uppercase tracking-wider">Código Interno</label>
              <input type="text" className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none" placeholder="EX: AP-1092" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[9px] font-bold text-slate-505 uppercase tracking-wider">Descrição do Produto</label>
              <input type="text" className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none" placeholder="EX: Jogo Pastilha de Freio Dianteira" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-505 uppercase tracking-wider">Marca</label>
              <input type="text" className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none" placeholder="EX: Cobreq" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-505 uppercase tracking-wider">Categoria</label>
              <select className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-400 focus:outline-none">
                <option>Freios</option>
                <option>Motor</option>
                <option>Suspensão</option>
                <option>Elétrica</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-505 uppercase tracking-wider">Preço Custo</label>
              <input type="text" className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-305 focus:outline-none" placeholder="R$ 0,00" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-505 uppercase tracking-wider">Preço Venda</label>
              <input type="text" className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-305 focus:outline-none" placeholder="R$ 0,00" />
            </div>
          </div>

          <Button type="button" className="bg-indigo-655 hover:bg-indigo-555 text-white font-bold py-2 px-4 h-auto rounded-lg cursor-pointer uppercase tracking-wider">Salvar Produto</Button>
        </form>
      </div>
    </div>
  );
}
