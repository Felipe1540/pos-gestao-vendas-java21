"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, X, Loader2, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";

interface Produto {
  id: number;
  nome: string;
  precoCompra: string;
  precoVenda: string;
  quantidadeEstoque: number;
  categoria?: string;
}

export default function InventarioPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    nome: "",
    precoCompra: "",
    precoVenda: "",
    quantidadeEstoque: 0,
    categoria: "",
  });
  const [categorias, setCategorias] = useState<string[]>([]);
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);
  const [categoriaFilter, setCategoriaFilter] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const ITENS_POR_PAGINA = 10;

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    let filtrados = [...todosProdutos];
    if (categoriaFilter && categoriaFilter !== "Todas") {
      filtrados = filtrados.filter(p => p.categoria === categoriaFilter);
    }
    if (busca) {
      const b = busca.toLowerCase();
      filtrados = filtrados.filter(p => p.nome.toLowerCase().includes(b));
    }
    setProdutos(filtrados);
    setPagina(1);
  }, [categoriaFilter, busca, todosProdutos]);

  function getProdutosPaginados() {
    const inicio = (pagina - 1) * ITENS_POR_PAGINA;
    return produtos.slice(inicio, inicio + ITENS_POR_PAGINA);
  }

  function getTotalPaginas() {
    return Math.ceil(produtos.length / ITENS_POR_PAGINA);
  }

  async function carregarProdutos() {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        api.get("/api/produtos"),
        api.get("/api/produtos/categorias"),
      ]);
      const lista = pRes.data;
      setTodosProdutos(lista);
      setProdutos(lista);
      setCategorias(cRes.data || []);
    } catch (err) {
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    const categoriaFinal = form.categoria === "__nova__" ? "" : form.categoria;
    try {
      if (produtoEditando) {
        await api.put(`/api/produtos/${produtoEditando.id}`, {
          nome: form.nome,
          precoCompra: parseFloat(form.precoCompra),
          precoVenda: parseFloat(form.precoVenda),
          quantidadeEstoque: form.quantidadeEstoque,
          categoria: categoriaFinal,
        });
      } else {
        await api.post("/api/produtos", {
          nome: form.nome,
          precoCompra: parseFloat(form.precoCompra),
          precoVenda: parseFloat(form.precoVenda),
          quantidadeEstoque: form.quantidadeEstoque,
          categoria: categoriaFinal,
        });
      }
      await carregarProdutos();
      setShowModal(false);
      setForm({ nome: "", precoCompra: "", precoVenda: "", quantidadeEstoque: 0, categoria: "" });
      setProdutoEditando(null);
    } catch (err: any) {
      const msg = err.response?.data?.mensagem || err.response?.data?.message || "Erro ao salvar";
      setErro(msg);
      console.error("Erro ao salvar:", err);
    } finally {
      setEnviando(false);
    }
  }

  function handleEditar(produto: Produto) {
    setProdutoEditando(produto);
    setForm({
      nome: produto.nome,
      precoCompra: produto.precoCompra,
      precoVenda: produto.precoVenda,
      quantidadeEstoque: produto.quantidadeEstoque,
      categoria: produto.categoria || "",
    });
    setShowModal(true);
  }

  async function handleExcluir(produto: Produto) {
    if (!confirm(`Confirmar exclusão de "${produto.nome}"?`)) return;
    setEnviando(true);
    try {
      await api.delete(`/api/produtos/${produto.id}`);
      await carregarProdutos();
    } catch (err: any) {
      const msg = err.response?.data?.mensagem || err.response?.data?.message || "Erro ao excluir";
      alert(msg);
      console.error("Erro ao excluir:", err);
    } finally {
      setEnviando(false);
    }
  }

  function handleFecharModal() {
    setShowModal(false);
    setProdutoEditando(null);
    setForm({ nome: "", precoCompra: "", precoVenda: "", quantidadeEstoque: 0, categoria: "" });
    setErro(null);
  }

  function getEstoqueStyle(qtd: number) {
    if (qtd > 10) return "bg-green-100 text-green-800";
    if (qtd > 0) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Inventário</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="w-48">
          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
          >
            <option value="Todas">Todas</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Preço Custo</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Preço Venda</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estoque</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getProdutosPaginados().map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{p.nome}</td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    R$ {parseFloat(p.precoCompra).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    R$ {parseFloat(p.precoVenda).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstoqueStyle(p.quantidadeEstoque)}`}>
                      {p.quantidadeEstoque}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEditar(p)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleExcluir(p)}
                      disabled={enviando}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
</tbody>
            </table>
            {produtos.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                Nenhum produto encontrado
              </div>
            )}
            {getTotalPaginas() > 1 && (
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
                <div className="text-sm text-gray-600">
                  Mostrando {(pagina - 1) * ITENS_POR_PAGINA + 1}-{Math.min(pagina * ITENS_POR_PAGINA, produtos.length)} de {produtos.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagina(pagina - 1)}
                    disabled={pagina === 1}
                    className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm">
                    {pagina} / {getTotalPaginas()}
                  </span>
                  <button
                    onClick={() => setPagina(pagina + 1)}
                    disabled={pagina >= getTotalPaginas()}
                    className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {produtoEditando ? "Editar Produto" : "Novo Produto"}
              </h3>
              <button onClick={handleFecharModal} className="text-gray-500">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {erro && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {erro}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <div className="flex gap-2">
                  <select
                    value={categorias.includes(form.categoria) ? form.categoria : ""}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer"
                  >
                    <option value="">Selecione...</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Nova"
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Custo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.precoCompra}
                    onChange={(e) => setForm({ ...form, precoCompra: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Venda (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.precoVenda}
                    onChange={(e) => setForm({ ...form, precoVenda: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade em Estoque
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.quantidadeEstoque}
                  onChange={(e) =>
                    setForm({ ...form, quantidadeEstoque: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
              >
                {enviando ? "Salvando..." : produtoEditando ? "Salvar Alterações" : "Criar Produto"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}