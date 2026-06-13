import { useState, useEffect } from "react";
import { Button } from "@fluentui/react-components";
import { Edit, X, AlertTriangle } from "lucide-react";
import { ProductService } from "@/services/product.service";
import { ProdutoFabricante } from "@/types/products.entities";

export default function Fabricantes() {
  const [fabricantes, setFabricantes] = useState<ProdutoFabricante[]>([]);
  const [nome, setNome] = useState("");
  const [editingFabricante, setEditingFabricante] = useState<ProdutoFabricante | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

  const startEdit = (fab: ProdutoFabricante) => {
    setEditingFabricante(fab);
    setNome(fab.nome);
  };

  const handleCancel = () => {
    setEditingFabricante(null);
    setNome("");
  };

  const executarCadastro = async () => {
    setLoading(true);
    try {
      if (editingFabricante && editingFabricante.id) {
        await ProductService.atualizarFabricante(editingFabricante.id, nome);
      } else {
        await ProductService.criarFabricante(nome);
      }
      setNome("");
      setEditingFabricante(null);
      setShowConfirmModal(false);
      await carregarFabricantes();
    } catch (error) {
      console.error("Erro ao salvar fabricante:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    // Se for um novo cadastro e existirem fabricantes parecidos, exibe o modal
    if (!editingFabricante && fabricantesFiltrados.length > 0) {
      setShowConfirmModal(true);
      return;
    }

    await executarCadastro();
  };

  const fabricantesFiltrados = fabricantes.filter((fab) =>
    fab.nome.toLowerCase().includes(nome.toLowerCase())
  );

  return (
    <div className="flex-grow flex flex-col h-full min-h-0 overflow-hidden pr-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start max-w-6xl mx-auto w-full h-full min-h-0">
        {/* Formulário de Cadastro / Edição */}
        <div className="border border-slate-850 rounded-xl bg-[#0e1626]/20 p-5 space-y-4 w-full">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2">
            {editingFabricante ? "Editar Fabricante" : "Novo Fabricante"}
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
            <div className="flex gap-2">
              <Button type="submit" appearance="primary" disabled={loading}>
                {loading ? "Salvando..." : editingFabricante ? "Salvar Alterações" : "Salvar Fabricante"}
              </Button>
              {editingFabricante && (
                <Button type="button" appearance="secondary" onClick={handleCancel} disabled={loading}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Listagem */}
        <div className="border border-slate-850 rounded-xl bg-[#0e1626]/20 p-5 space-y-4 md:col-span-2 w-full h-full flex flex-col min-h-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-850/80 pb-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Fabricantes Cadastrados
            </h4>
          </div>
          <div className="flex-grow overflow-y-auto text-xs min-h-0 pr-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-slate-500 sticky top-0 bg-[#0c101d]">
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">ID</th>
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Nome</th>
                  <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px] text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {fabricantesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-slate-500">
                      Nenhum fabricante encontrado.
                    </td>
                  </tr>
                ) : (
                  fabricantesFiltrados.map((fab) => (
                    <tr key={fab.id} className="border-b border-slate-850/50 hover:bg-slate-900/10 text-slate-300">
                      <td className="py-2 px-3">{fab.id}</td>
                      <td className="py-2 px-3">{fab.nome}</td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => startEdit(fab)}
                          className="p-1 hover:text-blue-400 rounded text-slate-500 hover:bg-slate-800/40 transition-colors"
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

      {/* Modal de Confirmação para Fabricantes Semelhantes */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="border border-slate-800 rounded-xl bg-[#0b101d] p-6 space-y-6 max-w-md w-full shadow-2xl animate-scale-up">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <AlertTriangle size={20} />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Fabricante Semelhante Encontrado
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Já existem fabricantes cadastrados contendo <span className="text-blue-400 font-semibold">"{nome}"</span> na listagem. Tem certeza que deseja cadastrar este novo fabricante?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <Button
                appearance="secondary"
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                appearance="primary"
                onClick={executarCadastro}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Sim, Cadastrar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
