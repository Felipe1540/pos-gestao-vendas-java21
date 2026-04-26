"use client";

import { useState, useEffect } from "react";
import { Plus, ShoppingBag, DollarSign, X, Loader2, ClipboardList, Trash2 } from "lucide-react";
import api from "@/lib/api";

interface Produto {
  id: number;
  nome: string;
  precoVenda: string;
  precoCompra: string;
  quantidadeEstoque: number;
  categoria?: string;
}

interface ItemAgrupado {
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  valorUnitarioVenda: string;
}

interface Mesa {
  id: number;
  numeroMesa: string;
  status: "ABERTA" | "PAGA";
  itens: ItemAgrupado[];
}

export default function MesasPage() {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [mesaSelecionada, setMesaSelecionada] = useState<Mesa | null>(null);
  const [showModalNovo, setShowModalNovo] = useState(false);
  const [showModalItens, setShowModalItens] = useState(false);
  const [showModalPagamento, setShowModalPagamento] = useState(false);
  const [showModalCriaMesa, setShowModalCriaMesa] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const [novaMesa, setNovaMesa] = useState("");
  const [itemForm, setItemForm] = useState({ produtoId: "", quantidade: 1 });
  const [pagamentoItens, setPagamentoItens] = useState<{
    [produtoId: number]: number;
  }>({});
  const [buscaProduto, setBuscaProduto] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("Todas");
  const [categorias, setCategorias] = useState<string[]>([]);
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      const [mRes, pRes, cRes] = await Promise.all([
        api.get("/api/mesas"),
        api.get("/api/produtos"),
        api.get("/api/produtos/categorias"),
      ]);
      setMesas(mRes.data);
      const produtosFiltrados = pRes.data.filter((p: Produto) => p.quantidadeEstoque > 0);
      setTodosProdutos(produtosFiltrados);
      setProdutos(produtosFiltrados);
      setCategorias(cRes.data || []);
    } catch (err) {
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }

  function filtrarProdutos() {
    if (todosProdutos.length === 0) return;
    
    let filtrados = [...todosProdutos];
    
    if (categoriaFilter && categoriaFilter !== "Todas") {
      filtrados = filtrados.filter(p => p.categoria === categoriaFilter);
    }
    
    if (buscaProduto) {
      const busca = buscaProduto.toLowerCase();
      filtrados = filtrados.filter(p => p.nome.toLowerCase().includes(busca));
    }
    
    setProdutos(filtrados);
  }

  useEffect(() => {
    filtrarProdutos();
  }, [categoriaFilter, buscaProduto, todosProdutos]);

  async function handleCriarMesa(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      await api.post("/api/mesas", { numeroMesa: novaMesa });
      await carregarDados();
      setShowModalCriaMesa(false);
      setNovaMesa("");
    } catch (err) {
      console.error("Erro ao criar mesa:", err);
    } finally {
      setEnviando(false);
    }
  }

  async function handleAdicionarItem(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      await api.post(
        `/api/pedidos/${mesaSelecionada?.numeroMesa}`,
        {
          produtoId: parseInt(itemForm.produtoId),
          quantidade: itemForm.quantidade,
        }
      );
      await carregarDados();
      await buscarItensMesa(mesaSelecionada!.numeroMesa);
      setItemForm({ produtoId: "", quantidade: 1 });
      setShowModalNovo(false);
    } catch (err: any) {
      const msg = err.response?.data?.mensagem || err.response?.data?.message || "Erro ao adicionar item";
      setErro(msg);
      console.error("Erro ao adicionar item:", err);
    } finally {
      setEnviando(false);
    }
  }

  async function buscarItensMesa(numeroMesa: string) {
    try {
      const res = await api.get<{ itens: ItemAgrupado[] }>(`/api/pedidos/${numeroMesa}`);
      const mesa = mesas.find((m) => m.numeroMesa === numeroMesa);
      if (mesa) {
        setMesaSelecionada({ ...mesa, itens: res.data.itens || [] });
      }
    } catch (err) {
      console.error("Erro:", err);
    }
  }

  async function handleRemoverItem(produtoId: number) {
    if (!mesaSelecionada) return;
    setEnviando(true);
    try {
      await api.delete(
        `/api/pedidos/${mesaSelecionada.numeroMesa}/item/${produtoId}`
      );
      await carregarDados();
      await buscarItensMesa(mesaSelecionada.numeroMesa);
    } catch (err: any) {
      const msg = err.response?.data?.mensagem || err.response?.data?.message || "Erro ao remover item";
      setErro(msg);
      console.error("Erro ao remover item:", err);
    } finally {
      setEnviando(false);
    }
  }

  async function handlePagamentoParcial() {
    setEnviando(true);
    try {
      const itensArray = Object.entries(pagamentoItens).filter(
        ([, qtd]) => qtd > 0
      );
      for (const [produtoId, quantidade] of itensArray) {
        await api.post(`/api/pagamentos/parcial`, {
          numeroMesa: mesaSelecionada?.numeroMesa,
          produtoId: parseInt(produtoId),
          quantidade: quantidade,
        });
      }
      await carregarDados();
      if (mesaSelecionada) {
        await buscarItensMesa(mesaSelecionada.numeroMesa);
      }
      setShowModalPagamento(false);
      setPagamentoItens({});
    } catch (err) {
      console.error("Erro ao pagar:", err);
    } finally {
      setEnviando(false);
    }
  }

  function getTotalMesa(itens: ItemAgrupado[]) {
    return itens.reduce((acc, item) => {
      return acc + parseFloat(item.valorUnitarioVenda) * item.quantidade;
    }, 0);
  }

  function getStatusColor(status: string) {
    return status === "ABERTA"
      ? "bg-orange-100 text-orange-800"
      : "bg-green-100 text-green-800";
  }

  function getMesaStyle(mesa: Mesa) {
    if (mesa.status === "PAGA") {
      return "bg-green-50 border-2 border-green-200";
    }
    const total = getTotalMesa(mesa.itens);
    if (total > 0) {
      return "bg-orange-50 border-2 border-orange-200 hover:border-orange-400";
    }
    return "bg-gray-50 border-2 border-gray-200 hover:border-gray-400";
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mesas</h2>
        <button
          onClick={() => setShowModalCriaMesa(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Nova Mesa
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {mesas.map((mesa) => (
          <button
            key={mesa.id}
            onClick={() => {
              setMesaSelecionada(mesa);
              setShowModalItens(true);
            }}
            className={`p-4 rounded-lg transition-colors ${getMesaStyle(mesa)}`}
          >
            <div className="font-bold text-lg">{mesa.numeroMesa}</div>
            <div className="text-sm">
              {mesa.status === "PAGA" ? (
                <span className="text-green-700">Paga</span>
              ) : (
                <span className="text-gray-600">R$ {getTotalMesa(mesa.itens).toFixed(2)}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {mesas.length === 0 && (
        <p className="text-gray-500 text-center py-10">
          Nenhuma mesa. Clique em "Nova Mesa" para começar.
        </p>
      )}

      {showModalItens && mesaSelecionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Mesa {mesaSelecionada.numeroMesa}</h3>
              <button
                onClick={() => setShowModalItens(false)}
                className="text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4 space-y-2">
              <button
                onClick={() => { setErro(null); setShowModalNovo(true); }}
                className="flex items-center gap-2 w-full bg-orange-100 text-orange-800 px-4 py-2 rounded-lg hover:bg-orange-200"
              >
                <Plus size={20} />
                Adicionar Item
              </button>
              <button
                onClick={() => {
                  const itens: { [key: number]: number } = {};
                  mesaSelecionada.itens.forEach((item) => {
                    itens[item.produtoId] = item.quantidade;
                  });
                  setPagamentoItens(itens);
                  setShowModalPagamento(true);
                }}
                className="flex items-center gap-2 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <DollarSign size={20} />
                Pagamento Parcial
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Itens do Pedido</h4>
              {mesaSelecionada.itens.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <div>
                    <span className="font-medium">{item.produtoNome}</span>
                    <span className="text-gray-500 ml-2">x{item.quantidade}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-700">
                      R${" "}
                      {(
                        parseFloat(item.valorUnitarioVenda) * item.quantidade
                      ).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoverItem(item.produtoId)}
                      disabled={enviando}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      title="Remover item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {mesaSelecionada.itens.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Nenhum item no pedido
                </p>
              )}
              {mesaSelecionada.itens.length > 0 && (
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg text-green-700">
                    R$ {getTotalMesa(mesaSelecionada.itens).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showModalNovo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Adicionar Item</h3>
              <button
                onClick={() => setShowModalNovo(false)}
                className="text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAdicionarItem} className="space-y-4">
              {erro && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {erro}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={categoriaFilter}
                  onChange={(e) => {
                    setCategoriaFilter(e.target.value);
                    filtrarProdutos();
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Todas">Todas</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar Produto
                </label>
                <input
                  type="text"
                  value={buscaProduto}
                  onChange={(e) => {
                    setBuscaProduto(e.target.value);
                    filtrarProdutos();
                  }}
                  placeholder="Digite o nome..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produto
                </label>
                <select
                  required
                  value={itemForm.produtoId}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, produtoId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="">Selecione...</option>
                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} - R$ {parseFloat(p.precoVenda).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={itemForm.quantidade}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      quantidade: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50"
              >
                {enviando ? "Adicionando..." : "Adicionar"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showModalPagamento && mesaSelecionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Pagamento Parcial</h3>
              <button
                onClick={() => setShowModalPagamento(false)}
                className="text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-3 mb-4">
              {mesaSelecionada.itens.map((item) => (
                <div key={item.produtoId} className="flex justify-between items-center">
                  <label className="text-gray-700">
                    {item.produtoNome} (x{item.quantidade})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={item.quantidade}
                    value={pagamentoItens[item.produtoId] || 0}
                    onChange={(e) =>
                      setPagamentoItens({
                        ...pagamentoItens,
                        [item.produtoId]: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handlePagamentoParcial}
              disabled={enviando}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
            >
              {enviando ? "Processando..." : "Confirmar Pagamento"}
            </button>
          </div>
        </div>
      )}

      {showModalCriaMesa && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Nova Mesa</h3>
              <button
                onClick={() => setShowModalCriaMesa(false)}
                className="text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCriarMesa} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número da Mesa
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={novaMesa}
                  onChange={(e) => setNovaMesa(e.target.value)}
                  placeholder="Ex: 1, 2, 3..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {enviando ? "Criando..." : "Criar Mesa"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}