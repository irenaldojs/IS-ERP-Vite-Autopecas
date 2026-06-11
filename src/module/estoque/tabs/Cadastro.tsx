import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Cadastro() {
  const [categoria, setCategoria] = useState("Freios");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
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
            <div className="space-y-1 relative">
              <label className="text-[9px] font-bold text-slate-505 uppercase tracking-wider">Categoria</label>
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500 transition-all h-[32px] flex items-center justify-between cursor-pointer text-xs"
              >
                <span>{categoria}</span>
                <span className="text-slate-550 font-sans text-[10px]">▼</span>
              </button>

              {isCategoryDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsCategoryDropdownOpen(false)} />
                  <div className="absolute top-[52px] left-0 w-full bg-[#070a13] border border-slate-800 rounded-lg shadow-2xl z-20 py-1 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100">
                    {["Freios", "Motor", "Suspensão", "Elétrica"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategoria(cat);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-indigo-600/10 hover:text-indigo-400 ${
                          categoria === cat ? "bg-indigo-650/15 text-indigo-450 font-bold" : "text-slate-300"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </>
              )}
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
