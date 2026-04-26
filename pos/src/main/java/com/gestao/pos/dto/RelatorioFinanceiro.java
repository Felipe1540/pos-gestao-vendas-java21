package com.gestao.pos.dto;

import java.math.BigDecimal;

public class RelatorioFinanceiro {

    private BigDecimal faturamentoBruto;
    private BigDecimal custoTotal;
    private BigDecimal lucroLiquido;
    private Integer totalPedidos;

    public RelatorioFinanceiro(BigDecimal faturamentoBruto, BigDecimal custoTotal, Integer totalPedidos) {
        this.faturamentoBruto = faturamentoBruto;
        this.custoTotal = custoTotal;
        this.lucroLiquido = faturamentoBruto.subtract(custoTotal);
        this.totalPedidos = totalPedidos;
    }

    public BigDecimal getFaturamentoBruto() {
        return faturamentoBruto;
    }

    public void setFaturamentoBruto(BigDecimal faturamentoBruto) {
        this.faturamentoBruto = faturamentoBruto;
    }

    public BigDecimal getCustoTotal() {
        return custoTotal;
    }

    public void setCustoTotal(BigDecimal custoTotal) {
        this.custoTotal = custoTotal;
    }

    public BigDecimal getLucroLiquido() {
        return lucroLiquido;
    }

    public void setLucroLiquido(BigDecimal lucroLiquido) {
        this.lucroLiquido = lucroLiquido;
    }

    public Integer getTotalPedidos() {
        return totalPedidos;
    }

    public void setTotalPedidos(Integer totalPedidos) {
        this.totalPedidos = totalPedidos;
    }
}