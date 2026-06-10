// ==========================================
// CADASTRO CENTRAL DE CLIENTES
// ==========================================

export interface Cliente {
  /** Cadastro unificado de clientes (Físicos e Jurídicos) */
  id: number;
  nome: string;
  tipo_pessoa: string; // Física ou Jurídica
  cpf_cnpj: string;
  email?: string | null;
  telefone?: string | null;
  endereco_id?: number | null;
  permite_faturado: boolean;
  limite_credito: number;
  saldo_utilizado: number;
  bloqueado_por_atraso: boolean;
}

// ==========================================
// FINANCEIRO: CONTAS A RECEBER / CREDIÁRIO
// ==========================================

export interface ClienteLancamento {
  /** Controle de parcelas e faturamentos por cliente (Contas a Receber) */
  id: number;
  cliente_id: number;
  venda_id?: number | null;
  numero_parcela: number;
  total_parcelas: number;
  valor_parcela: number;
  valor_pago: number;
  data_emissao: string;
  data_vencimento: string;
  data_pagamento?: string | null;
  status: string; // aberto, pago, vencido, renegociado
}
