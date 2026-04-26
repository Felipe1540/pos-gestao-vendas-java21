package com.gestao.pos.dto;

import java.math.BigDecimal;

public class ItemAgrupadoResponse {
    
    private Long produtoId;
    private String produtoNome;
    private int quantidadeTotal;
    private BigDecimal valorUnitarioVenda;
    private BigDecimal valorUnitarioCompra;
    private BigDecimal subtotal;

    public ItemAgrupadoResponse() {}

    public ItemAgrupadoResponse(Long produtoId, String produtoNome, int quantidadeTotal, 
                           BigDecimal valorUnitarioVenda, BigDecimal valorUnitarioCompra) {
        this.produtoId = produtoId;
        this.produtoNome = produtoNome;
        this.quantidadeTotal = quantidadeTotal;
        this.valorUnitarioVenda = valorUnitarioVenda;
        this.valorUnitarioCompra = valorUnitarioCompra;
        this.subtotal = valorUnitarioVenda.multiply(BigDecimal.valueOf(quantidadeTotal));
    }

    public Long getProdutoId() { return produtoId; }
    public void setProdutoId(Long produtoId) { this.produtoId = produtoId; }
    
    public String getProdutoNome() { return produtoNome; }
    public void setProdutoNome(String produtoNome) { this.produtoNome = produtoNome; }
    
    public int getQuantidadeTotal() { return quantidadeTotal; }
    public int getQuantidade() { return quantidadeTotal; }
    public void setQuantidadeTotal(int quantidadeTotal) { this.quantidadeTotal = quantidadeTotal; }
    public void setQuantidade(int quantidade) { this.quantidadeTotal = quantidade; }
    
    public BigDecimal getValorUnitarioVenda() { return valorUnitarioVenda; }
    public void setValorUnitarioVenda(BigDecimal valorUnitarioVenda) { this.valorUnitarioVenda = valorUnitarioVenda; }
    
    public BigDecimal getValorUnitarioCompra() { return valorUnitarioCompra; }
    public void setValorUnitarioCompra(BigDecimal valorUnitarioCompra) { this.valorUnitarioCompra = valorUnitarioCompra; }
    
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}