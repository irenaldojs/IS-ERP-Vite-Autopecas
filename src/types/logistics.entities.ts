// ==========================================
// LOGÍSTICA ENTRADA / TRANSFERÊNCIA ENTRE FILIAIS
// ==========================================

export interface TransferenciaPedido {
  /** Controle de requisições de estoque entre filiais */
  id: number;
  pre_venda_id: number | string;
  loja_origem_id: number;
  loja_destino_id: number;
  usuario_solicitante_id: number;
  usuario_expedidor_id?: number | null;
  data_solicitacao: string;
  data_envio?: string | null;
  data_recebimento?: string | null;
  status: string; // solicitado, em_transito, recebido, cancelado
  observacoes?: string | null;
}

export interface TransferenciaPedidoItem {
  /** Itens específicos que estão em trânsito entre as filiais */
  id: number;
  transferencia_id: number;
  pre_venda_item_id: number;
  produto_id: number;
  usuario_separador_id?: number | null;
  quantidade_solicitada: number;
  quantidade_enviada: number;
  quantidade_recebida: number;
  status_item: string; // aguardando_coleta, despachado, conferido_destino, divergência
}
