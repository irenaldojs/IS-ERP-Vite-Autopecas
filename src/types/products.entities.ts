export interface ProdutoCategoria {
  /** Nível 1 da classificação (Ex: Motor, Suspensão, Elétrica) */
  id: number;
  descricao: string; // Ignição
}

export interface ProdutoGrupo {
  /** Nível 2 e 3 da classificação (Ex: Filtros, Amortecedores) com suporte a hierarquia */
  id: number;
  categoria_id: number; // 1 -> Ignição
  grupo_parent_id?: number | null;
  descricao?: string | null; // Jogo de Velas de Ignição
}

export interface ProdutoFabricante {
  /** Fabricantes industriais de autopeças */
  id: number;
  nome: string; // Ngk
}

export type ProdutoMarca = ProdutoFabricante;


export interface ProdutoAplicacaoLista {
  /** Tabela âncora usada para agrupar múltiplos carros compatíveis com uma mesma peça */
  id: number;
  aplicaoes: ProdutoAplicacao[];
}

export interface Imagem {
  /** Repositório de mídias físicas/URLs em nuvem */
  id: string | number;
  url?: string; // "./1/1_150x150.webP"
  caminho_imagem?: string;
}

export interface ProdutoImagem {
  /** Relacionamento N:M para permitir múltiplas fotos por peça */
  id: number;
  produto_id: number; // 1
  imagem_id: number; // 1
}

export interface ProdutoTipoEspecificacao {
  /** Filtros dinâmicos de propriedades (Ex: Diâmetro, Amperagem, Material) */
  id: number;
  tipo_especificacao: string; // Tipo de Eletrodo
}

export interface ProdutoEspecificacao {
  /** Ficha técnica detalhada da autopeça */
  id: number;
  produto_id: number; // 1
  tipo_id: number; // 1
  especificacao: string; // Níquel
}

export interface ProdutoAplicacao {
  /** Mapeamento detalhado de quais carros aceitam a peça */
  id: number;
  lista_id: number; // 1
  montadora_id: number; // 1 -> Volkswagen
  modelo: string; // Gol
  ano_inicial?: number | null; // 2005
  ano_final?: number | null; // 2020
  detalhes?: string | null; // Motores EA111 Flex
  ano?: string;
}

export interface CarroMontadora {
  /** Marcas de veículos (Ex: Volkswagen, Fiat, Chevrolet) */
  id: number;
  nome: string; // Volkswagen
}

export interface CarroModelo {
  /** Modelos de veículos associados à montadora (Ex: Gol, Uno, Onix) */
  id: number;
  montadora_id: number;
  nome: string;  // Gol
}

export interface Produto {
  /** Identificação */
  id: number;
  codigo?: string; // SKU interno ex: P_000001
  descricao?: string;

  /** Descrição */
  descricao_complementar?: string | null; // Gol / Fox / Polo

  /** Relacionamentos */
  grupo_id: number; // 1 -> Kit embreagem
  marca_id: number; // 1 -> Ngk
  aplicacao_lista_id?: number | null; // 1

  /** Referências */
  codigo_original: string; // BKR7ESB-D
  referencia?: string | null;
  codigo_barras?: string | null; // 7891234567890

  /** Dados físicos */
  peso_liquido?: number | null;
  peso_bruto?: number | null;
  altura?: number | null;
  largura?: number | null;
  comprimento?: number | null;

  /** Controle */
  ativo?: boolean;

  criado_em?: Date;
  atualizado_em?: Date;

  // Extra relations from local API
  preco?: any;
  estoque?: ProdutoEstoque[] | null;
  fiscal?: ProdutoFiscal | null;
  especificacoes?: ProdutoEspecificacao[] | null;
  referencias?: ProdutoReferencia[] | null; //
  aplicacoes?: ProdutoAplicacao[] | null;
  imagens?: Imagem[] | null;
  marca_nome?: string | null;
  grupo_descricao?: string | null;
  categoria_descricao?: string | null;
  simetria_preco?: number | null;
}

export interface ProdutoReferencia {
  // Codigos Equivalentes ou da montadora * referencias cruzadas
  id: number;
  produto_id: number;

  fabricante_id: number;
  codigo_referencia: string;
}

export interface ProdutoFiscal {
  id: number;
  produto_id: number;

  /** Classificação fiscal */
  ncm: string;
  cest?: string | null;

  /**
   * Origem da mercadoria
   * 0 Nacional
   * 1 Estrangeira - Importação direta
   * 2 Estrangeira - Mercado interno
   * ...
   */
  origem_mercadoria: number;

  /** Tributação */
  csosn?: string | null;
  cst_icms?: string | null;
  cst_pis?: string | null;
  cst_cofins?: string | null;
  cst_ipi?: string | null;

  /** Alíquotas padrão */
  aliquota_icms?: number | null;
  aliquota_icms_st?: number | null;
  aliquota_pis?: number | null;
  aliquota_cofins?: number | null;
  aliquota_ipi?: number | null;

  /** CFOP sugerido */
  cfop_saida?: string | null;
  cfop_entrada?: string | null;

  criado_em: Date;
  atualizado_em: Date;
}

export interface ProdutoEstoque {
  id: number;

  produto_id: number;
  filial_id: number;

  estoque_atual: number;
  estoque_reservado: number;
  estoque_disponivel: number;

  estoque_minimo: number;
  estoque_maximo?: number | null;

  controla_estoque: boolean;

  /** Localização física */
  rua?: string | null;
  prateleira?: string | null;
  nivel?: string | null;
  posicao?: string | null;

  atualizado_em: Date;
}

export interface ProdutoPreco {
  id: number;

  produto_id: number;

  /** Custos */
  custo_compra: number;
  custo_impostos: number;

  /** Venda */
  preco_venda: number;

  /**
   * Muito usado em autopeças
   * Ex.: lado esquerdo = lado direito
   */
  simetria_preco?: number | null;

  /** Margens */
  margem_lucro?: number | null;
  markup?: number | null;

  /** Promoção */
  preco_promocional?: number | null;
  promocao_inicio?: Date | null;
  promocao_fim?: Date | null;

  atualizado_em: Date;
}
