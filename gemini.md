# IS-ERP Autopeças - Diretrizes e Resumo de Projeto

> [!IMPORTANT]
> Leia este documento antes de alterar o projeto. Ele resume as dependências e o estado atual da aplicação para evitar regressões e incompatibilidades.

---

## 1. Dependências Principais

### `dependencies`
* `react` ^19.1.0
* `react-dom` ^19.1.0
* `react-router-dom` ^7.17.0
* `@tauri-apps/api` ^2
* `@tauri-apps/plugin-opener` ^2
* `lucide-react` ^1.17.0
* `radix-ui` ^1.5.0
* `shadcn` ^4.11.0
* `class-variance-authority` ^0.7.1
* `clsx` ^2.1.1
* `tailwind-merge` ^3.6.0
* `tw-animate-css` ^1.4.0
* `@fontsource-variable/geist` ^5.2.9
* `zustand` ^5.0.14

### `devDependencies`
* `vite` ^7.0.4
* `@tailwindcss/vite` ^4.3.0
* `tailwindcss` ^4.3.0
* `typescript` ~5.8.3
* `@tauri-apps/cli` ^2
* `@vitejs/plugin-react` ^4.6.0
* `@types/react` ^19.1.8
* `@types/react-dom` ^19.1.6
* `@types/node` ^25.9.2

---

## 2. Arquitetura
* React 19 + TypeScript + Vite 7 + Tauri v2.
* Tailwind CSS v4 via `@tailwindcss/vite`.
* UI escura, compacta e orientada a alta densidade de dados.

---

## 3. Estrutura Principal

* `src/App.tsx`: controle de módulo e renderização das telas.
* `src/main.tsx`: entrada do React.
* `src/index.css`: variáveis CSS, tokens e import do Tailwind.
* `src/components/layout/`: Layout geral, `Sidebar`, `Topbar`, `ModuleTabContainer`.
* `src/components/dashboard/ModuleCard.tsx`: cards para módulos.
* `src/components/ui/button.tsx`: botão customizado.
* `src/lib/`: utilitários.

---

## 4. Módulos Implementados

### `vendas`
* Pré-vendas com cálculo de total e opções de pagamento.
* Orçamentos / Lista de peças para enviar ao cliente.
* Entregas ativas.
* Relatório com métricas e gráfico de vendas.

### `caixa`
* Pré-vendas aguardando emissão.
* Emissão de notas fiscais e DANFE.
* Painel de caixa com saldos e sangria.
* Modo de foco em tela cheia.

### `estoque`
* Upload/importação de XML.
* Cadastro de produtos.
* Balanço de inventário.
* Lista de itens com alerta de estoque.

### `garantia`
* Chamados pendentes.
* Peças enviadas.
* Retornos de laudos.
* Arquivo de garantias concluídas.

### `entregas`
* Gestão de baias.
* Rastreamento de ordens.
* Mapa com rotas mockadas.
* Controle de frota.

### `financas`
* Contas a receber.
* Contas a pagar.
* Fluxo de caixa.
* DRE simplificado.

---

## 5. Ajustes Importantes
* `ModuleTabContainer` recebe `key` única por módulo para evitar estado persistente entre trocas.
* `Topbar` configurada com `z-50` para evitar problemas de sobreposição do dropdown.
* Layout desktop Tauri usa `h-screen` e `overflow-hidden` na raiz para rolagem apenas em painéis internos.
* **Teclas de Atalho / Fechamento de Modais**: Ao criar ou modificar modais/overlays na aplicação, é padrão do projeto utilizar o hook customizado `useEscapeKey` (`src/hooks/useEscapeKey.ts`) para garantir que pressionar a tecla `Esc` feche o modal de maneira uniforme e acessível.

