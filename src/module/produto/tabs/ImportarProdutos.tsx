import { useState, useRef } from "react";
import { Button } from "@fluentui/react-components";
import { 
  FileUp, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Sparkles, 
  Plus, 
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Archive,
  Tag
} from "lucide-react";
import { ProductService } from "@/services/product.service";
import { 
  Produto, 
  ProdutoAplicacao,
  ProdutoReferencia,
  Imagem
} from "@/types/products.entities";

interface ProcessedImportProduct {
  rawData: any;
  isValid: boolean;
  errors: string[];
  codigo: string;
  descricao: string;
  categoriaDescricao: string;
  grupoDescricao: string;
  marcaNome: string;
  precoVenda: number;
  estoqueAtual: number;
  categoriaAction: "use" | "create" | "missing";
  grupoAction: "use" | "create" | "missing";
  marcaAction: "use" | "create" | "missing";
  hasNewEntities: boolean;
  expanded?: boolean;
}

function sanitizeJsonText(text: string): string {
  let insideString = false;
  let escaped = false;
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' && !escaped) {
      insideString = !insideString;
    }
    
    if (insideString) {
      if (char === '\n' || char === '\r') {
        result += " "; // replace literal newline with space
        escaped = false;
        continue;
      }
    }
    
    if (char === '\\') {
      escaped = !escaped;
    } else {
      escaped = false;
    }
    result += char;
  }
  return result;
}

export default function ImportarProdutos() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processedProducts, setProcessedProducts] = useState<ProcessedImportProduct[]>([]);
  const [loadingFile, setLoadingFile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, statusText: "" });
  const [importLogs, setImportLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estatísticas da importação
  const stats = {
    total: processedProducts.length,
    valid: processedProducts.filter(p => p.isValid).length,
    invalid: processedProducts.filter(p => !p.isValid).length,
    newCategories: new Set(processedProducts.filter(p => p.categoriaAction === "create").map(p => p.categoriaDescricao.trim().toLowerCase())).size,
    newGroups: new Set(processedProducts.filter(p => p.grupoAction === "create").map(p => p.grupoDescricao.trim().toLowerCase())).size,
    newBrands: new Set(processedProducts.filter(p => p.marcaAction === "create").map(p => p.marcaNome.trim().toLowerCase())).size,
  };

  // Funções de Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/json") {
      await processFile(droppedFile);
    } else {
      alert("Por favor, selecione um arquivo JSON válido.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await processFile(selectedFile);
    }
  };

  // Processar e Validar o arquivo JSON
  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setLoadingFile(true);
    setProcessedProducts([]);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const sanitizedText = sanitizeJsonText(text);
        const parsed = JSON.parse(sanitizedText);
        
        let jsonArray: any[] = [];
        if (Array.isArray(parsed)) {
          jsonArray = parsed;
        } else if (parsed && typeof parsed === "object") {
          // Se for um único objeto, envelopar em array
          jsonArray = [parsed];
        } else {
          throw new Error("O JSON precisa conter um objeto ou uma lista de produtos.");
        }

        // Buscar tabelas atuais do SQLite para cruzamento de dados
        const [categorias, grupos, fabricantes] = await Promise.all([
          ProductService.listarCategorias(),
          ProductService.listarGrupos(),
          ProductService.listarFabricantes(),
        ]);

        const processed = jsonArray.map((item: any, idx): ProcessedImportProduct => {
          const errors: string[] = [];
          const sku = String(item.codigo || item.codigo_fabricante || "").trim();
          const desc = String(item.descricao || item.referencia || "").trim();
          const oem = String(item.codigo_original || item.codigo_fabricante || "").trim();
          const catName = String(item.categoria_descricao || item.categoria || "").trim();
          const grpName = String(item.grupo_descricao || item.grupo || "").trim();
          const brandName = String(item.marca_nome || item.fabricante || "").trim();

          // Validações de campos obrigatórios
          if (!sku) errors.push("Código SKU interno ou do fabricante é obrigatório.");
          if (!desc) errors.push("Descrição ou referência do produto é obrigatória.");
          if (!oem) errors.push("Código original (OEM) ou código de fabricante é obrigatório.");
          if (!catName) errors.push("Categoria é obrigatória.");
          if (!grpName) errors.push("Grupo é obrigatório.");
          if (!brandName) errors.push("Marca/Fabricante é obrigatória.");

          // Checar duplicatas de código SKU na própria lista do JSON
          const isSkuDuplicatedInJson = jsonArray.some((other, otherIdx) => 
            otherIdx !== idx && String(other.codigo || other.codigo_fabricante || "").trim().toLowerCase() === sku.toLowerCase()
          );
          if (isSkuDuplicatedInJson && sku) {
            errors.push("Código SKU/Fabricante duplicado na lista de importação.");
          }

          // Verificar ações de Categoria
          let catAction: "use" | "create" | "missing" = "missing";
          if (catName) {
            const catExists = categorias.some(c => c.descricao.toLowerCase() === catName.toLowerCase());
            catAction = catExists ? "use" : "create";
          }

          // Verificar ações de Grupo
          let grpAction: "use" | "create" | "missing" = "missing";
          if (grpName) {
            const grpExists = grupos.some(g => g.descricao?.toLowerCase() === grpName.toLowerCase());
            grpAction = grpExists ? "use" : "create";
          }

          // Verificar ações de Marca
          let brandAction: "use" | "create" | "missing" = "missing";
          if (brandName) {
            const brandExists = fabricantes.some(f => f.nome.toLowerCase() === brandName.toLowerCase());
            brandAction = brandExists ? "use" : "create";
          }

          const hasNewEntities = catAction === "create" || grpAction === "create" || brandAction === "create";

          return {
            rawData: item,
            isValid: errors.length === 0,
            errors,
            codigo: sku,
            descricao: desc,
            categoriaDescricao: catName,
            grupoDescricao: grpName,
            marcaNome: brandName,
            precoVenda: item.preco?.preco_venda ? Number(item.preco.preco_venda) : 0,
            estoqueAtual: item.estoque?.estoque_atual ? Number(item.estoque.estoque_atual) : 0,
            categoriaAction: catAction,
            grupoAction: grpAction,
            marcaAction: brandAction,
            hasNewEntities,
            expanded: false
          };
        });

        setProcessedProducts(processed);
      } catch (err: any) {
        const errorMsg = String(err.message || err);
        if (errorMsg.includes("Cannot read properties of undefined") || errorMsg.includes("__TAURI_INTERNALS__") || !(window as any).__TAURI_INTERNALS__) {
          alert("Erro: A API do Tauri não está disponível. Certifique-se de que você está executando e testando o aplicativo diretamente pela janela do aplicativo Desktop Tauri (iniciada pelo comando 'bun run tauri dev') e não em um navegador comum.");
        } else {
          alert(`Erro ao ler o arquivo JSON: ${errorMsg}`);
        }
        setFile(null);
      } finally {
        setLoadingFile(false);
      }
    };
    reader.readAsText(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setProcessedProducts([]);
    setImportLogs([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleExpand = (index: number) => {
    setProcessedProducts(prev => 
      prev.map((item, idx) => idx === index ? { ...item, expanded: !item.expanded } : item)
    );
  };

  // Processo de Importação no Banco de Dados
  const handleImport = async () => {
    if (processedProducts.length === 0) return;
    const invalidItems = processedProducts.filter(p => !p.isValid);
    if (invalidItems.length > 0) {
      const confirmImport = confirm(`Atenção: Existem ${invalidItems.length} produtos com erros estruturais que serão ignorados. Deseja continuar?`);
      if (!confirmImport) return;
    }

    setImporting(true);
    setImportLogs([]);
    const validProducts = processedProducts.filter(p => p.isValid);
    const total = validProducts.length;
    setImportProgress({ current: 0, total, statusText: "Iniciando importação..." });

    try {
      // 1. Carregar dados atuais do banco
      let dbCategorias = await ProductService.listarCategorias();
      let dbGrupos = await ProductService.listarGrupos();
      let dbFabricantes = await ProductService.listarFabricantes();
      let dbMontadoras = await ProductService.listarMontadoras();
      let dbProdutos = await ProductService.listarProdutos();

      const log = (msg: string) => {
        setImportLogs(prev => [...prev, msg]);
      };

      // Caches locais para evitar criar itens repetidos
      const categoriaCache = new Map<string, number>();
      dbCategorias.forEach(c => categoriaCache.set(c.descricao.toLowerCase(), c.id));

      const grupoCache = new Map<string, number>();
      dbGrupos.forEach(g => {
        if (g.descricao) grupoCache.set(g.descricao.toLowerCase(), g.id);
      });

      const fabricanteCache = new Map<string, number>();
      dbFabricantes.forEach(f => fabricanteCache.set(f.nome.toLowerCase(), f.id));

      const montadoraCache = new Map<string, number>();
      dbMontadoras.forEach(m => montadoraCache.set(m.nome.toLowerCase(), m.id));

      const produtoCache = new Map<string, Produto>();
      dbProdutos.forEach(p => {
        if (p.codigo) produtoCache.set(p.codigo.toLowerCase().trim(), p);
      });

      for (let i = 0; i < total; i++) {
        const item = validProducts[i];
        setImportProgress({ current: i + 1, total, statusText: `Importando [${i + 1}/${total}]: ${item.descricao}` });

        // A. Resolver Categoria
        const catKey = item.categoriaDescricao.trim().toLowerCase();
        let catId = categoriaCache.get(catKey);
        if (!catId) {
          log(`Criando nova categoria: "${item.categoriaDescricao}"`);
          catId = await ProductService.criarCategoria(item.categoriaDescricao);
          categoriaCache.set(catKey, catId);
        }

        // B. Resolver Grupo
        const grpKey = item.grupoDescricao.trim().toLowerCase();
        let grpId = grupoCache.get(grpKey);
        if (!grpId) {
          log(`Criando novo grupo: "${item.grupoDescricao}"`);
          grpId = await ProductService.criarGrupo(catId, null, item.grupoDescricao);
          grupoCache.set(grpKey, grpId);
        }

        // C. Resolver Fabricante/Marca
        const brandKey = item.marcaNome.trim().toLowerCase();
        let brandId = fabricanteCache.get(brandKey);
        if (!brandId) {
          log(`Criando fabricante: "${item.marcaNome}"`);
          brandId = await ProductService.criarFabricante(item.marcaNome);
          fabricanteCache.set(brandKey, brandId);
        }

        // D. Resolver Montadoras para as aplicações
        const resolvedAplicacoes: ProdutoAplicacao[] = [];
        if (item.rawData.aplicacoes && Array.isArray(item.rawData.aplicacoes)) {
          for (const app of item.rawData.aplicacoes) {
            if (Array.isArray(app)) {
              const makeName = String(app[0] || "").trim();
              if (makeName) {
                const makeKey = makeName.toLowerCase();
                let makeId = montadoraCache.get(makeKey);
                if (!makeId) {
                  log(`Criando montadora de veículo: "${makeName}"`);
                  makeId = await ProductService.criarMontadora(makeName);
                  montadoraCache.set(makeKey, makeId);
                }
                resolvedAplicacoes.push({
                  id: 0,
                  lista_id: 0,
                  montadora_id: makeId,
                  modelo: String(app[1] || "").trim(),
                  ano_inicial: app[2] ? Number(app[2]) : null,
                  ano_final: app[3] ? Number(app[3]) : null,
                  detalhes: app[4] ? String(app[4]).trim() : null
                });
              }
            } else if (app && typeof app === "object") {
              const makeName = String(app.montadora_nome || "").trim();
              if (makeName) {
                const makeKey = makeName.toLowerCase();
                let makeId = montadoraCache.get(makeKey);
                if (!makeId) {
                  log(`Criando montadora de veículo: "${makeName}"`);
                  makeId = await ProductService.criarMontadora(makeName);
                  montadoraCache.set(makeKey, makeId);
                }
                resolvedAplicacoes.push({
                  id: 0,
                  lista_id: 0,
                  montadora_id: makeId,
                  modelo: String(app.modelo || "").trim(),
                  ano_inicial: app.ano_inicial ? Number(app.ano_inicial) : null,
                  ano_final: app.ano_final ? Number(app.ano_final) : null,
                  detalhes: app.detalhes ? String(app.detalhes).trim() : null
                });
              }
            }
          }
        }

        // E. Resolver Referências (Fabricantes cruzados)
        const resolvedReferencias: ProdutoReferencia[] = [];
        const refsData = item.rawData.referencias_cruzadas || item.rawData.referencias;
        if (refsData && Array.isArray(refsData)) {
          for (const ref of refsData) {
            if (Array.isArray(ref)) {
              const refBrandName = String(ref[0] || "").trim();
              const refCode = String(ref[1] || "").trim();
              if (refBrandName && refCode) {
                const refBrandKey = refBrandName.toLowerCase();
                let refBrandId = fabricanteCache.get(refBrandKey);
                if (!refBrandId) {
                  log(`Criando fabricante para referência cruzada: "${refBrandName}"`);
                  refBrandId = await ProductService.criarFabricante(refBrandName);
                  fabricanteCache.set(refBrandKey, refBrandId);
                }
                resolvedReferencias.push({
                  id: 0,
                  produto_id: 0,
                  fabricante_id: refBrandId,
                  codigo_referencia: refCode
                });
              }
            } else if (ref && typeof ref === "object") {
              const refBrandName = String(ref.fabricante_nome || "").trim();
              const refCode = String(ref.codigo_referencia || "").trim();
              if (refBrandName && refCode) {
                const refBrandKey = refBrandName.toLowerCase();
                let refBrandId = fabricanteCache.get(refBrandKey);
                if (!refBrandId) {
                  log(`Criando fabricante para referência cruzada: "${refBrandName}"`);
                  refBrandId = await ProductService.criarFabricante(refBrandName);
                  fabricanteCache.set(refBrandKey, refBrandId);
                }
                resolvedReferencias.push({
                  id: 0,
                  produto_id: 0,
                  fabricante_id: refBrandId,
                  codigo_referencia: refCode
                });
              }
            }
          }
        }

        // E.1. Resolver Especificações Técnicas
        const resolvedEspecificacoes: any[] = [];
        if (item.rawData.especificacoes_tecnicas && Array.isArray(item.rawData.especificacoes_tecnicas)) {
          for (const spec of item.rawData.especificacoes_tecnicas) {
            if (Array.isArray(spec)) {
              const specType = String(spec[0] || "").trim();
              const specValue = String(spec[1] || "").trim();
              if (specType && specValue) {
                resolvedEspecificacoes.push({
                  id: 0,
                  produto_id: 0,
                  tipo_id: 0,
                  especificacao: specValue,
                  tipo_especificacao: specType
                });
              }
            }
          }
        }

        // E.2. Resolver Imagens
        const resolvedImagens: Imagem[] = [];
        if (item.rawData.imagens && Array.isArray(item.rawData.imagens)) {
          for (const imgData of item.rawData.imagens) {
            if (typeof imgData === "string" && imgData.trim()) {
              resolvedImagens.push({
                id: 0,
                url: imgData.trim(),
              });
            } else if (imgData && typeof imgData === "object" && imgData.caminho_imagem) {
              resolvedImagens.push({
                id: 0,
                url: String(imgData.caminho_imagem).trim(),
              });
            }
          }
        }

        // F. Montar objeto final de Produto
        const skuKey = item.codigo.toLowerCase().trim();
        const existingProduct = produtoCache.get(skuKey);

        const finalProduct: Produto = {
          id: existingProduct ? (existingProduct.id || 0) : 0,
          codigo: item.codigo,
          descricao: item.descricao,
          descricao_complementar: item.rawData.descricao_complementar || null,
          grupo_id: grpId,
          marca_id: brandId,
          codigo_original: item.rawData.codigo_original || item.rawData.codigo_fabricante || "N/A",
          referencia: item.rawData.referencia || null,
          codigo_barras: item.rawData.codigo_barras || null,
          peso_liquido: item.rawData.peso_liquido ? Number(item.rawData.peso_liquido) : null,
          peso_bruto: item.rawData.peso_bruto ? Number(item.rawData.peso_bruto) : null,
          altura: item.rawData.altura ? Number(item.rawData.altura) : null,
          largura: item.rawData.largura ? Number(item.rawData.largura) : null,
          comprimento: item.rawData.comprimento ? Number(item.rawData.comprimento) : null,
          ativo: true,
          aplicacao_lista_id: existingProduct ? existingProduct.aplicacao_lista_id : null,
          preco: item.rawData.preco ? {
            id: 0,
            produto_id: existingProduct ? (existingProduct.id || 0) : 0,
            custo_compra: Number(item.rawData.preco.custo_compra || 0),
            custo_impostos: Number(item.rawData.preco.custo_impostos || 0),
            preco_venda: Number(item.rawData.preco.preco_venda || 0),
            atualizado_em: new Date(),
          } : undefined,
          estoque: item.rawData.estoque ? [
            {
              id: 0,
              produto_id: existingProduct ? (existingProduct.id || 0) : 0,
              filial_id: 1,
              estoque_atual: Number(item.rawData.estoque.estoque_atual || 0),
              estoque_reservado: 0,
              estoque_disponivel: Number(item.rawData.estoque.estoque_atual || 0),
              estoque_minimo: Number(item.rawData.estoque.estoque_minimo || 0),
              controla_estoque: true,
              rua: item.rawData.estoque.rua || null,
              prateleira: item.rawData.estoque.prateleira || null,
              nivel: item.rawData.estoque.nivel || null,
              posicao: item.rawData.estoque.posicao || null,
              atualizado_em: new Date(),
            }
          ] : null,
          fiscal: item.rawData.fiscal ? {
            id: 0,
            produto_id: existingProduct ? (existingProduct.id || 0) : 0,
            ncm: String(item.rawData.fiscal.ncm || "00000000").replace(/\D/g, ""),
            cest: item.rawData.fiscal.cest ? String(item.rawData.fiscal.cest).replace(/\D/g, "") : null,
            origem_mercadoria: Number(item.rawData.fiscal.origem_mercadoria || 0),
            criado_em: new Date(),
            atualizado_em: new Date(),
          } : null,
          aplicacoes: resolvedAplicacoes.length > 0 ? resolvedAplicacoes : null,
          referencias: resolvedReferencias.length > 0 ? resolvedReferencias : null,
          especificacoes: resolvedEspecificacoes.length > 0 ? resolvedEspecificacoes : null,
          imagens: resolvedImagens.length > 0 ? resolvedImagens : null,
        };

        // G. Gravar ou Atualizar no banco SQLite
        if (existingProduct) {
          log(`Produto SKU ${item.codigo} já existe. Atualizando e substituindo tabelas referentes...`);
          await ProductService.atualizarProduto(finalProduct);
        } else {
          log(`Salvando SKU ${item.codigo} no banco SQLite...`);
          await ProductService.criarProduto(finalProduct);
        }
      }

      log(`Sucesso: ${total} produtos importados com êxito!`);
      alert(`Importação concluída! ${total} produtos foram cadastrados com sucesso.`);
      clearFile();
    } catch (error: any) {
      console.error("Erro durante a importação:", error);
      alert(`Ocorreu um erro no processo de importação: ${error.message || error}`);
    } finally {
      setImporting(false);
    }
  };

  // Filtragem da visualização
  const filteredProducts = processedProducts.filter(p => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      p.codigo.toLowerCase().includes(query) ||
      p.descricao.toLowerCase().includes(query) ||
      p.marcaNome.toLowerCase().includes(query) ||
      p.grupoDescricao.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 overflow-y-auto pr-1">
      <div className="max-w-7xl mx-auto w-full space-y-4">
        
        {/* Painel Inicial: Upload de Arquivo */}
        {!file && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              isDragging
                ? "border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10 scale-[0.99]"
                : "border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0e1626]/20"
            }`}
          >
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-full text-indigo-500 dark:text-indigo-400 mb-4 animate-pulse">
              <FileUp size={36} />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Importar Catálogo de Produtos (JSON)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm">
              Arraste seu arquivo JSON de produtos aqui ou clique no botão abaixo para selecionar de sua máquina.
            </p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                appearance="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={loadingFile}
              >
                {loadingFile ? "Carregando..." : "Selecionar Arquivo"}
              </Button>
              <a
                href="file:///home/irenaldo/Área de trabalho/IRP React ⁄ Tauri/IS-ERP-Vite-Autopecas/PRODUTO_SCHEMA.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-250 dark:border-slate-800 text-xs font-semibold text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <HelpCircle size={14} />
                Como estruturar meu JSON?
              </a>
            </div>
          </div>
        )}

        {/* Painel de Visualização & Pré-validação */}
        {file && !importing && (
          <div className="space-y-4">
            
            {/* Header com arquivo e estatísticas */}
            <div className="border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 p-4.5 shadow-sm dark:shadow-none grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4 flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-500">
                  <FileUp size={24} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {file.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB • {stats.total} itens detectados
                  </p>
                </div>
              </div>

              {/* Estatísticas resumidas */}
              <div className="md:col-span-5 flex flex-wrap gap-2.5">
                <div className="bg-slate-50 dark:bg-[#0d1527]/40 border border-slate-200/60 dark:border-slate-800 rounded-lg py-1.5 px-3 text-center min-w-[70px]">
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">{stats.valid}</span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Válidos</span>
                </div>
                {stats.invalid > 0 && (
                  <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-550/20 rounded-lg py-1.5 px-3 text-center min-w-[70px]">
                    <span className="block text-xs font-bold text-red-500">{stats.invalid}</span>
                    <span className="text-[8px] uppercase tracking-wider text-red-400 font-bold">Erros</span>
                  </div>
                )}
                {(stats.newCategories > 0 || stats.newGroups > 0 || stats.newBrands > 0) && (
                  <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-550/20 rounded-lg py-1.5 px-3 text-center min-w-[120px] flex items-center justify-center gap-2">
                    <Sparkles className="text-blue-500 animate-spin" size={14} />
                    <div className="text-left">
                      <span className="block text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        {stats.newCategories + stats.newGroups + stats.newBrands} Cadastros
                      </span>
                      <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-bold block leading-none mt-0.5">Novas marcas/grupos</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Ações primárias */}
              <div className="md:col-span-3 flex justify-end gap-2">
                <Button appearance="secondary" onClick={clearFile}>
                  Limpar
                </Button>
                <Button
                  appearance="primary"
                  onClick={handleImport}
                  disabled={stats.valid === 0}
                  icon={<Check size={16} />}
                >
                  Importar {stats.valid} Itens
                </Button>
              </div>
            </div>

            {/* Listagem de Pré-visualização com pesquisa */}
            <div className="border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 shadow-sm dark:shadow-none overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-850 flex items-center gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrar por código, descrição ou fabricante..."
                  className="flex-1 max-w-md px-3 py-1.5 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 text-xs"
                />
                <span className="text-[10px] text-slate-500">
                  Mostrando {filteredProducts.length} de {stats.total} itens
                </span>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-850 text-slate-500 bg-slate-50/40 dark:bg-slate-900/10">
                      <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px] w-8"></th>
                      <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px] w-24">SKU / Cód.</th>
                      <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Peça / Descrição</th>
                      <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Fabricante</th>
                      <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Grupo</th>
                      <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px] text-right">Preço</th>
                      <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px] text-center w-16">Estoque</th>
                      <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px] text-center w-28">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-650 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-850/40">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-slate-500">
                          Nenhum produto encontrado correspondente ao filtro.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p, index) => (
                        <>
                          <tr key={index} className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/5 transition-colors ${!p.isValid ? "bg-red-500/[0.02] dark:bg-red-500/[0.04]" : ""}`}>
                            <td className="py-2 px-3">
                              <button
                                type="button"
                                onClick={() => toggleExpand(index)}
                                className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 cursor-pointer"
                              >
                                {p.expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            </td>
                            <td className="py-2 px-3 font-mono font-semibold text-slate-700 dark:text-slate-200">
                              {p.codigo || "—"}
                            </td>
                            <td className="py-2 px-3">
                              <div>
                                <span className="font-semibold text-slate-800 dark:text-slate-150 block truncate max-w-xs">{p.descricao || "—"}</span>
                                <span className="text-[9px] text-slate-500 block">Original: {p.rawData.codigo_original || "Não informado"}</span>
                              </div>
                            </td>
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium">{p.marcaNome || "—"}</span>
                                {p.marcaAction === "create" && (
                                  <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-1 py-0.2 rounded text-[7.5px] uppercase font-extrabold flex items-center gap-0.5" title="Fabricante será cadastrado no banco">
                                    <Plus size={8} /> Novo
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-500">{p.grupoDescricao || "—"}</span>
                                {p.grupoAction === "create" && (
                                  <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-1 py-0.2 rounded text-[7.5px] uppercase font-extrabold flex items-center gap-0.5" title="Grupo será criado no banco">
                                    <Plus size={8} /> Novo
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-semibold text-slate-700 dark:text-slate-250">
                              {p.precoVenda > 0 ? `R$ ${p.precoVenda.toFixed(2)}` : "—"}
                            </td>
                            <td className="py-2 px-3 text-center font-mono font-medium">
                              {p.estoqueAtual}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {p.isValid ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide">
                                  <CheckCircle2 size={10} /> Pronto
                                </span>
                              ) : (
                                <span 
                                  className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide cursor-help"
                                  title={p.errors.join(" | ")}
                                >
                                  <AlertTriangle size={10} /> Erro
                                </span>
                              )}
                            </td>
                          </tr>
                          
                          {/* Linha de Detalhes Adicionais (Expandida) */}
                          {p.expanded && (
                            <tr>
                              <td colSpan={8} className="py-3 px-6 bg-slate-50/50 dark:bg-slate-900/10">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[10px] text-slate-600 dark:text-slate-400">
                                  
                                  {/* Coluna 1: Informações Gerais e Fiscais */}
                                  <div className="space-y-1.5 border-r border-slate-200 dark:border-slate-800/60 pr-4">
                                    <h5 className="font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider text-[8px] flex items-center gap-1">
                                      <Tag size={12} className="text-indigo-500" />
                                      Informações Gerais & Fiscais
                                    </h5>
                                    <div>
                                      <span className="font-bold">NCM:</span> {p.rawData.fiscal?.ncm || "Não informado"}
                                    </div>
                                    <div>
                                      <span className="font-bold">CEST:</span> {p.rawData.fiscal?.cest || "Não informado"}
                                    </div>
                                    <div>
                                      <span className="font-bold">Origem Mercadoria:</span> {
                                        p.rawData.fiscal?.origem_mercadoria === 1 ? "1 - Estrangeira (Importação direta)" :
                                        p.rawData.fiscal?.origem_mercadoria === 2 ? "2 - Estrangeira (Mercado interno)" :
                                        "0 - Nacional"
                                      }
                                    </div>
                                    {p.errors.length > 0 && (
                                      <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 p-2 rounded text-red-500 mt-2 font-semibold">
                                        Erros: {p.errors.join(", ")}
                                      </div>
                                    )}
                                  </div>

                                  {/* Coluna 2: Compatibilidade de Veículos */}
                                  <div className="space-y-1.5 border-r border-slate-200 dark:border-slate-800/60 pr-4 md:col-span-2">
                                    <h5 className="font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider text-[8px] flex items-center gap-1">
                                      <Archive size={12} className="text-indigo-500" />
                                      Compatibilidades ({p.rawData.aplicacoes?.length || 0})
                                    </h5>
                                    <div className="max-h-24 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850/30">
                                      {p.rawData.aplicacoes && Array.isArray(p.rawData.aplicacoes) && p.rawData.aplicacoes.length > 0 ? (
                                        p.rawData.aplicacoes.map((app: any, aIdx: number) => {
                                          const isArr = Array.isArray(app);
                                          const make = isArr ? app[0] : (app.montadora_nome || "");
                                          const model = isArr ? app[1] : (app.modelo || "");
                                          const startYear = isArr ? app[2] : (app.ano_inicial || null);
                                          const endYear = isArr ? app[3] : (app.ano_final || null);
                                          return (
                                            <div key={aIdx} className="py-1 flex items-center justify-between">
                                              <span>
                                                <span className="font-bold text-slate-700 dark:text-slate-300">{make}</span> • {model}
                                              </span>
                                              <span className="text-slate-500">
                                                {startYear ? startYear : "Todos"} {endYear ? `a ${endYear}` : ""}
                                              </span>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div className="text-slate-500 italic py-1">Sem compatibilidades associadas.</div>
                                      )}
                                    </div>
                                  </div>

                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Modal de Progresso da Importação */}
        {importing && (
          <div className="border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 p-8 shadow-md flex flex-col items-center justify-center max-w-xl mx-auto space-y-6">
            <div className="relative flex items-center justify-center">
              <Loader2 className="animate-spin text-indigo-500" size={48} />
              <span className="absolute font-bold text-xs text-slate-700 dark:text-slate-350 font-mono">
                {Math.round((importProgress.current / importProgress.total) * 100)}%
              </span>
            </div>

            <div className="text-center space-y-1.5 w-full">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Importando Lote de Produtos
              </h4>
              <p className="text-xs text-slate-500 truncate max-w-full px-4">
                {importProgress.statusText}
              </p>
              
              {/* Barra de Progresso */}
              <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-200/50 dark:border-slate-850 mt-4">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Log de Eventos em Tempo Real */}
            <div className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-[#070a13] p-4.5 rounded-lg h-48 overflow-y-auto font-mono text-[9px] text-slate-500 space-y-1 scrollbar-thin flex flex-col-reverse">
              {[...importLogs].reverse().map((log, lIdx) => (
                <div key={lIdx} className="leading-tight">
                  <span className="text-indigo-400 font-semibold">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
