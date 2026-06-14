import { useState, useEffect } from "react";
import { Button } from "@fluentui/react-components";
import { Edit } from "lucide-react";
import { ProductService } from "@/services/product.service";
import { ProdutoGrupo, ProdutoCategoria } from "@/types/products.entities";

export default function Grupos() {
  const [grupos, setGrupos] = useState<ProdutoGrupo[]>([]);
  const [categorias, setCategorias] = useState<ProdutoCategoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [grupoParentId, setGrupoParentId] = useState<number | "">("");
  const [descricao, setDescricao] = useState("");
  const [editingGrupo, setEditingGrupo] = useState<ProdutoGrupo | null>(null);
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

  const startEdit = (grp: ProdutoGrupo) => {
    setEditingGrupo(grp);
    setCategoriaId(grp.categoria_id);
    setGrupoParentId(grp.grupo_parent_id || "");
    setDescricao(grp.descricao || "");
  };

  const handleCancel = () => {
    setEditingGrupo(null);
    setCategoriaId("");
    setGrupoParentId("");
    setDescricao("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim() || categoriaId === "") return;

    setLoading(true);
    try {
      if (editingGrupo && editingGrupo.id) {
        await ProductService.atualizarGrupo(
          editingGrupo.id,
          Number(categoriaId),
          grupoParentId === "" ? null : Number(grupoParentId),
          descricao
        );
      } else {
        await ProductService.criarGrupo(
          Number(categoriaId),
          grupoParentId === "" ? null : Number(grupoParentId),
          descricao
        );
      }
      setDescricao("");
      setGrupoParentId("");
      setEditingGrupo(null);
      await carregarDados();
    } catch (error) {
      console.error("Erro ao salvar grupo:", error);
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
        {/* Formulário de Cadastro / Edição */}
        <div className="border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 p-5 space-y-4 w-full shadow-sm dark:shadow-none">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-850/80 pb-2">
            {editingGrupo ? "Editar Grupo / Subgrupo" : "Novo Grupo / Subgrupo"}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Categoria Vinculada
              </label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
                required
              >
                <option value="" className="bg-white dark:bg-[#070a13] text-slate-700 dark:text-slate-300">Selecione uma Categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-white dark:bg-[#070a13] text-slate-700 dark:text-slate-300">
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
                className="w-full px-3 py-1.5 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
              >
                <option value="" className="bg-white dark:bg-[#070a13] text-slate-700 dark:text-slate-300">Nenhum (Grupo Principal)</option>
                {grupos
                  .filter((grp) => !editingGrupo || grp.id !== editingGrupo.id) // Evitar que o grupo seja pai de si mesmo
                  .map((grp) => (
                    <option key={grp.id} value={grp.id} className="bg-white dark:bg-[#070a13] text-slate-700 dark:text-slate-300">
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
                className="w-full px-3 py-1.5 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
                placeholder="Ex: Filtros"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" appearance="primary" disabled={loading || categoriaId === ""}>
                {loading ? "Salvando..." : editingGrupo ? "Salvar Alterações" : "Salvar Grupo"}
              </Button>
              {editingGrupo && (
                <Button type="button" appearance="secondary" onClick={handleCancel} disabled={loading}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Listagem */}
        <div className="border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 p-5 space-y-4 md:col-span-2 w-full shadow-sm dark:shadow-none">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-850/80 pb-2">
            Grupos e Subgrupos Cadastrados
          </h4>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-850 text-slate-500">
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">ID</th>
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Descrição</th>
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Categoria</th>
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Grupo Pai</th>
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-slate-650 dark:text-slate-300">
                {grupos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-500">
                      Nenhum grupo encontrado no banco local.
                    </td>
                  </tr>
                ) : (
                  grupos.map((grp) => (
                    <tr key={grp.id} className="border-b border-slate-100 dark:border-slate-850/50 hover:bg-slate-50 dark:hover:bg-slate-900/10">
                      <td className="py-2 px-3 font-mono">{grp.id}</td>
                      <td className="py-2 px-3 font-semibold text-slate-750 dark:text-slate-200">{grp.descricao}</td>
                      <td className="py-2 px-3 text-slate-500 dark:text-slate-400">{getCategoriaDesc(grp.categoria_id)}</td>
                      <td className="py-2 px-3 text-slate-550 dark:text-slate-505">{getGrupoParentDesc(grp.grupo_parent_id)}</td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => startEdit(grp)}
                          className="p-1 hover:text-blue-650 dark:hover:text-blue-400 rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit size={14} />
                        </button>
                      </td>
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
