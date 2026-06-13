import { useState, useEffect } from "react";
import { Button } from "@fluentui/react-components";
import { ProductService } from "@/services/product.service";
import { ProdutoGrupo, ProdutoCategoria } from "@/types/products.entities";

export default function Grupos() {
  const [grupos, setGrupos] = useState<ProdutoGrupo[]>([]);
  const [categorias, setCategorias] = useState<ProdutoCategoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [grupoParentId, setGrupoParentId] = useState<number | "">("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  const carregarDados = async () => {
    try {
      const [gData, cData] = await Promise.all([
        ProductService.listarGrupos(),
        ProductService.listarCategorias(),
      ]);
      setGrupos(gData);
      setCategorias(cData);
    } catch (error) {
      console.error("Erro ao carregar dados dos grupos:", error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim() || categoriaId === "") return;

    setLoading(true);
    try {
      await ProductService.criarGrupo(
        Number(categoriaId),
        grupoParentId === "" ? null : Number(grupoParentId),
        descricao
      );
      setDescricao("");
      setGrupoParentId("");
      await carregarDados();
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoriaDesc = (catId: number) => {
    const cat = categorias.find((c) => c.id === catId);
    return cat ? cat.descricao : `ID: ${catId}`;
  };

  const getGrupoParentDesc = (parentId: number | null | undefined) => {
    if (!parentId) return "-";
    const parent = grupos.find((g) => g.id === parentId);
    return parent ? parent.descricao : `ID: ${parentId}`;
  };

  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start max-w-6xl mx-auto w-full">
        {/* Formulário de Cadastro */}
        <div className="border border-slate-850 rounded-xl bg-[#0e1626]/20 p-5 space-y-4 w-full">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2">
            Novo Grupo / Subgrupo
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Categoria Vinculada
              </label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                required
              >
                <option value="">Selecione uma Categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.descricao}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Grupo Pai (Opcional - Para Subgrupos)
              </label>
              <select
                value={grupoParentId}
                onChange={(e) => setGrupoParentId(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
              >
                <option value="">Nenhum (Grupo Principal)</option>
                {grupos.map((grp) => (
                  <option key={grp.id} value={grp.id}>
                    {grp.descricao} (ID: {grp.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Descrição do Grupo (Ex: Filtros, Sensores, Amortecedores)
              </label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                placeholder="Ex: Filtros"
                required
              />
            </div>

            <Button type="submit" appearance="primary" disabled={loading || categoriaId === ""}>
              {loading ? "Salvando..." : "Salvar Grupo"}
            </Button>
          </form>
        </div>

        {/* Listagem */}
        <div className="border border-slate-850 rounded-xl bg-[#0e1626]/20 p-5 space-y-4 md:col-span-2 w-full">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2">
            Grupos e Subgrupos Cadastrados
          </h4>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-slate-500">
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">ID</th>
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Descrição</th>
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Categoria</th>
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Grupo Pai</th>
                </tr>
              </thead>
              <tbody>
                {grupos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500">
                      Nenhum grupo encontrado no banco local.
                    </td>
                  </tr>
                ) : (
                  grupos.map((grp) => (
                    <tr key={grp.id} className="border-b border-slate-850/50 hover:bg-slate-900/10 text-slate-300">
                      <td className="py-2 px-3">{grp.id}</td>
                      <td className="py-2 px-3 font-medium">{grp.descricao}</td>
                      <td className="py-2 px-3 text-slate-400">{getCategoriaDesc(grp.categoria_id)}</td>
                      <td className="py-2 px-3 text-slate-500">{getGrupoParentDesc(grp.grupo_parent_id)}</td>
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
