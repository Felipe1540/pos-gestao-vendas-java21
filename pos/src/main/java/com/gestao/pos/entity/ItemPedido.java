package com.gestao.pos.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "itens_pedido")
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "mesa_id")
    @JsonIgnore
    private Mesa mesa;

    private Long produtoId;

    private Integer quantidade;

    private BigDecimal valorUnitarioVenda;

    private BigDecimal valorUnitarioCompra;

    private LocalDateTime dataHora;

    private LocalDateTime dataPagamento;

    public static ItemPedido criar(Produto produto, int quantidade) {
        ItemPedido item = new ItemPedido();
        item.produtoId = produto.getId();
        item.quantidade = quantidade;
        item.valorUnitarioVenda = produto.getPrecoVenda();
        item.valorUnitarioCompra = produto.getPrecoCompra();
        item.dataHora = LocalDateTime.now();
        return item;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Mesa getMesa() {
        return mesa;
    }

    public void setMesa(Mesa mesa) {
        this.mesa = mesa;
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

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public LocalDateTime getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(LocalDateTime dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public BigDecimal getTotal() {
        return valorUnitarioVenda.multiply(BigDecimal.valueOf(quantidade));
    }

    public BigDecimal getCustoTotal() {
        return valorUnitarioCompra.multiply(BigDecimal.valueOf(quantidade));
    }

    public boolean isPago() {
        return dataPagamento != null;
    }

    public void marcarComoPago() {
        this.dataPagamento = LocalDateTime.now();
    }
}