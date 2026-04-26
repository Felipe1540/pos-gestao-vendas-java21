package com.gestao.pos.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "faturamentos")
public class Faturamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long produtoId;

    private Integer quantidade;

    private BigDecimal valorUnitarioVenda;

    private BigDecimal valorUnitarioCompra;

    private LocalDateTime dataPagamento;

    public static Faturamento criar(ItemPedido item) {
        Faturamento f = new Faturamento();
        f.produtoId = item.getProdutoId();
        f.quantidade = item.getQuantidade();
        f.valorUnitarioVenda = item.getValorUnitarioVenda();
        f.valorUnitarioCompra = item.getValorUnitarioCompra();
        f.dataPagamento = item.getDataPagamento();
        return f;
    }

    public BigDecimal getFaturamento() {
        return valorUnitarioVenda.multiply(BigDecimal.valueOf(quantidade));
    }

    public BigDecimal getCusto() {
        return valorUnitarioCompra.multiply(BigDecimal.valueOf(quantidade));
    }

    public BigDecimal getLucro() {
        return getFaturamento().subtract(getCusto());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(Long produtoId) {
        this.produtoId = produtoId;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public BigDecimal getValorUnitarioVenda() {
        return valorUnitarioVenda;
    }

    public void setValorUnitarioVenda(BigDecimal valorUnitarioVenda) {
        this.valorUnitarioVenda = valorUnitarioVenda;
    }

    public BigDecimal getValorUnitarioCompra() {
        return valorUnitarioCompra;
    }

    public void setValorUnitarioCompra(BigDecimal valorUnitarioCompra) {
        this.valorUnitarioCompra = valorUnitarioCompra;
    }

    public LocalDateTime getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(LocalDateTime dataPagamento) {
        this.dataPagamento = dataPagamento;
    }
}