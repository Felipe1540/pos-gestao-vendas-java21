"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DollarSign, TrendingUp, AlertTriangle, ShoppingCart, Users } from "lucide-react";
import api from "@/lib/api";

interface RelatorioDia {
  faturamentoBruto: number;
  custoTotal: number;
  lucroLiquido: number;
}

interface Produto {
  id: number;
  nome: string;
  precoVenda: string;
  quantidadeEstoque: number;
}

function formatarMoeda(valor: number): string {
  if (isNaN(valor)) return "R$ 0,00";
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

export default function Dashboard() {
  const [relatorio, setRelatorio] = useState<RelatorioDia | null>(null);
  const [estoqueBaixo, setEstoqueBaixo] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [relatorioRes, produtosRes] = await Promise.all([
          api.get("/api/financeiro/relatorio"),
          api.get("/api/produtos"),
        ]);

        const rel = relatorioRes.data as RelatorioDia;
        setRelatorio(rel || { faturamentoBruto: 0, custoTotal: 0, lucroLiquido: 0 });

        const prods = (produtosRes.data as Produto[]) || [];
        const baixos = prods.filter(p => p.quantidadeEstoque <= 10).slice(0, 5);
        setEstoqueBaixo(baixos);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-lg bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard - Resumo do Dia</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Vendas Hoje</span>
            <DollarSign className="text-green-600" size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {formatarMoeda(relatorio?.faturamentoBruto || 0)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Lucro Hoje</span>
            <TrendingUp className="text-purple-600" size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {formatarMoeda(relatorio?.lucroLiquido || 0)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-500" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Estoque Baixo</h2>
          </div>
          {estoqueBaixo.length === 0 ? (
            <p className="text-gray-500">Nenhum produto com estoque baixo!</p>
          ) : (
            <div className="space-y-2">
              {estoqueBaixo.map((produto) => (
                <div key={produto.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <div>
                    <span className="font-medium text-gray-700">{produto.nome}</span>
                    <span className="text-gray-500 text-sm ml-2">R$ {produto.precoVenda}</span>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">
                    {produto.quantidadeEstoque} un
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/pdv" className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium">
              <ShoppingCart size={20} /> PDV
            </Link>
            <Link href="/mesas" className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">
              <Users size={20} /> Mesas
            </Link>
            <Link href="/inventario" className="flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium">
              Estoque
            </Link>
            <Link href="/financeiro" className="flex items-center justify-center gap-2 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-medium">
              Financeiro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}