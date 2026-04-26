"use client";

import { useState } from "react";
import axios from "axios";
import { ShoppingCart, Plus, Minus, DollarSign, X, Loader2 } from "lucide-react";
import { useProdutos, Produto } from "@/lib/useProdutos";
import api from "@/lib/api";

interface ItemCarrinho {
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  valorUnitarioVenda: number;
}

export default function PDVPage() {
  const { produtos, categorias, loading, busca, setBusca, categoriaFilter, setCategoriaFilter, recarregar } = useProdutos();
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [showPagamento, setShowPagamento] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [ultimoTotal, setUltimoTotal] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  function adicionarAoCarrinho(produto: Produto) {
    setErro(null);
    const existente = carrinho.find((item) => item.produtoId === produto.id);
    if (existente) {
      setCarrinho(
        carrinho.map((item) =>
          item.produtoId === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      setCarrinho([
        ...carrinho,
        {
          produtoId: produto.id,
          produtoNome: produto.nome,
          quantidade: 1,
          valorUnitarioVenda: parseFloat(produto.precoVenda),
        },
      ]);
    }
  }

  function removerDoCarrinho(produtoId: number) {
    const existente = carrinho.find((item) => item.produtoId === produtoId);
    if (existente && existente.quantidade > 1) {
      setCarrinho(
        carrinho.map((item) =>
          item.produtoId === produtoId
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
      );
    } else {
      setCarrinho(carrinho.filter((item) => item.produtoId !== produtoId));
    }
  }

  function getTotal() {
    return carrinho.reduce(
      (acc, item) => acc + item.valorUnitarioVenda * item.quantidade,
      0
    );
  }

  async function handleFinalizarVenda() {
    setEnviando(true);
    try {
      for (const item of carrinho) {
        await api.post(`/api/pedidos/BALCAO`, {
          produtoId: item.produtoId,
          quantidade: item.quantidade,
        });
      }
      const mesa = await api.get(`/api/pedidos/BALCAO`);
      const itens = mesa.data as ItemCarrinho[];
      for (const item of carrinho) {
        await api.post(`/api/pagamentos/parcial`, {
          numeroMesa: "BALCAO",
          produtoId: item.produtoId,
          quantidade: item.quantidade,
        });
      }
      setUltimoTotal(getTotal());
      setCarrinho([]);
      setShowPagamento(false);
      await recarregar();
    } catch (err: any) {
      const msg = err.response?.data?.mensagem || err.response?.data?.message || "Erro ao processar venda";
      setErro(msg);
      console.error("Erro ao finalizar venda:", err);
    } finally {
      setEnviando(false);
    }
  }

  const produtosMostrados = produtos;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="mb-4 space-y-3">
          <div className="flex gap-2">
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="w-1/3 px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="Todas">Todas</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {erro && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {erro}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3" style={{ maxHeight: '29rem', overflowY: 'auto' }}>
          {produtosMostrados.map((produto) => (
            <button
              key={produto.id}
              onClick={() => adicionarAoCarrinho(produto)}
              className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-green-500 hover:shadow-md transition-all text-left"
            >
              <div className="font-semibold text-gray-900 truncate">
                {produto.nome}
              </div>
              <div className="text-green-600 font-bold text-lg">
                R$ {parseFloat(produto.precoVenda).toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Estoque: {produto.quantidadeEstoque}
              </div>
              <div className="mt-2 flex items-center justify-center gap-1 bg-green-100 text-green-700 py-1 rounded text-sm">
                <Plus size={16} />
                Adicionar
              </div>
            </button>
          ))}
        </div>

        {produtosMostrados.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            {busca ? "Nenhum produto encontrado" : "Nenhum produto em estoque"}
          </div>
        )}
      </div>

      <div className="w-96 bg-white rounded-lg shadow-lg p-4 h-fit sticky top-0">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="text-gray-700" size={24} />
          <h3 className="text-xl font-bold text-gray-800">PDV</h3>
          <span className="ml-auto bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
            {carrinho.reduce((acc, item) => acc + item.quantidade, 0)} itens
          </span>
        </div>

        <div className="border-t border-b py-4 mb-4 space-y-3 max-h-80 overflow-y-auto">
          {carrinho.map((item) => (
            <div
              key={item.produtoId}
              className="flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.produtoNome}</div>
                <div className="text-sm text-gray-500">
                  R$ {item.valorUnitarioVenda.toFixed(2)} cada
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => removerDoCarrinho(item.produtoId)}
                  className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">
                  {item.quantidade}
                </span>
                <button
                  onClick={() => {
                    const prod = produtos.find((p) => p.id === item.produtoId);
                    if (prod) adicionarAoCarrinho(prod);
                  }}
                  className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="text-right w-20">
                <div className="font-bold">
                  R$ {(item.valorUnitarioVenda * item.quantidade).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
          {carrinho.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              Carrinho vazio
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-lg">
            <span className="text-gray-600">Total</span>
            <span className="font-bold text-2xl text-green-700">
              R$ {getTotal().toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowPagamento(true)}
          disabled={carrinho.length === 0 || enviando}
          className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <DollarSign size={24} />
          Finalizar Venda
        </button>
      </div>

      {showPagamento && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Confirmar Venda</h3>
              <button
                onClick={() => setShowPagamento(false)}
                className="text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="text-center py-6">
              <div className="text-gray-600 mb-2">Total da Venda</div>
              <div className="text-4xl font-bold text-green-700">
                R$ {getTotal().toFixed(2)}
              </div>
            </div>

            <button
              onClick={handleFinalizarVenda}
              disabled={enviando}
              className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 font-bold text-lg disabled:opacity-50"
            >
              {enviando ? "Processando..." : "Confirmar Recebimento"}
            </button>
          </div>
        </div>
      )}

      {ultimoTotal !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="text-green-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Venda Concluída!</h3>
            <p className="text-gray-600 mb-6">
              Total: R$ {ultimoTotal.toFixed(2)}
            </p>
            <button
              onClick={() => setUltimoTotal(null)}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-bold"
            >
              Nova Venda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}