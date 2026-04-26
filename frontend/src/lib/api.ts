import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
});

export default api;

export const produtoApi = {
  listar: () => api.get('/api/produtos'),
  criar: (data: Partial<Produto>) => api.post('/api/produtos', data),
  atualizar: (id: number, data: Partial<Produto>) => api.put(`/api/produtos/${id}`, data),
  buscar: (id: number) => api.get(`/api/produtos/${id}`),
};

export const pedidoApi = {
  buscarMesa: (local: string) => api.get(`/api/pedidos/${local}`),
  adicionarItem: (local: string, data: { produtoId: number; quantidade: number }) =>
    api.post(`/api/pedidos/${local}`, data),
  listarItens: (local: string) => api.get(`/api/pedidos/${local}/itens`),
  removerItem: (local: string, produtoId: number, quantidade: number) =>
    api.delete(`/api/pedidos/${local}/item/${produtoId}?quantidade=${quantidade}`),
};

export const pagamentoApi = {
  parcial: (local: string, data: { itens: { produtoId: number; quantidade: number }[] }) =>
    api.post(`/api/pagamentos/parcial/${local}`, data),
  total: (local: string) => api.post(`/api/pagamentos/total/${local}`),
};

export const financeiroApi = {
  relatorio: () => api.get('/api/financeiro/relatorio'),
};

interface Produto {
  id: number;
  nome: string;
  precoCompra: number;
  precoVenda: number;
  quantidadeEstoque: number;
}