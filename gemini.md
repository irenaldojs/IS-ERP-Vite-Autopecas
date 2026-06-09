# IS-ERP Autopeças - Diretrizes e Relatório de Desenvolvimento

> [!IMPORTANT]
> **Nota para as IAs (System Prompt / Contexto):**  
> Leia este documento antes de realizar qualquer alteração no projeto. Ele lista as dependências oficiais instaladas e descreve o estado atual da aplicação para evitar regressões, duplicações de código ou incompatibilidades de dependências.

---

## 1. Dependências do Projeto (package.json)

Sempre verifique as versões das dependências instaladas para evitar erros de build com TypeScript ou Tailwind v4:

### Dependências Principais (`dependencies`)
*   `react`: `^19.1.0` (React 19.x)
*   `react-dom`: `^19.1.0`
*   `@tauri-apps/api`: `^2` (Tauri v2 API)
*   `@tauri-apps/plugin-opener`: `^2` (Tauri v2 Opener)
*   `lucide-react`: `^1.17.0` (Pacote de ícones)
*   `radix-ui`: `^1.5.0`
*   `shadcn`: `^4.11.0`
*   `class-variance-authority`: `^0.7.1`
*   `clsx`: `^2.1.1`
*   `tailwind-merge`: `^3.6.0`
*   `tw-animate-css`: `^1.4.0`
*   `@fontsource-variable/geist`: `^5.2.9` (Fonte padrão)

### Dependências de Desenvolvimento (`devDependencies`)
*   `vite`: `^7.0.4` (Vite v7)
*   `@tailwindcss/vite`: `^4.3.0` (Compilador oficial do Tailwind CSS v4 para Vite)
*   `tailwindcss`: `^4.3.0` (Tailwind CSS v4)
*   `typescript`: `~5.8.3`
*   `@tauri-apps/cli`: `^2` (CLI do Tauri v2)
*   `@vitejs/plugin-react`: `^4.6.0`
*   `@types/react`: `^19.1.8`
*   `@types/react-dom`: `^19.1.6`
*   `@types/node`: `^25.9.2`

---

## 2. Tecnologias & Arquitetura de Design

*   **Core**: React 19 + TypeScript + Vite 7 + Tauri v2 (Shell/Desktop Wrapper).
*   **Estilização**: Tailwind CSS v4 utilizando o plugin `@tailwindcss/vite` (importado diretamente via `index.css`).
*   **Design Visual (Premium Dark ERP)**:
    *   Fundo principal escuro e profundo (`bg-[#070a13]`).
    *   Painéis, tabelas e cards em tom escuro azulado (`bg-[#0e1626]`) com bordas sutis (`border-slate-850`).
    *   Glow effects em gradientes indigo/violeta em interações.
    *   Estrutura altamente compacta, responsiva e com foco em alta densidade de dados para operação rápida de autopeças.

---

## 3. Estrutura de Pastas e Componentes Principais

```
src/
├── components/
│   ├── dashboard/
│   │   └── ModuleCard.tsx          # Card compacto quadrado para acesso aos módulos no painel principal
│   ├── layout/
│   │   ├── DashboardLayout.tsx     # Layout geral com Topbar, Sidebar no estilo VS Code e container flex
│   │   ├── ModuleTabContainer.tsx  # Gerenciador de sub-telas (abas) de cada módulo, com isolamento de estado
│   │   ├── Sidebar.tsx             # Menu lateral estreito com tooltips e indicador vertical ativo
│   │   └── Topbar.tsx              # Barra superior contendo relógio em tempo real, info do Caixa-01 e perfil
│   └── ui/
│       └── button.tsx              # Componente customizado de botão
├── lib/                            # Helpers e utilitários
├── App.tsx                         # Core do ERP (Gerencia estado do módulo ativo e renderiza sub-telas)
├── index.css                       # Design tokens, variáveis CSS e import do Tailwind v4
└── main.tsx                        # Entry point do React 19
```

---

## 4. Resumo dos Módulos Implementados

### A. Painel Principal (Dashboard / Home)
*   Grid de acesso aos 5 módulos operacionais ativos.
*   **Painel de Desenvolvimento**: Exibe o status da conexão (Vite Browser ou Tauri Shell) e formulário para testar a comunicação com a API do Tauri em Rust (`greet`).

### B. Vendas & Orçamentos (Module: `vendas`)
1.  **Orçamento**: Listagem de orçamentos emitidos com indicador de status coloridos (`Aprovado`, `Aguardando`, `Cancelado`).
2.  **Whatsapp**: Chat mockado com o cliente para negociação de orçamentos diretamente pela interface do ERP.
3.  **Pré-Vendas**: Carrinho de itens mockados que calcula subtotal, descontos e total líquido, com opções de formas de pagamento (PIX / Cartão).
4.  **Entregas**: Listagem rápida das ordens de entrega ativas do dia.
5.  **Relatório**: Métricas rápidas de faturamento, ticket médio e gráfico de barras estilizado via CSS mostrando vendas semanais.

### C. Frente de Caixa (Module: `caixa`)
1.  **Pré-Vendas**: Tabela de pré-vendas aguardando recebimento e emissão de documento fiscal.
2.  **Emissão**: Gerenciamento de notas fiscais (NFC-e / NF-e) emitidas e status de retorno da Sefaz com botão para impressão do DANFE.
3.  **Caixa**: Resumo financeiro do turno atual (Abertura, Entradas, Sangria e Saldo) e ações administrativas (Sangria, Suprimento e Fechar Caixa).
4.  **Modo de Foco (Tela Cheia)**: Opção de maximizar o painel do Caixa, ocultando a barra lateral e superior do ERP para foco total do operador do PDV, com botão vermelho de escape destacado ("Voltar ao Sistema").

### D. Controle de Estoque (Module: `estoque`)
1.  **Entrada**: Área para upload/importação de XML de Notas Fiscais de fornecedores e controle de lançamentos manuais.
2.  **Cadastro**: Formulário completo para cadastrar novas autopeças (Código, Descrição, Marca, Categoria, Preço de Custo e Venda).
3.  **Balanço**: Controle de inventário contínuo com barras de progresso de contagem de estoque por setores/estantes.
4.  **Lista**: Catálogo geral de produtos com indicadores coloridos de nível de estoque (verde para normal, vermelho piscando para crítico).

### E. Controle de Garantias (Module: `garantia`)
1.  **Pendentes**: Abertura e acompanhamento de chamados de garantia com contagem de dias decorridos.
2.  **Enviadas**: Rastreio de peças despachadas para análise dos fabricantes com número de Nota Fiscal de remessa.
3.  **Retorno**: Visualização dos laudos finais de fabricantes (Procedente / Improcedente) com atalho para gerar crédito de troca ao cliente.
4.  **Arquivo**: Histórico e fechamento de garantias concluídas.

### F. Logística & Entregas (Module: `entregas`)
1.  **Baias**: Gerenciamento de baias físicas de separação e carregamento de mercadorias agrupadas por zona (Sul, Oeste, Norte).
2.  **Enviando**: Rastreamento de ordens de entrega em trânsito com horários de saída e condutores.
3.  **Mapa**: Interface com rotas vetoriais (SVG) mockadas mostrando portadores ativos no mapa em tempo real.
4.  **Frota**: Cadastro e status dos veículos da empresa (placas, motoristas e pendências de manutenção).

### G. Fluxo Financeiro (Module: `financas`)
1.  **Contas a Receber**: Listagem e gerenciamento de faturas de clientes, filtros por status e cobrança rápida via WhatsApp.
2.  **Contas a Pagar**: Controle de compromissos de fornecedores e despesas com indicadores de vencimento coloridos e baixa manual.
3.  **Fluxo de Caixa**: Conciliação de saldos em bancos (Itaú, Bradesco) e caixas internos, acompanhada de histórico detalhado de lançamentos diários.
4.  **DRE Simplificado**: Demonstrativo de resultado do exercício sob o regime de caixa.

### H. Faturamento & Fiscal (Module: `faturamento`)
1.  **Painel Fiscal (Sefaz Monitor)**: Monitoramento de notas emitidas com status de aprovação em tempo real pela SEFAZ, download de XML/DANFE e opção de correção de erros.
2.  **Regras Tributárias**: Cadastro e parametrização de alíquotas de ICMS, ICMS ST (MVA) e PIS/COFINS por códigos NCM e CEST de autopeças.
3.  **CC-e & Cancelamento**: Histórico e transmissão de Cartas de Correção Eletrônica e cancelamentos de notas homologados pela SEFAZ.
4.  **Faturamento Consol.**: Métricas fiscais consolidadas e gráfico de faturamento diário gerado em CSS.

### I. Painel Gerencial (Module: `gerencia`)
1.  **Painel Executivo (BI)**: Dashboard de alta gerência com ticket médio, margens acumuladas, produto curva ABC, metas e participação de mercado de fabricantes.
2.  **Usuários & Permissões**: Matriz de acessos interativa por cargo utilizando checkboxes funcionais.
3.  **Configurações**: Dados cadastrais da empresa, comissionamento de vendas e controle de certificado digital A1.
4.  **Logs de Auditoria**: Rastreabilidade de ações críticas (descontos e exclusões) por nível de prioridade (Crítico, Aviso, Info).

---

## 5. Práticas e Fixes Importantes Aplicados

*   **Evitando Bleed de Estados de Abas**: Para evitar que a mudança de módulos principais mantivesse o estado das sub-abas internas desalinhado, todas as chamadas do componente `<ModuleTabContainer>` em `App.tsx` utilizam chaves únicas (`key="vendas"`, `key="caixa"`, etc.), forçando o React a recriar o container e redefinir o estado da aba ativa para o padrão quando o módulo é trocado.
*   **z-index do Dropdown de Perfil**: Ajustado o empilhamento da barra superior (`relative z-50` no header) para garantir que o menu suspenso do perfil de usuário (`z-50` interno) sobreponha corretamente o conteúdo principal e a barra de navegação lateral.
*   Viewport sem Scroll Geral: A aplicação foi ajustada para se comportar como uma aplicação desktop nativa (Tauri), utilizando `h-screen` e `overflow-hidden` nas bordas mais externas, canalizando qualquer barra de rolagem apenas dentro dos painéis internos de dados de cada tela.
