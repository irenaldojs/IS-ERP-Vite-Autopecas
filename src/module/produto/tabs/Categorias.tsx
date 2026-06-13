import { useState, useEffect } from "react";
import { Button } from "@fluentui/react-components";
import { ProductService } from "@/services/product.service";
import { ProdutoCategoria } from "@/types/products.entities";

export default function Categorias() {
  const [categorias, setCategorias] = useState<ProdutoCategoria[]>([]);
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  const carregarCategorias = async () => {
    try {
      const data = await ProductService.listarCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;

    setLoading(true);
    try {
      await ProductService.criarCategoria(descricao);
      setDescricao("");
      await carregarCategorias();
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
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
            Nova Categoria
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Descrição da Categoria (Ex: Motor, Suspensão)
              </label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                placeholder="Ex: Motor"
                required
              />
            </div>
            <Button type="submit" appearance="primary" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Categoria"}
            </Button>
          </form>
        </div>

        {/* Listagem */}
        <div className="border border-slate-850 rounded-xl bg-[#0e1626]/20 p-5 space-y-4 md:col-span-2 w-full">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2">
            Categorias Cadastradas
          </h4>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-slate-500">
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">ID</th>
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {categorias.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-slate-500">
                      Nenhuma categoria encontrada no banco local.
                    </td>
                  </tr>
                ) : (
                  categorias.map((cat) => (
                    <tr key={cat.id} className="border-b border-slate-850/50 hover:bg-slate-900/10 text-slate-300">
                      <td className="py-2 px-3">{cat.id}</td>
                      <td className="py-2 px-3">{cat.descricao}</td>
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
