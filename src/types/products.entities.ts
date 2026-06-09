export interface ProdutoCategoria {
  /** Nível 1 da classificação (Ex: Motor, Suspensão, Elétrica) */
  id: number;
  descricao: string;
}

export interface ProdutoGrupo {
  /** Nível 2 e 3 da classificação (Ex: Filtros, Amortecedores) com suporte a hierarquia */
  id: number;
  categoria_id: number;
  grupo_parent_id?: number | null;
  descricao?: string | null;
}

export interface ProdutoMarca {
  /** Fabricantes industriais de autopeças */
  id: number;
  nome: string;
}

export interface ProdutoAplicacaoLista {
  /** Tabela âncora usada para agrupar múltiplos carros compatíveis com uma mesma peça */
  id: number;
  aplicaoes: ProdutoAplicacao[];
}

export interface Imagem {
  /** Repositório de mídias físicas/URLs em nuvem */
  id: number;
  url_imagem: string;
}

export interface ProdutoImagem {
  /** Relacionamento N:M para permitir múltiplas fotos por peça */
  id: number;
  produto_id: number;
  imagem_id: number;
}

export interface ProdutoTipoEspecificacao {
  /** Filtros dinâmicos de propriedades (Ex: Diâmetro, Amperagem, Material) */
  id: number;
  tipo_especificacao: string;
}

export interface ProdutoEspecificacao {
  /** Ficha técnica detalhada da autopeça */
  id: number;
  produto_id: number;
  tipo_id: number;
  especificacao: string;
}

export interface ProdutoAplicacao {
  /** Mapeamento detalhado de quais carros aceitam a peça */
  id: number;
  lista_id: number;
  modelo_id: number;
  ano?: string | null;
  detalhes?: string | null;
}

export interface CarroMontadora {
  /** Marcas de veículos (Ex: Volkswagen, Fiat, Chevrolet) */
  id: number;
  nome: string;
}

export interface CarroModelo {
  /** Modelos de veículos associados à montadora (Ex: Gol, Uno, Onix) */
  id: number;
  montadora_id: number;
  nome: string;
}

export interface Produto {
  /** Cadastro central de autopeças e componentes */
  id: number;
  subgrupo_id: number;
  marca_id: number;
  aplicacao_lista_id: number;
  codigo_original: string;
  referencia?: string | null;
  preco: number;
  simetria_preco?: number | null;
}
