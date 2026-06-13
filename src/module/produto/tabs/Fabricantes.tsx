import { useState, useEffect } from "react";
import { Button } from "@fluentui/react-components";
import { ProductService } from "@/services/product.service";
import { ProdutoFabricante } from "@/types/products.entities";

export default function Fabricantes() {
  const [fabricantes, setFabricantes] = useState<ProdutoFabricante[]>([]);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  const carregarFabricantes = async () => {
    try {
      const data = await ProductService.listarFabricantes();
      setFabricantes(data);
    } catch (error) {
      console.error("Erro ao carregar fabricantes:", error);
    }
  };

  useEffect(() => {
    carregarFabricantes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    setLoading(true);
    try {
      await ProductService.criarFabricante(nome);
      setNome("");
      await carregarFabricantes();
    } catch (error) {
      console.error("Erro ao criar fabricante:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start max-w-6xl mx-auto w-full">
        {/* Formulário de Cadastro */}
        <div className="border border-slate-850 rounded-xl bg-[#0e1626]/20 p-5 space-y-4 w-full">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2">
            Novo Fabricante
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Nome do Fabricante (Ex: Bosch, Magneti Marelli)
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                placeholder="Ex: Bosch"
                required
              />
            </div>
            <Button type="submit" appearance="primary" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Fabricante"}
            </Button>
          </form>
        </div>

        {/* Listagem */}
        <div className="border border-slate-850 rounded-xl bg-[#0e1626]/20 p-5 space-y-4 md:col-span-2 w-full">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2">
            Fabricantes Cadastrados
          </h4>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-slate-500">
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">ID</th>
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Nome</th>
                </tr>
              </thead>
              <tbody>
                {fabricantes.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-slate-500">
                      Nenhum fabricante encontrado no banco local.
                    </td>
                  </tr>
                ) : (
                  fabricantes.map((fab) => (
                    <tr key={fab.id} className="border-b border-slate-850/50 hover:bg-slate-900/10 text-slate-300">
                      <td className="py-2 px-3">{fab.id}</td>
                      <td className="py-2 px-3">{fab.nome}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
