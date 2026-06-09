# Guia de Uso - Estado Global de Orçamento

## Estrutura de Dados

### Orcamento
```typescript
interface Orcamento {
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
```

### OrcamentoItem
```typescript
interface OrcamentoItem {
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
```

## Exemplo de Uso

```typescript
import { useAppStore } from "@/store/useAppStore";

export function OrcamentoForm() {
  const {
    orcamentoAtivo,
    orcamentos,
    criarOrcamento,
    adicionarItemOrcamento,
    removerItemOrcamento,
    atualizarDesconto,
    salvarOrcamento,
    carregarOrcamento,
    deleteOrcamento,
    limparOrcamentoAtivo,
  } = useAppStore();

  // 1. Criar novo orçamento
  const handleNovoOrcamento = () => {
    criarOrcamento("João Silva", "Volkswagen Gol 2015");
  };

  // 2. Adicionar item ao orçamento
  const handleAdicionarItem = () => {
    const item: OrcamentoItem = {
      id: `item-${Date.now()}`,
      produto_id: 1,
      codigo_produto: "AF-25167",
      nome_produto: "Filtro de Ar",
      marca_produto: "Bosch",
      quantidade: 2,
      preco_unitario: 149.9,
      subtotal: 299.8,
    };
    adicionarItemOrcamento(item);
  };

  // 3. Remover item
  const handleRemoverItem = (itemId: string) => {
    removerItemOrcamento(itemId);
  };

  // 4. Atualizar desconto
  const handleAtualizarDesconto = () => {
    atualizarDesconto(50); // 50 reais de desconto
  };

  // 5. Salvar orçamento
  const handleSalvarOrcamento = () => {
    salvarOrcamento("Enviado");
  };

  // 6. Listar todos os orçamentos
  const handleListarOrcamentos = () => {
    console.log("Orçamentos salvos:", orcamentos);
  };

  // 7. Carregar orçamento para edição
  const handleCarregarOrcamento = (id: string) => {
    carregarOrcamento(id);
  };

  // 8. Deletar orçamento
  const handleDeletarOrcamento = (id: string) => {
    deleteOrcamento(id);
  };

  // 9. Limpar orçamento ativo
  const handleLimpar = () => {
    limparOrcamentoAtivo();
  };

  return (
    <div>
      <h2>Gerenciador de Orçamentos</h2>
      {orcamentoAtivo && (
        <div>
          <h3>Orçamento Ativo</h3>
          <p>Cliente: {orcamentoAtivo.cliente_nome}</p>
          <p>Veículo: {orcamentoAtivo.veiculo_modelo}</p>
          <p>Total: R$ {orcamentoAtivo.total.toFixed(2)}</p>
          <p>Status: {orcamentoAtivo.status}</p>
          <p>Itens: {orcamentoAtivo.items.length}</p>
        </div>
      )}
    </div>
  );
}
```

## Ações Disponíveis

### `criarOrcamento(cliente: string, veiculo: string): string`
Cria um novo orçamento e o define como ativo. Retorna o ID do orçamento.

### `adicionarItemOrcamento(item: OrcamentoItem): void`
Adiciona um item ao orçamento ativo e recalcula o total.

### `removerItemOrcamento(itemId: string): void`
Remove um item do orçamento ativo e recalcula o total.

### `atualizarItemOrcamento(itemId: string, item: Partial<OrcamentoItem>): void`
Atualiza parcialmente um item do orçamento ativo.

### `atualizarDesconto(desconto: number): void`
Aplica um desconto absoluto ao orçamento ativo.

### `salvarOrcamento(status: Orcamento["status"]): void`
Salva o orçamento ativo com o status fornecido e limpa o estado ativo.

### `carregarOrcamento(id: string): void`
Carrega um orçamento existente para edição.

### `deleteOrcamento(id: string): void`
Deleta um orçamento da lista.

### `limparOrcamentoAtivo(): void`
Limpa o orçamento ativo sem salvar.

### `setOrcamentoAtivo(orcamento: Orcamento | null): void`
Define manualmente o orçamento ativo.

## Estados Disponíveis

- `orcamentoAtivo`: Orçamento em edição (null se nenhum ativo)
- `orcamentos`: Array com todos os orçamentos salvos
