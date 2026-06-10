// ==========================================
// ETAPA 1: ORÇAMENTO (COMERCIAL / BALCÃO)
// ==========================================

export interface OrcamentoItem {
  /** Item individual de um orçamento */
  id: string;
  produto_id: number;
  codigo_produto: string;
  nome_produto: string;
  marca_produto: string;
  quantidade: number;
  preco_unitario: number;
  desconto_percentual?: number | null;
  subtotal: number;
}

export interface Orcamento {
  /** Orçamento de vendas com múltiplos itens */
  id: string;
  cliente_nome: string;
  veiculo_modelo: string;
  data_criacao: string;
  data_validade?: string | null;
  items: OrcamentoItem[];
  desconto_total?: number | null;
  total: number;
  status: "Rascunho" | "Enviado" | "Aprovado" | "Recusado" | "Convertido";
  observacoes?: string | null;
}

// ==========================================
// FLUXO DE VENDAS E FINANCEIRO
// ==========================================

export interface FormaPagamento {
  /** Regras de negócio de recebimento comercial */
  id: number;
  nome: string;
  ativo: boolean;
  permite_parcelamento: boolean;
  max_parcelas: number;
  taxa_acrescido: number;
  dias_para_recebimento: number;
}

export interface Venda {
  /** Cabeçalho da transação comercial e registro fiscal imutável do pedido */
  id: number;
  loja_id: number;
  forma_pagamento_id?: number | null;
  usuario_vendedor_id: number;
  cliente_id?: number | null;
  venda_cliente_cpf_cnpj?: string | null;
  venda_cliente_nome?: string;
  venda_cliente_endereco?: string | null;
  venda_cliente_inscricao_estadual?: string | null;
  data_venda: string;
  data_atualizacao?: string | null;
  valor_bruto: number;
  valor_desconto: number;
  valor_frete: number;
  valor_liquido: number;
  status: string; // faturado, pago, cancelado, despachado
}

export interface VendaItem {
  /** Tabela associativa - Itens vinculados à venda */
  id: number;
  venda_id: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  desconto?: number;
  quantidade_devolvida: number;
  data_devolucao?: string | null;
  motivo_devolucao?: string | null;
}

// ==========================================
// FLUXO DE PRÉ-VENDA / NEGOCIAÇÃO
// ==========================================

export interface PreVenda {
  /** Rascunho permissivo de venda */
  id: number | string;
  loja_id: number;
  venda_id?: number | null;
  usuario_vendedor_id: number;
  cliente_id?: number | null;
  cliente_nome_provisorio?: string | null;
  cliente_contato?: string | null;
  data_criacao: string;
  data_validade?: string | null;
  valor_bruto: number;
  valor_desconto_estimado: number;
  valor_liquido_estimado: number;
  status: string; // em_analise, separacao, aguardando_emissao_venda
  observacoes?: string | null;
}

export interface PreVendaItem {
  /** Produtos em fase de separação física no estoque */
  id: number;
  pre_venda_id: number | string;
  produto_id: number;
  quantidade: number;
  preco_unitario_cotado: number;
  desconto_item?: number;
  quantidade_conferida: number;
  status_conferencia: string; // pendente, separando, conferido, extraviado_avaria, transferencia
  usuario_separador_id?: number | null;
  transferencia_id?: number | null;
  usuario_conferente_id?: number | null;
  data_conferencia?: string | null;
}

