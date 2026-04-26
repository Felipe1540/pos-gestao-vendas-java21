"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, RefreshCw, Loader2, Calendar, Printer } from "lucide-react";
import api from "@/lib/api";

interface Relatorio {
  faturamentoBruto: string;
  custoTotal: string;
  lucroLiquido: string;
}

export default function FinanceiroPage() {
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dataInicio) params.append("dataInicio", dataInicio);
      if (dataFim) params.append("dataFim", dataFim);
      
      const res = await api.get(`/api/financeiro/relatorio?${params.toString()}`);
      setRelatorio(res.data);
    } catch (err) {
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }

  function imprimir() {
    window.print();
  }

  const faturamento = relatorio ? parseFloat(relatorio.faturamentoBruto) : 0;
  const custo = relatorio ? parseFloat(relatorio.custoTotal) : 0;
  const lucro = relatorio ? parseFloat(relatorio.lucroLiquido) : 0;
  const margem = faturamento > 0 ? (lucro / faturamento) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Financeiro</h2>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={imprimir}
            className="flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
          >
            <Printer size={20} />
            Imprimir
          </button>
          <button
            onClick={carregarDados}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <RefreshCw size={20} />
            Atualizar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 print:shadow-none print:border print:border-slate-300">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-slate-400" size={24} />
          <span className="font-semibold text-slate-700">Período</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4 print:hidden">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Data Início
            </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Data Fim
            </label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        
        <button
          onClick={carregarDados}
          className="w-full bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-700 transition-colors print:hidden"
        >
          Gerar Relatório
        </button>

        {(dataInicio || dataFim) && (
          <div className="mt-4 text-sm text-slate-500">
            Período: {dataInicio || "Início"} até {dataFim || "Hoje"}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-slate-400" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border-l-4 border-emerald-500">
            <div className="flex items-center gap-2 text-emerald-700 mb-2">
              <DollarSign size={24} />
              <span className="font-medium">Faturamento Bruto</span>
            </div>
            <div className="text-4xl font-bold text-emerald-600">
              R$ {faturamento.toFixed(2)}
            </div>
            <div className="text-sm text-emerald-600/70 mt-1">
              Total de vendas no período
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-2xl border-l-4 border-rose-500">
            <div className="flex items-center gap-2 text-rose-700 mb-2">
              <TrendingDown size={24} />
              <span className="font-medium">Custo Total</span>
            </div>
            <div className="text-4xl font-bold text-rose-600">
              R$ {custo.toFixed(2)}
            </div>
            <div className="text-sm text-rose-600/70 mt-1">
              Custo dos produtos vendidos
            </div>
          </div>

          <div className={`bg-gradient-to-br p-6 rounded-2xl border-l-4 ${
            lucro >= 0 
              ? "from-slate-50 to-slate-100 border-slate-600" 
              : "from-amber-50 to-amber-100 border-amber-500"
          }`}>
            <div className={`flex items-center gap-2 mb-2 ${
              lucro >= 0 ? "text-slate-700" : "text-amber-700"
            }`}>
              <TrendingUp size={24} />
              <span className="font-medium">Lucro Líquido</span>
            </div>
            <div className={`text-4xl font-bold ${
              lucro >= 0 ? "text-slate-600" : "text-amber-600"
            }`}>
              R$ {lucro.toFixed(2)}
            </div>
            <div className={`text-sm mt-1 ${
              lucro >= 0 ? "text-slate-600/70" : "text-amber-600/70"
            }`}>
              Margem: {margem.toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden print:shadow-none print:border print:border-slate-300">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800">Demonstrativo de Resultados</h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-600">Receita Total</span>
            <span className="font-bold text-emerald-600">R$ {faturamento.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-600">(-) Custo dos Produtos</span>
            <span className="font-bold text-rose-600">R$ {custo.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-600">(-) Impostos e Taxas</span>
            <span className="font-bold text-slate-600">R$ 0,00</span>
          </div>
          <div className="flex justify-between items-center py-4 text-lg">
            <span className="font-semibold text-slate-800">Lucro Líquido</span>
            <span className={`font-bold text-xl ${
              lucro >= 0 ? "text-slate-800" : "text-amber-600"
            }`}>
              R$ {lucro.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-slate-400 print:block">
        Gerado em {new Date().toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit", 
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })}
      </div>
    </div>
  );
}