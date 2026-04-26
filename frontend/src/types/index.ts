export interface Produto {
  id: number;
  nome: string;
  precoCompra: string;
  precoVenda: string;
  quantidadeEstoque: number;
}

export interface ItemAgrupado {
  produtoId: number;
  produtoNome: string;
  quantidadeTotal: number;
  valorUnitarioVenda: string;
  valorUnitarioCompra: string;
  subtotal: string;
}

export interface Mesa {
  id: number;
  numeroMesa: string;
  status: 'ABERTA' | 'PAGA';
  total: string;
  itens: ItemAgrupado[];
}

export interface RelatorioFinanceiro {
  faturamentoBruto: string;
  custoTotal: string;
  lucroLiquido: string;
}