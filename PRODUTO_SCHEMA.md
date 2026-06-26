# Guia de Estrutura de Importação de Produtos

Este documento serve como referência e **prompt** para que uma Inteligência Artificial possa extrair dados de catálogos brutificados (PDFs, planilhas, sites) e estruturá-los em um arquivo JSON válido e compatível com o sistema de importação de autopeças.

---

## Princípios Gerais

### REGRA DE OTIMIZAÇÃO DE TOKENS

As estruturas:
- `aplicacoes`
- `referencias_cruzadas`
- `especificacoes_tecnicas`

devem utilizar **arrays posicionais**. Não utilizar objetos chave/valor nestas estruturas.

> [!IMPORTANT]
> A ordem dos campos torna-se obrigatória e faz parte da especificação. A IA deve sempre respeitar a ordem definida.
> Quero que traga todas as informações de aplicações possíveis, sem deixar nenhuma (traga todos os carros e suas informações atualizadas).
> Output: Somente o objeto JSON, sem texto explicativo.

---

## 1. Esquema Relacional do Banco de Dados (SQLite)

O banco de dados armazena produtos, preços, estoques, regras fiscais e vinculação de compatibilidade veicular (aplicação) nas seguintes tabelas:

```sql
-- Categoria do produto (Ex: Motor, Suspensão, Freios)
CREATE TABLE produto_categoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL
);

-- Grupo do produto associado a uma categoria (Ex: Filtros, Amortecedores)
CREATE TABLE produto_grupo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoria_id INTEGER NOT NULL REFERENCES produto_categoria(id),
    grupo_parent_id INTEGER REFERENCES produto_grupo(id) ON DELETE SET NULL,
    descricao TEXT
);

-- Fabricante/Marca industrial da peça (Ex: Bosch, Metal Leve, Magneti Marelli)
CREATE TABLE produto_fabricante (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

-- Marca/Montadora de carros (Ex: Volkswagen, Fiat, Chevrolet)
CREATE TABLE carro_montadora (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

-- Tabela de produtos (SKU, descrição, dimensões e controle de status)
CREATE TABLE produto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL UNIQUE,          -- SKU Interno da Loja
    descricao TEXT,                       -- Nome principal da peça
    descricao_complementar TEXT,          -- Detalhes adicionais
    grupo_id INTEGER NOT NULL REFERENCES produto_grupo(id),
    marca_id INTEGER NOT NULL REFERENCES produto_fabricante(id),
    aplicacao_lista_id INTEGER REFERENCES produto_aplicacao_lista(id) ON DELETE SET NULL,
    codigo_original TEXT NOT NULL,        -- Código original da montadora (OEM)
    referencia TEXT,                      -- Código do fabricante da peça
    codigo_barras TEXT,                   -- Código EAN (apenas números)
    peso_liquido REAL,
    peso_bruto REAL,
    altura REAL,
    largura REAL,
    comprimento REAL,
    ativo INTEGER NOT NULL DEFAULT 1,     -- 1 para Ativo, 0 para Inativo
    criado_em TEXT NOT NULL,
    atualizado_em TEXT NOT NULL
);

-- Relação de Aplicações/Compatibilidade
CREATE TABLE produto_aplicacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lista_id INTEGER NOT NULL REFERENCES produto_aplicacao_lista(id) ON DELETE CASCADE,
    montadora_id INTEGER NOT NULL REFERENCES carro_montadora(id) ON DELETE CASCADE,
    modelo TEXT NOT NULL,                 -- Modelo do veículo (Ex: Gol 1.0 8V Power)
    ano_inicial INTEGER,                  -- Ano inicial compatível (Ex: 2008)
    ano_final INTEGER,                    -- Ano final compatível (Ex: 2012)
    detalhes TEXT                         -- Motorização, observações adicionais
);

-- Referências cruzadas com outros fabricantes (Códigos equivalentes)
CREATE TABLE produto_referencia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER NOT NULL REFERENCES produto(id) ON DELETE CASCADE,
    fabricante_id INTEGER NOT NULL REFERENCES produto_fabricante(id),
    codigo_referencia TEXT NOT NULL       -- Ex: PH5548, GI04/7
);

-- Detalhes de Preço do Produto
CREATE TABLE produto_preco (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER NOT NULL REFERENCES produto(id) ON DELETE CASCADE,
    custo_compra REAL NOT NULL DEFAULT 0, -- Preço líquido pago à distribuidora
    custo_impostos REAL NOT NULL DEFAULT 0, -- IPI, ST, etc.
    preco_venda REAL NOT NULL DEFAULT 0,   -- Preço de venda ao consumidor
    atualizado_em TEXT NOT NULL
);

-- Detalhes de Estoque por Filial
CREATE TABLE produto_estoque (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER NOT NULL REFERENCES produto(id) ON DELETE CASCADE,
    filial_id INTEGER NOT NULL,            -- ID da loja (Filial Padrão é 1)
    estoque_atual REAL NOT NULL DEFAULT 0,
    estoque_reservado REAL NOT NULL DEFAULT 0,
    estoque_disponivel REAL NOT NULL DEFAULT 0,
    estoque_minimo REAL NOT NULL DEFAULT 0,
    estoque_maximo REAL,
    controla_estoque INTEGER NOT NULL DEFAULT 1, -- 1 para Sim, 0 para Não
    rua TEXT,                              -- Localização física
    prateleira TEXT,
    nivel TEXT,
    posicao TEXT,
    atualizado_em TEXT NOT NULL
);

-- Dados Fiscais de Entrada e Saída
CREATE TABLE produto_fiscal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER NOT NULL REFERENCES produto(id) ON DELETE CASCADE,
    ncm TEXT NOT NULL,                     -- Código NCM (8 dígitos numéricos)
    cest TEXT,                             -- Código CEST (7 dígitos numéricos)
    origem_mercadoria INTEGER NOT NULL,    -- 0=Nacional, 1=Importação direta, 2=Importação interna
    criado_em TEXT NOT NULL,
    atualizado_em TEXT NOT NULL
);
```

---

## 2. Estrutura do JSON de Importação

A IA deve gerar um **JSON Array** onde cada objeto representa um produto estruturado da seguinte forma. 

> [!NOTE]
> Para facilitar a importação sem que a IA precise saber previamente os IDs numéricos internos de chaves estrangeiras (`grupo_id`, `marca_id`, etc.), o importador aceita descrições textuais que serão automaticamente resolvidas ou criadas no banco de dados.

### Propriedades do Objeto Produto no JSON:

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :---: | :--- |
| `codigo` | String | **Sim** | Código SKU interno da peça (Ex: `"FLT-101"`). |
| `descricao` | String | **Sim** | Descrição principal da peça (Ex: `"Filtro de Óleo do Motor"`). |
| `descricao_complementar` | String | Não | Detalhes adicionais da peça. |
| `codigo_original` | String | **Sim** | Código original de fábrica / OEM (Ex: `"5U0127177B"`). Se não houver, repetir o SKU ou usar `"N/A"`. |
| `referencia` | String | Não | Código de referência do fabricante / Resumo da aplicação (Ex: `"Fox Gol Polo"`). |
| `codigo_barras` | String | Não | Código de barras EAN (somente dígitos numéricos). |
| `categoria_descricao` | String | **Sim** | Nome textual da Categoria (Ex: `"Motor"`). Será criada se não existir. |
| `grupo_descricao` | String | **Sim** | Nome textual do Grupo (Ex: `"Filtros"`). Será criado se não existir. |
| `marca_nome` | String | **Sim** | Nome da fabricante da peça (Ex: `"Fram"`). Será criada se não existir. |
| `peso_liquido` | Number | Não | Peso líquido do produto em Kg. |
| `peso_bruto` | Number | Não | Peso bruto do produto em Kg. |
| `altura` | Number | Não | Altura da embalagem em cm. |
| `largura` | Number | Não | Largura da embalagem em cm. |
| `comprimento` | Number | Não | Comprimento da embalagem em cm. |
| `preco` | Objeto | Não | Objeto contendo os custos e preços da peça (veja estrutura abaixo). |
| `estoque` | Objeto | Não | Objeto com as informações de estoque (veja estrutura abaixo). |
| `fiscal` | Objeto | Não | Objeto contendo dados fiscais essenciais (veja estrutura abaixo). |
| `aplicacoes` | Array | Não | Lista compactada de veículos compatíveis (posicional - veja abaixo). |
| `referencias_cruzadas` | Array | Não | Lista compactada de códigos equivalentes (posicional - veja abaixo). |
| `especificacoes_tecnicas` | Array | Não | Lista compactada de especificações técnicas (posicional - veja abaixo). |
| `imagens` | Array | Não | Array simples de URLs das imagens. |

---

### Detalhe de Sub-Objetos e Arrays Compactados

#### Objeto `preco`
- `custo_compra` (Number, Obrigatório se `preco` fornecido): Preço unitário pago pelo produto (Ex: `25.50`).
- `custo_impostos` (Number, Opcional): Valor de impostos associados à compra (Ex: `3.20`).
- `preco_venda` (Number, Obrigatório se `preco` fornecido): Preço de venda praticado (Ex: `49.90`).

#### Objeto `estoque`
- `estoque_atual` (Number, Obrigatório): Quantidade física atual em estoque (Ex: `10`).
- `estoque_minimo` (Number, Opcional): Estoque mínimo de segurança (Ex: `2`).
- `rua` (String, Opcional): Prateleira/Corredor (Ex: `"A"`).
- `prateleira` (String, Opcional): Prateleira específica (Ex: `"04"`).

#### Objeto `fiscal`
- `ncm` (String, Obrigatório): Código NCM (Ex: `"84212300"`).
- `cest` (String, Opcional): Código CEST (Ex: `"01.001.00"`).
- `origem_mercadoria` (Number, Opcional - Default `0`): `0` = Nacional, `1` = Importação Direta, `2` = Importação Interna.

---

### Estruturas Compactadas para Importação (Regras de Arrays Posicionais)

#### 1. Array `aplicacoes`
Deve utilizar arrays posicionais em vez de objetos chave/valor. 

**Ordem dos campos:**
```text
[
  Montadora,
  Veículo,
  Ano Inicial,
  Ano Final,
  Detalhes
]
```

**Regras:**
| Posição | Campo | Descrição / Tipo |
| :---: | :--- | :--- |
| 0 | Montadora | Marca fabricante do veículo (Ex: `"Volkswagen"`) |
| 1 | Veículo | Modelo/nome do carro (Ex: `"Fox"`) |
| 2 | Ano Inicial | Ano inicial do veículo (Ex: `2004` ou `null`) |
| 3 | Ano Final | Ano final do veículo (Ex: `2014` ou `null`) |
| 4 | Detalhes | Informações complementares (Ex: `"1.0/1.6 8v"` ou `""`) |

*Obs: Campos vazios de String use `""`, e de Int/Number use `null`.*

#### 2. Array `referencias_cruzadas`
Deve utilizar arrays posicionais.

**Ordem dos campos:**
```text
[
  Fabricante,
  Código Referência
]
```

**Regras:**
| Posição | Campo | Descrição / Tipo |
| :---: | :--- | :--- |
| 0 | Fabricante | Nome do fabricante concorrente (Ex: `"Bosch"`) |
| 1 | Código Referência | Código equivalente (Ex: `"F00099C125"`) |

#### 3. Array `especificacoes_tecnicas`
Toda especificação técnica deve ser armazenada em formato compacto.

**Ordem dos campos:**
```text
[
  Tipo de Especificação,
  Valor
]
```

**Regras:**
| Posição | Campo | Descrição / Tipo |
| :---: | :--- | :--- |
| 0 | Tipo de Especificação | Nome do atributo (Ex: `"Comprimento"`) |
| 1 | Valor | Medida/Valor correspondente (Ex: `"450mm"`) |

#### 4. Array `imagens`
Deve ser um array simples contendo apenas as URLs das fotos do produto dentro do catálogo.

---

## 3. Exemplo Prático de JSON Válido

Abaixo está um exemplo de payload completo no formato compacto que a IA deve gerar para ser importado diretamente pelo ERP:

```json
[
  {
    "codigo": "FLT-101",
    "descricao": "Filtro de Óleo do Motor Gol/Fox 1.0/1.6",
    "descricao_complementar": "Filtro blindado de óleo lubrificante",
    "codigo_original": "030115561AN",
    "referencia": "Fox Gol Polo",
    "codigo_barras": "7891234567890",
    "categoria_descricao": "Motor",
    "grupo_descricao": "Filtros",
    "marca_nome": "Fram",
    "peso_liquido": 0.320,
    "peso_bruto": 0.350,
    "altura": 9.0,
    "largura": 8.0,
    "comprimento": 8.0,
    "preco": {
      "custo_compra": 15.30,
      "custo_impostos": 2.10,
      "preco_venda": 35.00
    },
    "estoque": {
      "estoque_atual": 15,
      "estoque_minimo": 3,
      "rua": "Corredor B",
      "prateleira": "Estante 2",
      "nivel": "Nível 1"
    },
    "fiscal": {
      "ncm": "84212300",
      "cest": "0101700",
      "origem_mercadoria": 0
    },
    "aplicacoes": [
      ["Volkswagen", "Gol", 2008, 2012, "G5 1.6 8v"],
      ["Volkswagen", "Fox", 2004, 2014, "1.0/1.6 8v"]
    ],
    "referencias_cruzadas": [
      ["Tecfil", "PSL560"],
      ["Mann Filter", "W712/5"]
    ],
    "especificacoes_tecnicas": [
      ["Comprimento", "450mm"],
      ["Material", "Silicone"],
      ["Resistência Interna", "5kΩ"]
    ],
    "imagens": [
      "https://img.autopecas.com.br/produtos/flt-101.jpg"
    ]
  }
]
```

Use esta especificação exata para orientar o mapeamento de qualquer catálogo bruto para o nosso banco de dados relacional.

