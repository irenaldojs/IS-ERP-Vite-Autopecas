import { useState, useEffect } from "react";
import { Button } from "@fluentui/react-components";
import { ProductService } from "@/services/product.service";
import { Produto, ProdutoGrupo, ProdutoFabricante, ProdutoAplicacao, Imagem } from "@/types/products.entities";
import { carroMontadoras } from "../../../../mocks/products.mock";

function AutocompleteSelect<T>({
  label,
  placeholder,
  items,
  getLabel,
  getValue,
  value,
  onChange,
  required
}: {
  label: string;
  placeholder: string;
  items: T[];
  getLabel: (item: T) => string;
  getValue: (item: T) => number;
  value: number | "";
  onChange: (value: number | "") => void;
  required?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    const selectedItem = items.find(item => getValue(item) === value);
    if (selectedItem) {
      setSearch(getLabel(selectedItem));
    } else {
      setSearch("");
    }
  }, [value, items]);

  const filteredItems = items.filter(item =>
    getLabel(item).toLowerCase().includes(search.toLowerCase())
  );

  // Reset highlight index when filter results change or search field is updated
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [search]);

  const handleSelect = (item: T) => {
    onChange(getValue(item));
    setSearch(getLabel(item));
    setIsOpen(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      const selectedItem = items.find(item => getValue(item) === value);
      if (selectedItem) {
        setSearch(getLabel(selectedItem));
      } else {
        setSearch("");
        onChange("");
      }
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(prev => 
        filteredItems.length > 0 ? (prev + 1) % filteredItems.length : -1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(prev => 
        filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : -1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
        e.preventDefault();
        handleSelect(filteredItems[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-1 relative">
      <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type="text"
          required={required}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            if (e.target.value === "") {
              onChange("");
            }
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-3 py-1.5 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm dark:shadow-none"
        />
        {isOpen && filteredItems.length > 0 && (
          <div className="absolute top-full left-0 z-50 w-full mt-1 max-h-48 overflow-y-auto bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl divide-y divide-slate-100 dark:divide-slate-900 scrollbar-thin">
            {filteredItems.map((item, index) => {
              const itemId = getValue(item);
              const isSelected = itemId === value;
              const isHighlighted = index === highlightedIndex;
              return (
                <button
                  key={itemId}
                  type="button"
                  onMouseDown={() => handleSelect(item)}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 ${
                    isSelected ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold" : ""
                  } ${
                    isHighlighted ? "bg-indigo-100/50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 outline-none border-l-2 border-indigo-500" : "text-slate-650 dark:text-slate-300"
                  }`}
                >
                  {getLabel(item)}
                </button>
              );
            })}
          </div>
        )}
        {isOpen && filteredItems.length === 0 && (
          <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-center text-[10px] text-slate-500 shadow-xl">
            Nenhuma sugestão encontrada
          </div>
        )}
      </div>
    </div>
  );
}


export default function CadastroProduto() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [grupos, setGrupos] = useState<ProdutoGrupo[]>([]);
  const [fabricantes, setFabricantes] = useState<ProdutoFabricante[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados do Formulário
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"dados" | "aplicacoes" | "imagens">("dados");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [descricaoComp, setDescricaoComp] = useState("");
  const [codigoOriginal, setCodigoOriginal] = useState("");
  const [referencia, setReferencia] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [grupoId, setGrupoId] = useState<number | "">("");
  const [marcaId, setMarcaId] = useState<number | "">("");
  
  // Fisico
  const [pesoLiquido, setPesoLiquido] = useState("");
  const [pesoBruto, setPesoBruto] = useState("");
  const [altura, setAltura] = useState("");
  const [largura, setLargura] = useState("");
  const [comprimento, setComprimento] = useState("");

  // Preço
  const [custoCompra, setCustoCompra] = useState("");
  const [custoImpostos, setCustoImpostos] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");

  // Estoque
  const [estoqueAtual, setEstoqueAtual] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");

  // Fiscal
  const [ncm, setNcm] = useState("");
  const [origem, setOrigem] = useState(0);

  // Aba Aplicações/Veículos
  const [aplicacaoListaId, setAplicacaoListaId] = useState<string>("");
  const [aplicacoes, setAplicacoes] = useState<ProdutoAplicacao[]>([]);
  const [veiculoMontadoraId, setVeiculoMontadoraId] = useState("");
  const [veiculoModelo, setVeiculoModelo] = useState("");
  const [veiculoAnoInicial, setVeiculoAnoInicial] = useState("");
  const [veiculoAnoFinal, setVeiculoAnoFinal] = useState("");
  const [veiculoDetalhes, setVeiculoDetalhes] = useState("");
  const [veiculoEditingIndex, setVeiculoEditingIndex] = useState<number | null>(null);

  // Aba Imagens
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [novaImagemUrl, setNovaImagemUrl] = useState("");

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [pData, gData, fData] = await Promise.all([
        ProductService.listarProdutos(search || undefined),
        ProductService.listarGrupos(),
        ProductService.listarFabricantes(),
      ]);
      setProdutos(pData);
      setGrupos(gData);
      setFabricantes(fData);
    } catch (error) {
      console.error("Erro ao carregar dados dos produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [search]);

  const limparFormulario = () => {
    setEditingId(null);
    setActiveTab("dados");
    setCodigo("");
    setDescricao("");
    setDescricaoComp("");
    setCodigoOriginal("");
    setReferencia("");
    setCodigoBarras("");
    setGrupoId("");
    setMarcaId("");
    setPesoLiquido("");
    setPesoBruto("");
    setAltura("");
    setLargura("");
    setComprimento("");
    setCustoCompra("");
    setCustoImpostos("");
    setPrecoVenda("");
    setEstoqueAtual("");
    setEstoqueMinimo("");
    setNcm("");
    setOrigem(0);

    // Limpar abas extras
    setAplicacaoListaId("");
    setAplicacoes([]);
    setVeiculoMontadoraId("");
    setVeiculoModelo("");
    setVeiculoAnoInicial("");
    setVeiculoAnoFinal("");
    setVeiculoDetalhes("");
    setVeiculoEditingIndex(null);
    setImagens([]);
    setNovaImagemUrl("");
  };

  const adicionarVeiculo = () => {
    if (!veiculoMontadoraId) {
      alert("Por favor, selecione a montadora.");
      return;
    }
    if (!veiculoModelo.trim()) {
      alert("Por favor, digite o modelo do veículo.");
      return;
    }
    const novoVeiculo: ProdutoAplicacao = {
      id: 0,
      lista_id: aplicacaoListaId ? Number(aplicacaoListaId) : 0,
      montadora_id: Number(veiculoMontadoraId),
      modelo: veiculoModelo.trim(),
      ano_inicial: veiculoAnoInicial ? Number(veiculoAnoInicial) : null,
      ano_final: veiculoAnoFinal ? Number(veiculoAnoFinal) : null,
      detalhes: veiculoDetalhes.trim() || null,
    };

    if (veiculoEditingIndex !== null) {
      const novasAplicacoes = [...aplicacoes];
      novasAplicacoes[veiculoEditingIndex] = novoVeiculo;
      setAplicacoes(novasAplicacoes);
      setVeiculoEditingIndex(null);
    } else {
      setAplicacoes([...aplicacoes, novoVeiculo]);
    }

    setVeiculoMontadoraId("");
    setVeiculoModelo("");
    setVeiculoAnoInicial("");
    setVeiculoAnoFinal("");
    setVeiculoDetalhes("");
  };

  const handleEditarVeiculo = (app: ProdutoAplicacao, index: number) => {
    setVeiculoMontadoraId(String(app.montadora_id));
    setVeiculoModelo(app.modelo);
    setVeiculoAnoInicial(app.ano_inicial ? String(app.ano_inicial) : "");
    setVeiculoAnoFinal(app.ano_final ? String(app.ano_final) : "");
    setVeiculoDetalhes(app.detalhes || "");
    setVeiculoEditingIndex(index);
  };

  const removerVeiculo = (index: number) => {
    setAplicacoes(aplicacoes.filter((_, i) => i !== index));
    if (veiculoEditingIndex === index) {
      setVeiculoEditingIndex(null);
      setVeiculoMontadoraId("");
      setVeiculoModelo("");
      setVeiculoAnoInicial("");
      setVeiculoAnoFinal("");
      setVeiculoDetalhes("");
    }
  };

  const adicionarImagem = () => {
    if (!novaImagemUrl.trim()) {
      alert("Por favor, insira a URL da imagem.");
      return;
    }
    const novaImg: Imagem = {
      id: 0,
      url_imagem: novaImagemUrl.trim(),
    };
    setImagens([...imagens, novaImg]);
    setNovaImagemUrl("");
  };

  const removerImagem = (index: number) => {
    setImagens(imagens.filter((_, i) => i !== index));
  };

  const handleEditar = async (id: number) => {
    try {
      setLoading(true);
      const p = await ProductService.buscarProduto(id);
      if (!p) {
        alert("Produto não encontrado.");
        return;
      }
      setEditingId(p.id ?? null);
      setActiveTab("dados");
      setCodigo(p.codigo || "");
      setDescricao(p.descricao || "");
      setDescricaoComp(p.descricao_complementar || "");
      setCodigoOriginal(p.codigo_original || "");
      setReferencia(p.referencia || "");
      setCodigoBarras(p.codigo_barras || "");
      setGrupoId(p.grupo_id || "");
      setMarcaId(p.marca_id || "");
      setPesoLiquido(p.peso_liquido !== null && p.peso_liquido !== undefined ? String(p.peso_liquido) : "");
      setPesoBruto(p.peso_bruto !== null && p.peso_bruto !== undefined ? String(p.peso_bruto) : "");
      setAltura(p.altura !== null && p.altura !== undefined ? String(p.altura) : "");
      setLargura(p.largura !== null && p.largura !== undefined ? String(p.largura) : "");
      setComprimento(p.comprimento !== null && p.comprimento !== undefined ? String(p.comprimento) : "");
      setCustoCompra(p.preco?.custo_compra !== undefined ? String(p.preco.custo_compra) : "");
      setCustoImpostos(p.preco?.custo_impostos !== undefined ? String(p.preco.custo_impostos) : "");
      setPrecoVenda(p.preco?.preco_venda !== undefined ? String(p.preco.preco_venda) : "");
      
      const mainEstoque = p.estoque?.[0];
      setEstoqueAtual(mainEstoque?.estoque_atual !== undefined ? String(mainEstoque.estoque_atual) : "");
      setEstoqueMinimo(mainEstoque?.estoque_minimo !== undefined ? String(mainEstoque.estoque_minimo) : "");
      
      setNcm(p.fiscal?.ncm || "");
      setOrigem(p.fiscal?.origem_mercadoria ?? 0);

      // Campos das Abas adicionais
      setAplicacaoListaId(p.aplicacao_lista_id ? String(p.aplicacao_lista_id) : "");
      setAplicacoes(p.aplicacoes || []);
      setImagens(p.imagens || []);
      
      setShowForm(true);
    } catch (error) {
      console.error("Erro ao buscar produto para edição:", error);
      alert("Erro ao carregar dados do produto.");
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo || !descricao || grupoId === "" || marcaId === "") {
      alert("Por favor, preencha os campos obrigatórios na aba 'Dados do Produto' (Código, Descrição, Grupo e Marca).");
      return;
    }

    const novoProduto: Produto = {
      id: editingId || 0,
      codigo,
      descricao,
      descricao_complementar: descricaoComp || null,
      grupo_id: Number(grupoId),
      marca_id: Number(marcaId),
      codigo_original: codigoOriginal,
      referencia: referencia || null,
      codigo_barras: codigoBarras || null,
      peso_liquido: pesoLiquido ? Number(pesoLiquido) : null,
      peso_bruto: pesoBruto ? Number(pesoBruto) : null,
      altura: altura ? Number(altura) : null,
      largura: largura ? Number(largura) : null,
      comprimento: comprimento ? Number(comprimento) : null,
      ativo: true,
      criado_em: new Date(),
      atualizado_em: new Date(),
      preco: {
        id: 0,
        produto_id: editingId || 0,
        custo_compra: custoCompra ? Number(custoCompra) : 0,
        custo_impostos: custoImpostos ? Number(custoImpostos) : 0,
        preco_venda: precoVenda ? Number(precoVenda) : 0,
        atualizado_em: new Date(),
      },
      estoque: [
        {
          id: 0,
          produto_id: editingId || 0,
          filial_id: 1, // Filial Padrão
          estoque_atual: estoqueAtual ? Number(estoqueAtual) : 0,
          estoque_reservado: 0,
          estoque_disponivel: estoqueAtual ? Number(estoqueAtual) : 0,
          estoque_minimo: estoqueMinimo ? Number(estoqueMinimo) : 0,
          controla_estoque: true,
          atualizado_em: new Date(),
        }
      ],
      fiscal: {
        id: 0,
        produto_id: editingId || 0,
        ncm: ncm || "00000000",
        origem_mercadoria: origem,
        criado_em: new Date(),
        atualizado_em: new Date(),
      },
      aplicacao_lista_id: aplicacaoListaId ? Number(aplicacaoListaId) : null,
      aplicacoes: aplicacoes.length > 0 ? aplicacoes : null,
      imagens: imagens.length > 0 ? imagens : null,
    };

    try {
      if (editingId) {
        await ProductService.atualizarProduto(novoProduto);
      } else {
        await ProductService.criarProduto(novoProduto);
      }
      setShowForm(false);
      limparFormulario();
      await carregarDados();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar o produto no SQLite. Verifique os logs.");
    }
  };

  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
      <div className="max-w-7xl mx-auto w-full space-y-4">
        {!showForm && (
          <div className="flex items-center justify-between gap-4 border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 p-4 shadow-sm dark:shadow-none">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por código, descrição ou original..."
                className="w-full px-3 py-1.5 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 text-xs shadow-sm dark:shadow-none"
              />
            </div>
            <Button
              appearance="primary"
              onClick={() => {
                setShowForm(true);
              }}
            >
              Novo Produto
            </Button>
          </div>
        )}

        {showForm ? (
          /* Formulário de Cadastro */
          <div className="border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 p-4 space-y-3 shadow-sm dark:shadow-none">
            <form onSubmit={handleSalvar} className="space-y-3 text-xs">
              {/* Navegação de Abas e Botão Voltar */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 mb-2 gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("dados")}
                    className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                      activeTab === "dados"
                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                        : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
                    }`}
                  >
                    Dados do Produto
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("aplicacoes")}
                    className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                      activeTab === "aplicacoes"
                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                        : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
                    }`}
                  >
                    Aplicações / Veículos ({aplicacoes.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("imagens")}
                    className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                      activeTab === "imagens"
                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                        : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
                    }`}
                  >
                    Imagens ({imagens.length})
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    limparFormulario();
                    setShowForm(false);
                  }}
                  className="px-2 py-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 font-bold text-xs"
                  title="Voltar à Listagem"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  <span>Voltar</span>
                </button>
              </div>

              {/* Aba: Dados do Produto */}
              {activeTab === "dados" && (
                <div className="space-y-3">
                  {/* Informações Básicas */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">SKU / Código Interno *</label>
                      <input
                        type="text"
                        required
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        className="w-full px-2.5 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-880 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
                        placeholder="Ex: FLT-101"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Descrição *</label>
                      <input
                        type="text"
                        required
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="w-full px-2.5 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-880 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
                        placeholder="Ex: Filtro de Combustível Injeção"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Código Original *</label>
                      <input
                        type="text"
                        required
                        value={codigoOriginal}
                        onChange={(e) => setCodigoOriginal(e.target.value)}
                        className="w-full px-2.5 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-880 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
                        placeholder="Ex: 5U0127177B"
                      />
                    </div>
                  </div>

                  {/* Relações e Referências */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <AutocompleteSelect
                      label="Grupo *"
                      placeholder="Selecione ou digite um Grupo"
                      items={grupos}
                      getLabel={(g) => g.descricao || ""}
                      getValue={(g) => g.id}
                      value={grupoId}
                      onChange={setGrupoId}
                      required
                    />
                    <AutocompleteSelect
                      label="Fabricante / Marca *"
                      placeholder="Selecione ou digite uma Marca"
                      items={fabricantes}
                      getLabel={(f) => f.nome}
                      getValue={(f) => f.id}
                      value={marcaId}
                      onChange={setMarcaId}
                      required
                    />
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Código Referência</label>
                      <input
                        type="text"
                        value={referencia}
                        onChange={(e) => setReferencia(e.target.value)}
                        className="w-full px-2.5 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-880 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
                        placeholder="Ex: GI04/7"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Código Barras (EAN)</label>
                      <input
                        type="text"
                        value={codigoBarras}
                        onChange={(e) => setCodigoBarras(e.target.value.replace(/\D/g, ""))}
                        className="w-full px-2.5 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-880 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
                        placeholder="Ex: 789000000000"
                      />
                    </div>
                  </div>

                  {/* Financeiro / Custos */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-slate-200 dark:border-slate-850 pt-2.5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Custo Compra (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={custoCompra}
                        onChange={(e) => setCustoCompra(e.target.value)}
                        className="w-full px-2.5 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-880 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Custo Impostos (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={custoImpostos}
                        onChange={(e) => setCustoImpostos(e.target.value)}
                        className="w-full px-2.5 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-880 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Preço de Venda (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={precoVenda}
                        onChange={(e) => setPrecoVenda(e.target.value)}
                        className="w-full px-2.5 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-880 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Estoque e Fiscal */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 border-t border-slate-200 dark:border-slate-850 pt-2.5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Estoque Atual Inicial</label>
                      <input
                        type="number"
                        value={estoqueAtual}
                        onChange={(e) => setEstoqueAtual(e.target.value)}
                        className="w-full px-2.5 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-880 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Estoque Mínimo</label>
                      <input
                        type="number"
                        value={estoqueMinimo}
                        onChange={(e) => setEstoqueMinimo(e.target.value)}
                        className="w-full px-2.5 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-880 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">NCM Fiscal</label>
                      <input
                        type="text"
                        value={ncm}
                        onChange={(e) => setNcm(e.target.value.replace(/\D/g, ""))}
                        className="w-full px-2.5 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-880 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
                        placeholder="Ex: 84212300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Origem</label>
                      <select
                        value={origem}
                        onChange={(e) => setOrigem(Number(e.target.value))}
                        className="w-full px-2.5 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-880 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none cursor-pointer"
                      >
                        <option value={0}>0 - Nacional</option>
                        <option value={1}>1 - Estrangeira (Importação direta)</option>
                        <option value={2}>2 - Estrangeira (Mercado interno)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Aba: Aplicações / Veículos */}
              {activeTab === "aplicacoes" && (
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-900/20 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs whitespace-nowrap">
                      Vincular a uma Lista de Aplicação:
                    </span>
                    <input
                      type="text"
                      value={aplicacaoListaId}
                      onChange={(e) => setAplicacaoListaId(e.target.value.replace(/\D/g, ""))}
                      className="w-24 px-2 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-80 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none text-xs"
                      placeholder="Ex: 5 (Opcional)"
                    />
                    <span className="text-[10px] text-slate-500">
                      Deixe vazio para criar uma nova lista automaticamente ao salvar o produto com veículos compatíveis.
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/20 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800 space-y-2.5">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-xs">Adicionar Veículo Compatível</h4>
                    <div className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-12 md:col-span-2">
                        <AutocompleteSelect
                          label="Montadora *"
                          placeholder="Montadora..."
                          items={carroMontadoras}
                          getLabel={(m) => m.nome}
                          getValue={(m) => m.id}
                          value={veiculoMontadoraId !== "" ? Number(veiculoMontadoraId) : ""}
                          onChange={(val) => setVeiculoMontadoraId(val !== "" ? String(val) : "")}
                          required
                        />
                      </div>
                      <div className="col-span-12 md:col-span-3 space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Modelo *</label>
                        <input
                          type="text"
                          value={veiculoModelo}
                          onChange={(e) => setVeiculoModelo(e.target.value)}
                          className="w-full px-2 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-80 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm text-xs"
                          placeholder="Ex: Gol 1.0 8V"
                        />
                      </div>
                      <div className="col-span-6 md:col-span-1 space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Ano Inic.</label>
                        <input
                          type="text"
                          maxLength={4}
                          value={veiculoAnoInicial}
                          onChange={(e) => setVeiculoAnoInicial(e.target.value.replace(/\D/g, ""))}
                          className="w-full px-2 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-80 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm text-xs"
                          placeholder="2010"
                        />
                      </div>
                      <div className="col-span-6 md:col-span-1 space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Ano Final</label>
                        <input
                          type="text"
                          maxLength={4}
                          value={veiculoAnoFinal}
                          onChange={(e) => setVeiculoAnoFinal(e.target.value.replace(/\D/g, ""))}
                          className="w-full px-2 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-80 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm text-xs"
                          placeholder="2015"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-4 space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Detalhes</label>
                        <input
                          type="text"
                          value={veiculoDetalhes}
                          onChange={(e) => setVeiculoDetalhes(e.target.value)}
                          className="w-full px-2 py-1 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-80 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm text-xs"
                          placeholder="Ex: Motores EA111, 8V/16V, Turbo, Aspirado"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-1 flex gap-1">
                        <button
                          type="button"
                          onClick={adicionarVeiculo}
                          className="flex-1 px-1.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[10px] shadow-sm transition-colors cursor-pointer text-center whitespace-nowrap"
                        >
                          {veiculoEditingIndex !== null ? "Salvar" : "Adicionar"}
                        </button>
                        {veiculoEditingIndex !== null && (
                          <button
                            type="button"
                            onClick={() => {
                              setVeiculoEditingIndex(null);
                              setVeiculoMontadoraId("");
                              setVeiculoModelo("");
                              setVeiculoAnoInicial("");
                              setVeiculoAnoFinal("");
                              setVeiculoDetalhes("");
                            }}
                            className="flex-1 px-1.5 py-1 bg-slate-200 hover:bg-slate-350 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold text-[10px] shadow-sm transition-colors cursor-pointer text-center"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lista de veículos vinculados */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-xs">Veículos Vinculados ({aplicacoes.length})</h4>
                    {aplicacoes.length === 0 ? (
                      <div className="text-center p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-550 text-[10px]">
                        Nenhum veículo adicionado.
                      </div>
                    ) : (
                      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-y-auto max-h-52 scrollbar-thin">
                        <table className="w-full text-left border-collapse text-xs table-auto">
                          <thead className="sticky top-0 bg-slate-50 dark:bg-[#070a13] z-10 shadow-sm">
                            <tr className="border-b border-slate-200 dark:border-slate-80 text-slate-550 dark:text-slate-500">
                              <th className="py-1.5 px-2.5 font-semibold text-[9px] uppercase tracking-wider">Montadora</th>
                              <th className="py-1.5 px-2.5 font-semibold text-[9px] uppercase tracking-wider">Modelo</th>
                              <th className="py-1.5 px-2.5 font-semibold text-[9px] uppercase tracking-wider">Ano Inicial</th>
                              <th className="py-1.5 px-2.5 font-semibold text-[9px] uppercase tracking-wider">Ano Final</th>
                              <th className="py-1.5 px-2.5 font-semibold text-[9px] uppercase tracking-wider">Detalhes</th>
                              <th className="py-1.5 px-2.5 font-semibold text-[9px] uppercase tracking-wider text-right">Ação</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-80/30">
                            {aplicacoes.map((app, index) => (
                              <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-900/10">
                                <td className="py-1.5 px-2.5 text-slate-700 dark:text-slate-300 font-semibold">
                                  {carroMontadoras.find((m) => m.id === app.montadora_id)?.nome || `ID: ${app.montadora_id}`}
                                </td>
                                <td className="py-1.5 px-2.5 font-medium text-slate-700 dark:text-slate-300">{app.modelo}</td>
                                <td className="py-1.5 px-2.5 text-slate-550 dark:text-slate-400">{app.ano_inicial || "-"}</td>
                                <td className="py-1.5 px-2.5 text-slate-550 dark:text-slate-400">{app.ano_final || "-"}</td>
                                <td className="py-1.5 px-2.5 text-slate-550 dark:text-slate-400">{app.detalhes || "-"}</td>
                                <td className="py-1.5 px-2.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleEditarVeiculo(app, index)}
                                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-500 font-bold px-1.5 py-0.5 cursor-pointer mr-1"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removerVeiculo(index)}
                                    className="text-rose-600 hover:text-rose-500 dark:text-rose-500 font-bold px-1.5 py-0.5 cursor-pointer"
                                  >
                                    Remover
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Aba: Imagens */}
              {activeTab === "imagens" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-900/20 p-4 rounded-lg border border-slate-200/60 dark:border-slate-800 space-y-4">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-xs">Adicionar Imagem</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">URL da Imagem</label>
                        <input
                          type="text"
                          value={novaImagemUrl}
                          onChange={(e) => setNovaImagemUrl(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-80 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm"
                          placeholder="https://exemplo.com/imagem.png"
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={adicionarImagem}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs shadow-sm transition-colors cursor-pointer"
                        >
                          Adicionar URL
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Imagens Vinculadas */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-xs">Imagens Vinculadas ({imagens.length})</h4>
                    {imagens.length === 0 ? (
                      <div className="text-center p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-550 text-[10px]">
                        Nenhuma imagem vinculada.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {imagens.map((img, index) => (
                          <div key={index} className="relative group border border-slate-200 dark:border-slate-80 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 p-2 flex flex-col items-center">
                            <img
                              src={img.url_imagem}
                              alt={`Produto ${index + 1}`}
                              className="h-24 object-contain mb-2 rounded bg-white w-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/150x100?text=Sem+Imagem";
                              }}
                            />
                            <div className="w-full text-center truncate text-[9px] text-slate-450 dark:text-slate-500 mb-1 px-1" title={img.url_imagem}>
                              {img.url_imagem}
                            </div>
                            <button
                              type="button"
                              onClick={() => removerImagem(index)}
                              className="text-[10px] text-rose-600 hover:text-rose-500 dark:text-rose-500 font-bold py-1 px-2 border border-rose-200 dark:border-rose-950/40 rounded bg-rose-50/50 dark:bg-rose-950/10 cursor-pointer"
                            >
                              Remover
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    limparFormulario();
                    setShowForm(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" appearance="primary">
                  {editingId ? "Atualizar Produto no SQLite" : "Salvar Produto no SQLite"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Listagem dos Produtos */
          <div className="border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 p-5 space-y-4 shadow-sm dark:shadow-none">
            <h3 className="text-xs font-bold text-slate-750 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-850/80 pb-2">
              Autopeças no Banco Local
            </h3>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-850 text-slate-550 dark:text-slate-500">
                    <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Código</th>
                    <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Descrição</th>
                    <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Marca</th>
                    <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Grupo</th>
                    <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Original</th>
                    <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Estoque</th>
                    <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Preço Venda</th>
                    <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px] text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-slate-650 dark:text-slate-350">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        Buscando produtos no banco local...
                      </td>
                    </tr>
                  ) : produtos.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        Nenhum produto correspondente encontrado no banco local SQLite.
                      </td>
                    </tr>
                  ) : (
                    produtos.map((p) => {
                      const estoqueTotal = p.estoque?.reduce((acc, curr) => acc + curr.estoque_atual, 0) ?? 0;
                      return (
                        <tr key={p.id} className="border-b border-slate-100 dark:border-slate-850/50 hover:bg-slate-50 dark:hover:bg-slate-900/10">
                          <td className="py-3 px-3 font-semibold text-indigo-600 dark:text-indigo-400">{p.codigo}</td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-700 dark:text-slate-200">{p.descricao}</div>
                            {p.descricao_complementar && (
                              <div className="text-[10px] text-slate-450 dark:text-slate-500">{p.descricao_complementar}</div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{p.marca_nome || "-"}</td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{p.grupo_descricao || "-"}</td>
                          <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-500">{p.codigo_original}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              estoqueTotal > 0 
                                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30" 
                                : "bg-rose-50 dark:bg-rose-950/20 text-rose-650 dark:text-rose-450 border border-rose-200 dark:border-rose-900/30"
                            }`}>
                              {estoqueTotal} un
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                            {p.preco?.preco_venda ? `R$ ${p.preco.preco_venda.toFixed(2)}` : "R$ 0,00"}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => p.id && handleEditar(p.id)}
                              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-500 dark:hover:text-indigo-400 font-bold px-2 py-1 transition-colors cursor-pointer"
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
