import { useState, useEffect } from "react";
import { Button } from "@fluentui/react-components";
import { ProductService } from "@/services/product.service";
import { Produto, ProdutoGrupo, ProdutoFabricante } from "@/types/products.entities";

export default function CadastroProduto() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [grupos, setGrupos] = useState<ProdutoGrupo[]>([]);
  const [fabricantes, setFabricantes] = useState<ProdutoFabricante[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados do Formulário
  const [showForm, setShowForm] = useState(false);
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

  const handleDeletar = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto do banco local?")) {
      try {
        await ProductService.deletarProduto(id);
        await carregarDados();
      } catch (error) {
        console.error("Erro ao deletar produto:", error);
      }
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo || !descricao || grupoId === "" || marcaId === "") {
      alert("Por favor, preencha os campos obrigatórios (Código, Descrição, Grupo e Marca).");
      return;
    }

    const novoProduto: Produto = {
      id: 0,
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
        produto_id: 0,
        custo_compra: custoCompra ? Number(custoCompra) : 0,
        custo_impostos: custoImpostos ? Number(custoImpostos) : 0,
        preco_venda: precoVenda ? Number(precoVenda) : 0,
        atualizado_em: new Date(),
      },
      estoque: [
        {
          id: 0,
          produto_id: 0,
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
        produto_id: 0,
        ncm: ncm || "00000000",
        origem_mercadoria: origem,
        criado_em: new Date(),
        atualizado_em: new Date(),
      }
    };

    try {
      await ProductService.criarProduto(novoProduto);
      setShowForm(false);
      
      // Limpar formulário
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

      await carregarDados();
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert("Erro ao salvar o produto no SQLite. Verifique os logs.");
    }
  };

  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
      <div className="max-w-7xl mx-auto w-full space-y-4">
        {/* Barra superior de ações */}
        <div className="flex items-center justify-between gap-4 border border-slate-850 rounded-xl bg-[#0e1626]/20 p-4">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código, descrição ou original..."
              className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none text-xs"
            />
          </div>
          <Button
            appearance="primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Voltar à Listagem" : "Novo Produto"}
          </Button>
        </div>

        {showForm ? (
          /* Formulário de Cadastro */
          <div className="border border-slate-850 rounded-xl bg-[#0e1626]/20 p-5 space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2">
              Cadastrar Nova Autopeça no Banco Local
            </h3>

            <form onSubmit={handleSalvar} className="space-y-4 text-xs">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">SKU / Código Interno *</label>
                  <input
                    type="text"
                    required
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                    placeholder="Ex: FLT-101"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Descrição *</label>
                  <input
                    type="text"
                    required
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                    placeholder="Ex: Filtro de Combustível Injeção"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Código Original *</label>
                  <input
                    type="text"
                    required
                    value={codigoOriginal}
                    onChange={(e) => setCodigoOriginal(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                    placeholder="Ex: 5U0127177B"
                  />
                </div>
              </div>

              {/* Relações e Referências */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Grupo *</label>
                  <select
                    required
                    value={grupoId}
                    onChange={(e) => setGrupoId(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                  >
                    <option value="">Selecione um Grupo</option>
                    {grupos.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.descricao}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Fabricante / Marca *</label>
                  <select
                    required
                    value={marcaId}
                    onChange={(e) => setMarcaId(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                  >
                    <option value="">Selecione uma Marca</option>
                    {fabricantes.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Código Referência</label>
                  <input
                    type="text"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                    placeholder="Ex: GI04/7"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Código Barras (EAN)</label>
                  <input
                    type="text"
                    value={codigoBarras}
                    onChange={(e) => setCodigoBarras(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                    placeholder="Ex: 789000000000"
                  />
                </div>
              </div>

              {/* Financeiro / Custos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-850 pt-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Custo Compra (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={custoCompra}
                    onChange={(e) => setCustoCompra(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Custo Impostos (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={custoImpostos}
                    onChange={(e) => setCustoImpostos(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={precoVenda}
                    onChange={(e) => setPrecoVenda(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Estoque e Fiscal */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-slate-850 pt-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Estoque Atual Inicial</label>
                  <input
                    type="number"
                    value={estoqueAtual}
                    onChange={(e) => setEstoqueAtual(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Estoque Mínimo</label>
                  <input
                    type="number"
                    value={estoqueMinimo}
                    onChange={(e) => setEstoqueMinimo(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">NCM Fiscal</label>
                  <input
                    type="text"
                    value={ncm}
                    onChange={(e) => setNcm(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                    placeholder="Ex: 84212300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Origem</label>
                  <select
                    value={origem}
                    onChange={(e) => setOrigem(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                  >
                    <option value={0}>0 - Nacional</option>
                    <option value={1}>1 - Estrangeira (Importação direta)</option>
                    <option value={2}>2 - Estrangeira (Mercado interno)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" appearance="primary">
                  Salvar Produto no SQLite
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Listagem dos Produtos */
          <div className="border border-slate-850 rounded-xl bg-[#0e1626]/20 p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2">
              Autopeças no Banco Local
            </h3>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-500">
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
                <tbody>
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
                        <tr key={p.id} className="border-b border-slate-850/50 hover:bg-slate-900/10 text-slate-300">
                          <td className="py-3 px-3 font-semibold text-indigo-400">{p.codigo}</td>
                          <td className="py-3 px-3">
                            <div>{p.descricao}</div>
                            {p.descricao_complementar && (
                              <div className="text-[10px] text-slate-500">{p.descricao_complementar}</div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-400">{p.marca_nome || "-"}</td>
                          <td className="py-3 px-3 text-slate-400">{p.grupo_descricao || "-"}</td>
                          <td className="py-3 px-3 font-mono text-slate-500">{p.codigo_original}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              estoqueTotal > 0 ? "bg-emerald-950/20 text-emerald-450 border border-emerald-900/30" : "bg-rose-950/20 text-rose-450 border border-rose-900/30"
                            }`}>
                              {estoqueTotal} un
                            </span>
                          </td>
                          <td className="py-3 px-3 font-medium text-emerald-400">
                            {p.preco?.preco_venda ? `R$ ${p.preco.preco_venda.toFixed(2)}` : "R$ 0,00"}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => p.id && handleDeletar(p.id)}
                              className="text-rose-500 hover:text-rose-400 font-bold px-2 py-1 transition-colors cursor-pointer"
                            >
                              Excluir
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
