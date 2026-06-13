# Documentação das APIs de Produto (Tauri Commands)

Esta documentação detalha os comandos Tauri expostos pelo backend Rust para comunicação com o banco SQLite local, descrevendo os parâmetros esperados e o formato de retorno de cada endpoint.

---

## 1. Gerenciamento de Produtos

### `criar_produto`
Cria um produto completo com dados de preço, estoque, especificações, referências, aplicações e imagens em uma única transação SQL.

- **Parâmetro**: `{ produto: Produto }`
- **Retorno**: `Promise<number>` (ID gerado para o produto)

#### Exemplo de Payload (Post/Invoke)
```json
{
  "produto": {
    "codigo": "MTR-1002",
    "descricao": "Filtro de Óleo Gol 1.0",
    "descricao_complementar": "Filtro de óleo lubrificante de motor",
    "grupo_id": 1,
    "marca_id": 1,
    "codigo_original": "030115561A",
    "referencia": "WOE-312",
    "codigo_barras": "7891234567890",
    "peso_liquido": 0.35,
    "peso_bruto": 0.40,
    "altura": 10.0,
    "largura": 8.0,
    "comprimento": 8.0,
    "ativo": true,
    "preco": {
      "custo_compra": 15.50,
      "custo_impostos": 2.50,
      "preco_venda": 35.00,
      "margem_lucro": 55.5,
      "markup": 100.0
    },
    "estoque": [
      {
        "filial_id": 1,
        "estoque_atual": 15.0,
        "estoque_reservado": 2.0,
        "estoque_disponivel": 13.0,
        "estoque_minimo": 5.0,
        "controla_estoque": true,
        "rua": "A",
        "prateleira": "03",
        "nivel": "B",
        "posicao": "12"
      }
    ],
    "fiscal": {
      "ncm": "84212300",
      "origem_mercadoria": 0
    },
    "especificacoes": [
      {
        "tipo_id": 1,
        "especificacao": "Rosca M20x1.5"
      }
    ],
    "referencias": [
      {
        "fabricante_id": 2,
        "codigo_referencia": "PSL561"
      }
    ],
    "aplicacoes": [
      {
        "modelo": "Gol",
        "ano_inicial": 2010,
        "ano_final": 2015,
        "detalhes": "Motor 1.0 8V"
      }
    ],
    "imagens": [
      {
        "url_imagem": "https://exemplo.com/imagens/filtro.jpg"
      }
    ]
  }
}
```

- **Result (Retorno)**:
```json
12
```

---

### `atualizar_produto`
Atualiza todas as informações do produto e recria/ajusta os registros relacionados.

- **Parâmetro**: `{ produto: Produto }` (Requer `id` preenchido no objeto `produto`)
- **Retorno**: `Promise<void>`

---

### `deletar_produto`
Remove o produto do banco e apaga todas as informações agregadas (fotos, estoque, especificações, etc.) via restrições `ON DELETE CASCADE`.

- **Parâmetro**: `{ id: number }`
- **Retorno**: `Promise<void>`

---

### `buscar_produto`
Recupera os detalhes de um produto e agrupa todas as relações num objeto único e estruturado.

- **Parâmetro**: `{ id: number }`
- **Retorno**: `Promise<Produto | null>`

#### Exemplo de Result (Sucesso)
```json
{
  "id": 12,
  "codigo": "MTR-1002",
  "descricao": "Filtro de Óleo Gol 1.0",
  "descricao_complementar": "Filtro de óleo lubrificante de motor",
  "grupo_id": 1,
  "grupo_descricao": "Filtros",
  "categoria_descricao": "Motor",
  "marca_id": 1,
  "marca_nome": "Mann Filter",
  "aplicacao_lista_id": 3,
  "codigo_original": "030115561A",
  "referencia": "WOE-312",
  "codigo_barras": "7891234567890",
  "peso_liquido": 0.35,
  "peso_bruto": 0.40,
  "altura": 10.0,
  "largura": 8.0,
  "comprimento": 8.0,
  "ativo": true,
  "criado_em": "2026-06-13T19:10:00Z",
  "atualizado_em": "2026-06-13T19:10:00Z",
  "preco": {
    "id": 5,
    "produto_id": 12,
    "custo_compra": 15.5,
    "custo_impostos": 2.5,
    "preco_venda": 35.0,
    "simetria_preco": null,
    "margem_lucro": 55.5,
    "markup": 100.0,
    "preco_promocional": null,
    "promocao_inicio": null,
    "promocao_fim": null,
    "atualizado_em": "2026-06-13T19:10:00Z"
  },
  "estoque": [
    {
      "id": 8,
      "produto_id": 12,
      "filial_id": 1,
      "estoque_atual": 15.0,
      "estoque_reservado": 2.0,
      "estoque_disponivel": 13.0,
      "estoque_minimo": 5.0,
      "estoque_maximo": null,
      "controla_estoque": true,
      "rua": "A",
      "prateleira": "03",
      "nivel": "B",
      "posicao": "12",
      "atualizado_em": "2026-06-13T19:10:00Z"
    }
  ],
  "fiscal": {
    "id": 4,
    "produto_id": 12,
    "ncm": "84212300",
    "cest": null,
    "origem_mercadoria": 0,
    "csosn": null,
    "cst_icms": null,
    "cst_pis": null,
    "cst_cofins": null,
    "cst_ipi": null,
    "aliquota_icms": null,
    "aliquota_icms_st": null,
    "aliquota_pis": null,
    "aliquota_cofins": null,
    "aliquota_ipi": null,
    "cfop_saida": null,
    "cfop_entrada": null,
    "criado_em": "2026-06-13T19:10:00Z",
    "atualizado_em": "2026-06-13T19:10:00Z"
  },
  "especificacoes": [
    {
      "id": 2,
      "produto_id": 12,
      "tipo_id": 1,
      "especificacao": "Rosca M20x1.5",
      "tipo_especificacao": "Rosca"
    }
  ],
  "referencias": [
    {
      "id": 3,
      "produto_id": 12,
      "fabricante_id": 2,
      "fabricante_nome": "Tecfil",
      "codigo_referencia": "PSL561"
    }
  ],
  "aplicacoes": [
    {
      "id": 6,
      "lista_id": 3,
      "modelo": "Gol",
      "ano_inicial": 2010,
      "ano_final": 2015,
      "detalhes": "Motor 1.0 8V"
    }
  ],
  "imagens": [
    {
      "id": 1,
      "url_imagem": "https://exemplo.com/imagens/filtro.jpg"
    }
  ]
}
```

---

### `listar_produtos`
Lista os produtos cadastrados com opções de busca textual. Retorna dados simplificados de preço e estoques na mesma resposta para otimização de telas.

- **Parâmetro**: `{ querySearch?: string }`
- **Retorno**: `Promise<Produto[]>`

---

## 2. Tabelas Auxiliares (Cadastros Rápidos)

### `criar_categoria`
- **Parâmetro**: `{ descricao: string }`
- **Retorno**: `Promise<number>` (ID da nova categoria)

### `listar_categorias`
- **Parâmetro**: Nenhum
- **Retorno**: `Promise<ProdutoCategoria[]>`

---

### `criar_grupo`
- **Parâmetro**: `{ categoriaId: number, grupoParentId: number | null, descricao: string | null }`
- **Retorno**: `Promise<number>` (ID do novo grupo)

### `listar_grupos`
- **Parâmetro**: Nenhum
- **Retorno**: `Promise<ProdutoGrupo[]>`

---

### `criar_fabricante`
- **Parâmetro**: `{ nome: string }`
- **Retorno**: `Promise<number>` (ID do fabricante)

### `listar_fabricantes`
- **Parâmetro**: Nenhum
- **Retorno**: `Promise<ProdutoFabricante[]>`
