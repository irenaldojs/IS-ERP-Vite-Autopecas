// ==========================================
// CONTROLE DE ACESSO E COLABORADORES
// ==========================================

export interface Usuario {
  /** Cadastro central de funcionários, operadores de caixa, estoquistas e gerentes */
  id: number;
  loja_id?: number | null;
  nome: string;
  email: string;
  senha_hash: string;
  cargo: string;
  perfil_acesso: string; // Define o nível de permissão no sistema. Ex: admin, supervisor, operador
  ativo: boolean;
  data_criacao: string;
  ultimo_login?: string | null;
}

// ==========================================
// INFRAESTRUTURA LOGÍSTICA / LOCALIZAÇÃO
// ==========================================

export interface Endereco {
  /** Cadastro centralizado de endereços para Clientes, Lojas ou Fornecedores */
  id: number;
  cliente_id?: number | null;
  loja_id?: number | null;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string; // Sigla da unidade federativa com 2 caracteres (Ex: SP, RJ, MG)
  pais: string;
  coordenadas?: { x: number; y: number } | string | null; // point representation
  complemento?: string | null;
  referencia?: string | null;
  tipo_endereco: string; // principal, entrega, cobranca, comercial
  cadastro_ativo: boolean;
}

// ==========================================
// ENUMS E CONFIGURAÇÕES GERAIS
// ==========================================

export type TipoRegimeTributario =
  | "Simples Nacional"
  | "Simples Nacional (excesso de sublimite de receita bruta)"
  | "Regime Normal (Lucro Presumido ou Lucro Real)";

// ==========================================
// NÚCLEO OPERACIONAL / EMPRESA
// ==========================================

export interface Loja {
  /** Cadastro de filiais ou unidades de negócio físicas/virtuais */
  id: number;
  nome_fantasia?: string | null;
  cnpj?: string | null;
  razao_social?: string | null;
  inscricao_estadual?: string | null;
  inscricao_municipal?: string | null;
  regime_tributario?: TipoRegimeTributario | null;
  endereco_id?: number | null;
}
