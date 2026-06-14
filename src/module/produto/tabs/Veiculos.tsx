import { useState, useEffect } from "react";
import { Button } from "@fluentui/react-components";
import { Edit, Trash } from "lucide-react";
import { ProductService } from "@/services/product.service";
import { CarroMontadora, CarroModelo } from "@/types/products.entities";
import AutocompleteInput from "@/components/ui/AutocompleteInput";

export default function Veiculos() {
  // Montadoras (Brands)
  const [montadoras, setMontadoras] = useState<CarroMontadora[]>([]);
  const [nomeMontadora, setNomeMontadora] = useState("");
  const [editingMontadora, setEditingMontadora] = useState<CarroMontadora | null>(null);
  const [loadingMontadora, setLoadingMontadora] = useState(false);

  // Modelos (Models)
  const [modelos, setModelos] = useState<CarroModelo[]>([]);
  const [nomeModelo, setNomeModelo] = useState("");
  const [selectedMontadoraId, setSelectedMontadoraId] = useState<number | "">("");
  const [filtroListModelos, setFiltroListModelos] = useState("");
  const [editingModelo, setEditingModelo] = useState<CarroModelo | null>(null);
  const [loadingModelo, setLoadingModelo] = useState(false);

  // Initial Load
  const carregarDados = async () => {
    try {
      const dataMontadoras = await ProductService.listarMontadoras();
      setMontadoras(dataMontadoras);

      const dataModelos = await ProductService.listarModelos();
      setModelos(dataModelos);
    } catch (error) {
      console.error("Erro ao carregar dados de veículos:", error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Montadora Actions
  const startEditMontadora = (montadora: CarroMontadora) => {
    setEditingMontadora(montadora);
    setNomeMontadora(montadora.nome);
  };

  const handleCancelMontadora = () => {
    setEditingMontadora(null);
    setNomeMontadora("");
  };

  // Live filtering for Montadoras list based on the name input
  const montadorasFiltradas = montadoras.filter((m) =>
    m.nome.toLowerCase().includes(nomeMontadora.toLowerCase().trim())
  );

  const handleSubmitMontadora = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryName = nomeMontadora.trim();
    if (!queryName) return;

    // Validation 1: If typing a name filters and matches > 1 result, block saving
    const matches = montadoras.filter((m) =>
      m.nome.toLowerCase().includes(queryName.toLowerCase())
    );
    if (matches.length > 1) {
      alert("Filtro com mais de 1 correspondência no banco. Refine o nome da marca para salvar.");
      return;
    }

    // Validation 2: Exact duplicate check
    const exactMatch = montadoras.find(
      (m) => m.nome.toLowerCase() === queryName.toLowerCase()
    );
    if (exactMatch && (!editingMontadora || exactMatch.id !== editingMontadora.id)) {
      alert("Esta marca já está cadastrada!");
      return;
    }

    setLoadingMontadora(true);
    try {
      if (editingMontadora && editingMontadora.id) {
        await ProductService.atualizarMontadora(editingMontadora.id, queryName);
      } else {
        await ProductService.criarMontadora(queryName);
      }
      setNomeMontadora("");
      setEditingMontadora(null);
      await carregarDados();
    } catch (error) {
      console.error("Erro ao salvar montadora:", error);
    } finally {
      setLoadingMontadora(false);
    }
  };

  const handleDeleteMontadora = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta montadora? Todos os modelos vinculados também serão excluídos.")) return;
    try {
      await ProductService.deletarMontadora(id);
      await carregarDados();
    } catch (error) {
      console.error("Erro ao excluir montadora:", error);
    }
  };

  // Modelo Actions
  const startEditModelo = (modelo: CarroModelo) => {
    setEditingModelo(modelo);
    setNomeModelo(modelo.nome);
    setSelectedMontadoraId(modelo.montadora_id);
  };

  const handleCancelModelo = () => {
    setEditingModelo(null);
    setNomeModelo("");
    setSelectedMontadoraId("");
  };



  // Live filter for the Models list
  const modelosFiltrados = modelos.filter((m) => {
    const term = filtroListModelos.toLowerCase().trim();
    if (!term) return true;
    return (
      m.nome.toLowerCase().includes(term) ||
      (m as any).montadora_nome?.toLowerCase().includes(term)
    );
  });

  const handleSubmitModelo = async (e: React.FormEvent) => {
    e.preventDefault();
    const modelName = nomeModelo.trim();
    if (!modelName || !selectedMontadoraId) return;

    // Validation: block saving only if this exact combination of montadora + model already exists
    const duplicate = modelos.find(
      (m) =>
        m.montadora_id === Number(selectedMontadoraId) &&
        m.nome.toLowerCase() === modelName.toLowerCase()
    );
    if (duplicate && (!editingModelo || duplicate.id !== editingModelo.id)) {
      alert("Este modelo já está cadastrado para a montadora selecionada!");
      return;
    }

    setLoadingModelo(true);
    try {
      if (editingModelo && editingModelo.id) {
        await ProductService.atualizarModelo(editingModelo.id, Number(selectedMontadoraId), modelName);
      } else {
        await ProductService.criarModelo(Number(selectedMontadoraId), modelName);
      }
      setNomeModelo("");
      setSelectedMontadoraId("");
      setEditingModelo(null);
      await carregarDados();
    } catch (error) {
      console.error("Erro ao salvar modelo:", error);
    } finally {
      setLoadingModelo(false);
    }
  };

  const handleDeleteModelo = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este modelo?")) return;
    try {
      await ProductService.deletarModelo(id);
      await carregarDados();
    } catch (error) {
      console.error("Erro ao excluir modelo:", error);
    }
  };

  return (
    <div className="flex-grow flex flex-col space-y-6 h-full min-h-0 overflow-y-auto pr-1">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start max-w-7xl mx-auto w-full">
        
        {/* Seção de Montadoras */}
        <div className="space-y-4">
          {/* Formulário Montadora */}
          <div className="border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 p-5 space-y-4 w-full shadow-sm dark:shadow-none">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-850/80 pb-2">
              {editingMontadora ? "Editar Marca/Montadora" : "Nova Marca/Montadora"}
            </h4>
            <form onSubmit={handleSubmitMontadora} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  Nome da Marca (Filtra a lista abaixo automaticamente)
                </label>
                <input
                  type="text"
                  value={nomeMontadora}
                  onChange={(e) => setNomeMontadora(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
                  placeholder="Ex: Chevrolet"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" appearance="primary" disabled={loadingMontadora}>
                  {loadingMontadora ? "Salvando..." : editingMontadora ? "Salvar Alterações" : "Salvar Marca"}
                </Button>
                {editingMontadora && (
                  <Button type="button" appearance="secondary" onClick={handleCancelMontadora} disabled={loadingMontadora}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Listagem Montadoras */}
          <div className="border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 p-5 space-y-4 w-full shadow-sm dark:shadow-none flex flex-col">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-850/80 pb-2">
              Marcas / Montadoras
            </h4>
            <div className="overflow-x-auto text-xs max-h-[300px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-850 text-slate-500 sticky top-0 bg-white dark:bg-[#0b0f19]">
                    <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">ID</th>
                    <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Nome</th>
                    <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px] text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-slate-650 dark:text-slate-300">
                  {montadorasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-slate-500">
                        Nenhuma marca correspondente ao filtro.
                      </td>
                    </tr>
                  ) : (
                    montadorasFiltradas.map((mon) => (
                      <tr key={mon.id} className="border-b border-slate-100 dark:border-slate-850/50 hover:bg-slate-50 dark:hover:bg-slate-900/10">
                        <td className="py-2 px-3 font-mono">{mon.id}</td>
                        <td className="py-2 px-3 font-semibold text-slate-700 dark:text-slate-200">{mon.nome}</td>
                        <td className="py-2 px-3 text-right space-x-1">
                          <button
                            onClick={() => startEditMontadora(mon)}
                            className="p-1 hover:text-blue-600 dark:hover:text-blue-400 rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteMontadora(mon.id)}
                            className="p-1 hover:text-red-650 dark:hover:text-red-400 rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                            title="Excluir"
                          >
                            <Trash size={14} />
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

        {/* Seção de Modelos */}
        <div className="space-y-4">
          {/* Formulário Modelo */}
          <div className="border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 p-5 space-y-4 w-full shadow-sm dark:shadow-none">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-850/80 pb-2">
              {editingModelo ? "Editar Modelo" : "Novo Modelo de Veículo"}
            </h4>
            <form onSubmit={handleSubmitModelo} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <AutocompleteInput
                    label="Marca / Montadora"
                    placeholder="Selecione ou busque a marca..."
                    items={montadoras.map((mon) => ({
                      id: mon.id!.toString(),
                      label: mon.nome,
                    }))}
                    selectedValue={selectedMontadoraId ? selectedMontadoraId.toString() : ""}
                    onSelect={(id) => setSelectedMontadoraId(Number(id))}
                    onClear={() => setSelectedMontadoraId("")}
                  />
                </div>
                <div className="space-y-1 flex flex-col justify-end">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    Nome do Modelo
                  </label>
                  <input
                    type="text"
                    value={nomeModelo}
                    onChange={(e) => setNomeModelo(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none h-[32px]"
                    placeholder="Ex: Onix"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" appearance="primary" disabled={loadingModelo}>
                  {loadingModelo ? "Salvando..." : editingModelo ? "Salvar Alterações" : "Salvar Modelo"}
                </Button>
                {editingModelo && (
                  <Button type="button" appearance="secondary" onClick={handleCancelModelo} disabled={loadingModelo}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Listagem Modelos */}
          <div className="border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 p-5 space-y-4 w-full shadow-sm dark:shadow-none flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850/80 pb-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">
                Modelos de Veículos
              </h4>
              <input
                type="text"
                placeholder="Filtrar tabela..."
                value={filtroListModelos}
                onChange={(e) => setFiltroListModelos(e.target.value)}
                className="px-2.5 py-0.5 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-750 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none text-[11px] w-40"
              />
            </div>
            <div className="overflow-x-auto text-xs max-h-[300px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-850 text-slate-500 sticky top-0 bg-white dark:bg-[#0b0f19]">
                    <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">ID</th>
                    <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Marca</th>
                    <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Modelo</th>
                    <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px] text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-slate-650 dark:text-slate-300">
                  {modelosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-500">
                        Nenhum modelo encontrado correspondente ao filtro.
                      </td>
                    </tr>
                  ) : (
                    modelosFiltrados.map((mod) => (
                      <tr key={mod.id} className="border-b border-slate-100 dark:border-slate-850/50 hover:bg-slate-50 dark:hover:bg-slate-900/10">
                        <td className="py-2 px-3 font-mono">{mod.id}</td>
                        <td className="py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">{(mod as any).montadora_nome || `ID: ${mod.montadora_id}`}</td>
                        <td className="py-2 px-3 font-semibold text-slate-700 dark:text-slate-200">{mod.nome}</td>
                        <td className="py-2 px-3 text-right space-x-1">
                          <button
                            onClick={() => startEditModelo(mod)}
                            className="p-1 hover:text-blue-600 dark:hover:text-blue-400 rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteModelo(mod.id)}
                            className="p-1 hover:text-red-650 dark:hover:text-red-400 rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                            title="Excluir"
                          >
                            <Trash size={14} />
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
    </div>
  );
}
