---
name: tauri-sqlite-patterns
description: Boas práticas para integração Tauri + SQLite. Use quando criar comandos, repositórios, migrations ou consultas.
---

# Tauri SQLite Patterns

## Objetivo

Garantir acesso eficiente ao banco SQLite através do backend Rust.

## Regras

- React nunca acessa SQLite diretamente.
- Todo acesso passa por Tauri Commands.
- Queries complexas ficam em Repository.
- Sempre criar índices para campos de busca.
- Evitar SELECT *.
- Utilizar migrations versionadas.

## Fluxo recomendado

React
↓
Service
↓
Tauri Command
↓
Repository
↓
SQLite

## Convenções

- Um repository por agregado.
- DTOs para comunicação React ↔ Tauri.
- Transações para operações críticas.
