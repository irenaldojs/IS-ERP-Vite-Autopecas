---
name: erp-architecture
description: Especialista em arquitetura de ERP modular usando React, TypeScript, Tauri e SQLite. Use quando criar módulos, entidades, fluxos de negócio ou integrações.
---

# ERP Architecture

## Objetivo

Projetar sistemas ERP modulares escaláveis.

## Stack padrão

- Vite
- React
- TypeScript
- Tauri
- SQLite
- Fluent UI

## Regras

- Organizar por módulos de negócio.
- Evitar dependências circulares.
- Cada módulo possui:
  - domain
  - application
  - infrastructure
  - ui
- Preferir Modular Monolith.
- Utilizar Repository Pattern.
- Utilizar Services para regras de negócio.
- Nunca colocar regra de negócio em componentes React.

## Módulos sugeridos

- Vendas
- Caixa
- Produtos
- Estoque
- Compras
- Garantia
- Faturamento
- Financeiro
- Gerencia
- Configurações
