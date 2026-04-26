import { useState, useEffect, useCallback } from "react";
import api from "./api";

export interface Produto {
  id: number;
  nome: string;
  precoVenda: string;
  precoCompra: string;
  quantidadeEstoque: number;
  categoria?: string;
}

export function useProdutos() {
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("Todas");

  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        api.get("/api/produtos"),
        api.get("/api/produtos/categorias"),
      ]);
      const produtosFiltrados = pRes.data.filter((p: Produto) => p.quantidadeEstoque > 0);
      setTodosProdutos(produtosFiltrados);
      setCategorias(cRes.data || []);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const filtrarProdutos = useCallback(() => {
    if (todosProdutos.length === 0) return;

    let filtrados = [...todosProdutos];

    if (categoriaFilter && categoriaFilter !== "Todas") {
      filtrados = filtrados.filter((p) => p.categoria === categoriaFilter);
    }

    if (busca) {
      const buscaLower = busca.toLowerCase();
      filtrados = filtrados.filter((p) => p.nome.toLowerCase().includes(buscaLower));
    }

    setProdutos(filtrados);
  }, [todosProdutos, categoriaFilter, busca]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  useEffect(() => {
    filtrarProdutos();
  }, [categoriaFilter, busca, todosProdutos, filtrarProdutos]);

  return {
    produtos,
    categorias,
    loading,
    busca,
    setBusca,
    categoriaFilter,
    setCategoriaFilter,
    recarregar: carregarDados,
  };
}