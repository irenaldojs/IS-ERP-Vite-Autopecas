import {
  Produto,
  ProdutoCategoria,
  ProdutoGrupo,
  ProdutoMarca,
  ProdutoAplicacaoLista,
  ProdutoTipoEspecificacao,
  ProdutoEspecificacao,
  CarroMontadora,
  CarroModelo,
  Imagem,
  ProdutoImagem,
} from "../src/types/products.entities";
import { Cliente } from "../src/types/customers.entities";
import { Endereco, Usuario } from "../src/types/infrastructure.entities";

export const produtoCategorias: ProdutoCategoria[] = [
  { id: 1, descricao: "Motor" },
  { id: 2, descricao: "Suspensão" },
  { id: 3, descricao: "Freios" },
  { id: 4, descricao: "Elétrica" },
  { id: 5, descricao: "Direção" },
  { id: 6, descricao: "Arrefecimento" },
  { id: 7, descricao: "Carroceria" },
];

export const produtoGrupos: ProdutoGrupo[] = [
  { id: 1, categoria_id: 1, descricao: "Filtros" },
  { id: 2, categoria_id: 1, descricao: "Correias e Tensores" },
  { id: 3, categoria_id: 1, descricao: "Velas e Cabos" },
  { id: 4, categoria_id: 2, descricao: "Amortecedores" },
  { id: 5, categoria_id: 2, descricao: "Molas" },
  { id: 6, categoria_id: 3, descricao: "Pastilhas e Discos" },
  { id: 7, categoria_id: 3, descricao: "Cilindros e Bombas" },
  { id: 8, categoria_id: 4, descricao: "Baterias" },
  { id: 9, categoria_id: 4, descricao: "Alternadores" },
  { id: 10, categoria_id: 5, descricao: "Caixas de Direção" },
  { id: 11, categoria_id: 6, descricao: "Radiadores" },
  { id: 12, categoria_id: 6, descricao: "Ventoinhas" },
  { id: 13, categoria_id: 7, descricao: "Parachoques" },
  { id: 14, categoria_id: 7, descricao: "Retrovisores" },
];

export const produtoMarcas: ProdutoMarca[] = [
  { id: 1, nome: "Bosch" },
  { id: 2, nome: "Valeo" },
  { id: 3, nome: "Monroe" },
  { id: 4, nome: "Fras-le" },
  { id: 5, nome: "Magneti Marelli" },
  { id: 6, nome: "Hella" },
  { id: 7, nome: "Mahle" },
  { id: 8, nome: "ZF Sachs" },
  { id: 9, nome: "Petronas" },
  { id: 10, nome: "Continental" },
];

export const carroMontadoras: CarroMontadora[] = [
  { id: 1, nome: "Volkswagen" },
  { id: 2, nome: "Fiat" },
  { id: 3, nome: "Chevrolet" },
  { id: 4, nome: "Ford" },
  { id: 5, nome: "Renault" },
  { id: 6, nome: "Honda" },
  { id: 7, nome: "Toyota" },
];

export const carroModelos: CarroModelo[] = [
  { id: 1, montadora_id: 1, nome: "Gol" },
  { id: 2, montadora_id: 1, nome: "Virtus" },
  { id: 3, montadora_id: 2, nome: "Uno" },
  { id: 4, montadora_id: 2, nome: "Toro" },
  { id: 5, montadora_id: 3, nome: "Onix" },
  { id: 6, montadora_id: 3, nome: "S10" },
  { id: 7, montadora_id: 4, nome: "Ka" },
  { id: 8, montadora_id: 4, nome: "Ranger" },
  { id: 9, montadora_id: 5, nome: "Sandero" },
  { id: 10, montadora_id: 5, nome: "Duster" },
  { id: 11, montadora_id: 6, nome: "Civic" },
  { id: 12, montadora_id: 6, nome: "HR-V" },
  { id: 13, montadora_id: 7, nome: "Corolla" },
  { id: 14, montadora_id: 7, nome: "Hilux" },
];

export const produtoAplicacaoListas: ProdutoAplicacaoLista[] = [
  {
    id: 1,
    aplicaoes: [
      { id: 1, lista_id: 1, modelo: "Gol", ano: "2013-2018", detalhes: "1.0/1.6 Aspirado" },
      { id: 2, lista_id: 1, modelo: "Uno", ano: "2010-2014", detalhes: "1.0/1.4 Fire" },
    ],
  },
  {
    id: 2,
    aplicaoes: [
      { id: 3, lista_id: 2, modelo: "Onix", ano: "2013-2019", detalhes: "1.0/1.4 8V" },
      { id: 4, lista_id: 2, modelo: "Gol", ano: "2016-2022", detalhes: "1.0 TSI" },
    ],
  },
  {
    id: 3,
    aplicaoes: [
      { id: 5, lista_id: 3, modelo: "Toro", ano: "2016-2023", detalhes: "2.0 Diesel" },
      { id: 6, lista_id: 3, modelo: "Ranger", ano: "2012-2022", detalhes: "3.2 Diesel" },
    ],
  },
  {
    id: 4,
    aplicaoes: [
      { id: 7, lista_id: 4, modelo: "Corolla", ano: "2019-2024", detalhes: "1.8 Flex" },
      { id: 8, lista_id: 4, modelo: "Civic", ano: "2012-2016", detalhes: "2.0 16V" },
    ],
  },
  {
    id: 5,
    aplicaoes: [
      { id: 9, lista_id: 5, modelo: "Virtus", ano: "2020-2024", detalhes: "1.0 TSI" },
      { id: 10, lista_id: 5, modelo: "Sandero", ano: "2015-2020", detalhes: "1.0 SCe" },
    ],
  },
  {
    id: 6,
    aplicaoes: [
      { id: 11, lista_id: 6, modelo: "S10", ano: "2012-2018", detalhes: "2.5 Flex" },
      { id: 12, lista_id: 6, modelo: "HR-V", ano: "2016-2022", detalhes: "1.8 Flex" },
    ],
  },
];

export const produtoTipoEspecificacoes: ProdutoTipoEspecificacao[] = [
  { id: 1, tipo_especificacao: "Material" },
  { id: 2, tipo_especificacao: "Diâmetro" },
  { id: 3, tipo_especificacao: "Voltagem" },
  { id: 4, tipo_especificacao: "Capacidade" },
  { id: 5, tipo_especificacao: "Grau de Dureza" },
  { id: 6, tipo_especificacao: "Tipo de Motor" },
  { id: 7, tipo_especificacao: "Código OEM" },
];

export const produtoEspecificacoes: ProdutoEspecificacao[] = [
  { id: 1, produto_id: 1, tipo_id: 1, especificacao: "Celulose reforçada" },
  { id: 2, produto_id: 1, tipo_id: 7, especificacao: "06H 115 561 A" },
  { id: 3, produto_id: 2, tipo_id: 2, especificacao: "150 mm" },
  { id: 4, produto_id: 2, tipo_id: 5, especificacao: "Dureza 45 HRC" },
  { id: 5, produto_id: 3, tipo_id: 3, especificacao: "12 V" },
  { id: 6, produto_id: 3, tipo_id: 4, especificacao: "60 Ah" },
  { id: 7, produto_id: 4, tipo_id: 1, especificacao: "Carboneto cerâmico" },
  { id: 8, produto_id: 4, tipo_id: 7, especificacao: "951 769 86" },
  { id: 9, produto_id: 5, tipo_id: 2, especificacao: "46 mm" },
  { id: 10, produto_id: 5, tipo_id: 6, especificacao: "Gasolina / Flex" },
  { id: 11, produto_id: 6, tipo_id: 1, especificacao: "Aço de alta resistência" },
  { id: 12, produto_id: 6, tipo_id: 7, especificacao: "993 016 900" },
  { id: 13, produto_id: 7, tipo_id: 1, especificacao: "Nylon reforçado" },
  { id: 14, produto_id: 7, tipo_id: 7, especificacao: "1K0 121 281 A" },
  { id: 15, produto_id: 8, tipo_id: 2, especificacao: "320 mm" },
  { id: 16, produto_id: 8, tipo_id: 5, especificacao: "Grau 4.8" },
  { id: 17, produto_id: 9, tipo_id: 3, especificacao: "12 V" },
  { id: 18, produto_id: 9, tipo_id: 4, especificacao: "85 Ah" },
  { id: 19, produto_id: 10, tipo_id: 1, especificacao: "Silicone de alta temperatura" },
  { id: 20, produto_id: 10, tipo_id: 7, especificacao: "CNH 502311" },
  { id: 21, produto_id: 11, tipo_id: 1, especificacao: "Plástico ABS" },
  { id: 22, produto_id: 11, tipo_id: 7, especificacao: "9S7Z-17K707-AA" },
  { id: 23, produto_id: 12, tipo_id: 1, especificacao: "Aço galvanizado" },
  { id: 24, produto_id: 12, tipo_id: 2, especificacao: "12 mm" },
];

export const imagens: Imagem[] = [
  { id: 1, url_imagem: "https://apolloautopecas.com.br/wp-content/uploads/2024/11/filtro_ARL4154_03-300x300.webp" },
  { id: 2, url_imagem: "https://http2.mlstatic.com/D_NQ_NP_802387-MLB52519108388_112022-O.webp" },
  { id: 3, url_imagem: "https://i0.wp.com/grubaterias.com.br/wp-content/uploads/2020/03/bateria-de-carro-moura-agm-start-stop-1.jpg?resize=300%2C300&quality=89&ssl=1" },
  { id: 4, url_imagem: "https://http2.mlstatic.com/D_NQ_NP_632729-MLB106540127854_022026-O.webp" },
  { id: 5, url_imagem: "https://cdn.awsli.com.br/300x300/506/506650/produto/89384787/0d570cc8af.jpg" },
  { id: 6, url_imagem: "https://cdn.awsli.com.br/300x300/2592/2592224/produto/394704801/radiador-ford-fusion-2-5-2010-a-2012-automatico-notus-nt2857116-8zbtb142rh.jpg" },
  { id: 7, url_imagem: "https://belzag.com/wp-content/uploads/2025/02/DSC4340-scaled-1-300x300.jpg.webp" },
  { id: 8, url_imagem: "https://images.tcdn.com.br/img/img_prod/659062/90_retrovisor_corsa_2003_2004_2005_2006_2007_2008_2009_2010_2011_2012_montana_2003_2004_2005_2006_2007__51737_2_0ef36a401d5b3fa37715cb6eeac6f7a3.jpg" },
  { id: 9, url_imagem: "https://cdn.awsli.com.br/300x300/2648/2648682/produto/24189396164ac760332.jpg" },
  { id: 10, url_imagem: "https://images.tcdn.com.br/img/img_prod/681755/90_alternador_mercruiser_gasolina_619_1_74028c752d6ec08613a3568df994e170.png" },

  { id: 11, url_imagem: "https://www.migliorinipecas.com/wp-content/uploads/2022/04/migliorini-auto-pecas-e-acessorios-produto-parachoques-2-300x300.png" },

  { id: 12, url_imagem: "https://images.tcdn.com.br/img/img_prod/673340/90_cin573_mola_suspensao_dianteira_com_ar_fiat_punto_1_6_16v_1_8_c_ar_s_t_a_07_em_diante_cindumel_41552_1_e5e5a8d0334d2a6743d09bfbe7df4359.jpg" },
];

export const produtoImagens: ProdutoImagem[] = [
  { id: 1, produto_id: 1, imagem_id: 1 },
  { id: 2, produto_id: 2, imagem_id: 7 },
  { id: 3, produto_id: 3, imagem_id: 3 },
  { id: 4, produto_id: 4, imagem_id: 4 },
  { id: 5, produto_id: 5, imagem_id: 5 },
  { id: 6, produto_id: 6, imagem_id: 2 },
  { id: 7, produto_id: 7, imagem_id: 9 },
  { id: 8, produto_id: 8, imagem_id: 6 },
  { id: 9, produto_id: 9, imagem_id: 10 },
  { id: 10, produto_id: 10, imagem_id: 8 },
  { id: 10, produto_id: 11, imagem_id: 11 },
  { id: 10, produto_id: 12, imagem_id: 12 },
];

export const produtos: Produto[] = [
  {
    id: 1,
    grupo_id: 1,
    marca_id: 1,
    aplicacao_lista_id: 1,
    codigo_original: "AF-25167",
    referencia: "06H 115 561 A",
    preco: 149.9,
    simetria_preco: null,
  },
  {
    id: 2,
    grupo_id: 2,
    marca_id: 7,
    aplicacao_lista_id: 5,
    codigo_original: "DB-3214",
    referencia: "06B 109 119 E",
    preco: 132.5,
    simetria_preco: 140.0,
  },
  {
    id: 3,
    grupo_id: 8,
    marca_id: 6,
    aplicacao_lista_id: 5,
    codigo_original: "BT-65A",
    referencia: null,
    preco: 485.0,
    simetria_preco: null,
  },
  {
    id: 4,
    grupo_id: 6,
    marca_id: 4,
    aplicacao_lista_id: 2,
    codigo_original: "BP-345A",
    referencia: "951 769 86",
    preco: 128.35,
    simetria_preco: 135.0,
  },
  {
    id: 5,
    grupo_id: 4,
    marca_id: 3,
    aplicacao_lista_id: 3,
    codigo_original: "AM-1198",
    referencia: null,
    preco: 380.25,
    simetria_preco: null,
  },
  {
    id: 6,
    grupo_id: 11,
    marca_id: 2,
    aplicacao_lista_id: 3,
    codigo_original: "RD-2134",
    referencia: "993 016 900",
    preco: 980.0,
    simetria_preco: 1025.0,
  },
  {
    id: 7,
    grupo_id: 1,
    marca_id: 10,
    aplicacao_lista_id: 1,
    codigo_original: "FC-985",
    referencia: "1K0 121 281 A",
    preco: 79.9,
    simetria_preco: null,
  },
  {
    id: 8,
    grupo_id: 7,
    marca_id: 9,
    aplicacao_lista_id: 6,
    codigo_original: "RC-420",
    referencia: "8E0 611 277 E",
    preco: 225.0,
    simetria_preco: 239.9,
  },
  {
    id: 9,
    grupo_id: 9,
    marca_id: 5,
    aplicacao_lista_id: 4,
    codigo_original: "AL-240",
    referencia: null,
    preco: 760.0,
    simetria_preco: null,
  },
  {
    id: 10,
    grupo_id: 14,
    marca_id: 1,
    aplicacao_lista_id: 4,
    codigo_original: "MV-110",
    referencia: "9S7Z-17K707-AA",
    preco: 189.9,
    simetria_preco: null,
  },
  {
    id: 11,
    grupo_id: 13,
    marca_id: 2,
    aplicacao_lista_id: 6,
    codigo_original: "PR-752",
    referencia: null,
    preco: 395.5,
    simetria_preco: 420.0,
  },
  {
    id: 12,
    grupo_id: 5,
    marca_id: 8,
    aplicacao_lista_id: 6,
    codigo_original: "ML-302",
    referencia: "CNH 502311",
    preco: 215.0,
    simetria_preco: null,
  },
];

export const clientes: Cliente[] = [
  { id: 1, nome: "Renaldo JS Martins", tipo_pessoa: "Física", cpf_cnpj: "12345678901", email: "renaldo@email.com", telefone: "11999999999", endereco_id: 1, permite_faturado: true, limite_credito: 5000.00, saldo_utilizado: 1200.50, bloqueado_por_atraso: false },
  { id: 2, nome: "Auto Mecânica Toninho", tipo_pessoa: "Jurídica", cpf_cnpj: "98765432000100", email: "toninho@oficina.com", telefone: "1138888888", endereco_id: 2, permite_faturado: true, limite_credito: 15000.00, saldo_utilizado: 4500.00, bloqueado_por_atraso: false },
  { id: 3, nome: "Ana Julia Souza", tipo_pessoa: "Física", cpf_cnpj: "45678912300", email: "anajulia@email.com", telefone: "11988887777", endereco_id: 3, permite_faturado: false, limite_credito: 0.00, saldo_utilizado: 0.00, bloqueado_por_atraso: false },
  { id: 4, nome: "Carlos Henrique Lima", tipo_pessoa: "Física", cpf_cnpj: "32165498711", email: "carlos.lima@email.com", telefone: "11977776666", endereco_id: 4, permite_faturado: true, limite_credito: 2000.00, saldo_utilizado: 1950.00, bloqueado_por_atraso: true },
];

export const enderecos: Endereco[] = [
  { id: 1, cliente_id: 1, cep: "01311200", rua: "Avenida Paulista", numero: "1000", bairro: "Bela Vista", cidade: "São Paulo", estado: "SP", pais: "Brasil", tipo_endereco: "principal", cadastro_ativo: true },
  { id: 2, cliente_id: 2, cep: "09010000", rua: "Rua das Figueiras", numero: "450", bairro: "Jardim", cidade: "Santo André", estado: "SP", pais: "Brasil", tipo_endereco: "comercial", cadastro_ativo: true },
  { id: 3, cliente_id: 3, cep: "04571010", rua: "Avenida Engenheiro Luís Carlos Berrini", numero: "105", bairro: "Cidade Monções", cidade: "São Paulo", estado: "SP", pais: "Brasil", tipo_endereco: "principal", cadastro_ativo: true },
  { id: 4, cliente_id: 4, cep: "02011000", rua: "Rua Voluntários da Pátria", numero: "1200", bairro: "Santana", cidade: "São Paulo", estado: "SP", pais: "Brasil", tipo_endereco: "principal", cadastro_ativo: true },
];

export const usuarios: Usuario[] = [
  { id: 1, nome: "Marcos Vendedor", email: "marcos@loja.com", senha_hash: "hash", cargo: "Vendedor", perfil_acesso: "operador", ativo: true, data_criacao: "2026-01-01T00:00:00Z" },
  { id: 2, nome: "Juliana Gerente", email: "juliana@loja.com", senha_hash: "hash", cargo: "Gerente", perfil_acesso: "supervisor", ativo: true, data_criacao: "2026-01-01T00:00:00Z" },
];

export const mocks = {
  produtoCategorias,
  produtoGrupos,
  produtoMarcas,
  carroMontadoras,
  carroModelos,
  produtoAplicacaoListas,
  produtoTipoEspecificacoes,
  produtoEspecificacoes,
  imagens,
  produtoImagens,
  produtos,
  clientes,
  enderecos,
  usuarios,
};

