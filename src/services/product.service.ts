import { invoke } from '@tauri-apps/api/core';
import { 
  Produto, 
  ProdutoCategoria, 
  ProdutoGrupo, 
  ProdutoFabricante 
} from '../types/products.entities';

export const ProductService = {
  async criarProduto(produto: Produto): Promise<number> {
    return await invoke<number>('criar_produto', { produto });
  },

  async atualizarProduto(produto: Produto): Promise<void> {
    return await invoke<void>('atualizar_produto', { produto });
  },

  async deletarProduto(id: number): Promise<void> {
    return await invoke<void>('deletar_produto', { id });
  },

  async buscarProduto(id: number): Promise<Produto | null> {
    return await invoke<Produto | null>('buscar_produto', { id });
  },

  async listarProdutos(querySearch?: string): Promise<Produto[]> {
    return await invoke<Produto[]>('listar_produtos', { querySearch });
  },

  // Serviços auxiliares para cadastros

  async criarCategoria(descricao: string): Promise<number> {
    return await invoke<number>('criar_categoria', { descricao });
  },

  async listarCategorias(): Promise<ProdutoCategoria[]> {
    return await invoke<ProdutoCategoria[]>('listar_categorias');
  },

  async criarGrupo(categoriaId: number, grupoParentId: number | null = null, descricao: string | null = null): Promise<number> {
    return await invoke<number>('criar_grupo', { categoriaId, grupoParentId, descricao });
  },

  async listarGrupos(): Promise<ProdutoGrupo[]> {
    return await invoke<ProdutoGrupo[]>('listar_grupos');
  },

  async criarFabricante(nome: string): Promise<number> {
    return await invoke<number>('criar_fabricante', { nome });
  },

  async listarFabricantes(): Promise<ProdutoFabricante[]> {
    return await invoke<ProdutoFabricante[]>('listar_fabricantes');
  }
};
