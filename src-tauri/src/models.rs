use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProdutoCategoria {
    pub id: Option<i64>,
    pub descricao: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProdutoGrupo {
    pub id: Option<i64>,
    pub categoria_id: i64,
    pub grupo_parent_id: Option<i64>,
    pub descricao: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProdutoFabricante {
    pub id: Option<i64>,
    pub nome: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProdutoAplicacao {
    pub id: Option<i64>,
    pub lista_id: i64,
    pub modelo: String,
    pub ano_inicial: Option<i64>,
    pub ano_final: Option<i64>,
    pub detalhes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Imagem {
    pub id: Option<i64>,
    pub url_imagem: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProdutoEspecificacao {
    pub id: Option<i64>,
    pub produto_id: i64,
    pub tipo_id: i64,
    pub especificacao: String,
    // Auxiliar para retornar o nome do tipo
    pub tipo_especificacao: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProdutoReferencia {
    pub id: Option<i64>,
    pub produto_id: i64,
    pub fabricante_id: i64,
    pub fabricante_nome: Option<String>,
    pub codigo_referencia: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProdutoFiscal {
    pub id: Option<i64>,
    pub produto_id: Option<i64>,
    pub ncm: String,
    pub cest: Option<String>,
    pub origem_mercadoria: i64,
    pub csosn: Option<String>,
    pub cst_icms: Option<String>,
    pub cst_pis: Option<String>,
    pub cst_cofins: Option<String>,
    pub cst_ipi: Option<String>,
    pub aliquota_icms: Option<f64>,
    pub aliquota_icms_st: Option<f64>,
    pub aliquota_pis: Option<f64>,
    pub aliquota_cofins: Option<f64>,
    pub aliquota_ipi: Option<f64>,
    pub cfop_saida: Option<String>,
    pub cfop_entrada: Option<String>,
    pub criado_em: Option<String>,
    pub atualizado_em: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProdutoEstoque {
    pub id: Option<i64>,
    pub produto_id: Option<i64>,
    pub filial_id: i64,
    pub estoque_atual: f64,
    pub estoque_reservado: f64,
    pub estoque_disponivel: f64,
    pub estoque_minimo: f64,
    pub estoque_maximo: Option<f64>,
    pub controla_estoque: bool,
    pub rua: Option<String>,
    pub prateleira: Option<String>,
    pub nivel: Option<String>,
    pub posicao: Option<String>,
    pub atualizado_em: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProdutoPreco {
    pub id: Option<i64>,
    pub produto_id: Option<i64>,
    pub custo_compra: f64,
    pub custo_impostos: f64,
    pub preco_venda: f64,
    pub simetria_preco: Option<f64>,
    pub margem_lucro: Option<f64>,
    pub markup: Option<f64>,
    pub preco_promocional: Option<f64>,
    pub promocao_inicio: Option<String>,
    pub promocao_fim: Option<String>,
    pub atualizado_em: Option<String>,
}

// Produto completo agregado com preços, estoque, etc.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Produto {
    pub id: Option<i64>,
    pub codigo: String,
    pub descricao: Option<String>,
    pub descricao_complementar: Option<String>,
    pub grupo_id: i64,
    pub grupo_descricao: Option<String>,
    pub categoria_descricao: Option<String>,
    pub marca_id: i64,
    pub marca_nome: Option<String>,
    pub aplicacao_lista_id: Option<i64>,
    pub codigo_original: String,
    pub referencia: Option<String>,
    pub codigo_barras: Option<String>,
    pub peso_liquido: Option<f64>,
    pub peso_bruto: Option<f64>,
    pub altura: Option<f64>,
    pub largura: Option<f64>,
    pub comprimento: Option<f64>,
    pub ativo: bool,
    pub criado_em: Option<String>,
    pub atualizado_em: Option<String>,

    // Dados agregados opcionais nas APIs
    pub estoque: Option<Vec<ProdutoEstoque>>,
    pub preco: Option<ProdutoPreco>,
    pub fiscal: Option<ProdutoFiscal>,
    pub especificacoes: Option<Vec<ProdutoEspecificacao>>,
    pub referencias: Option<Vec<ProdutoReferencia>>,
    pub aplicacoes: Option<Vec<ProdutoAplicacao>>,
    pub imagens: Option<Vec<Imagem>>,
}
