package com.gestao.pos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ProdutoRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotNull(message = "Preço de compra é obrigatório")
    private java.math.BigDecimal precoCompra;

    @NotNull(message = "Preço de venda é obrigatório")
    private java.math.BigDecimal precoVenda;

    @NotNull(message = "Quantidade em estoque é obrigatória")
    @Positive(message = "Quantidade deve ser positiva")
    private Integer quantidadeEstoque;

    private String categoria;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public java.math.BigDecimal getPrecoCompra() {
        return precoCompra;
    }

    public void setPrecoCompra(java.math.BigDecimal precoCompra) {
        this.precoCompra = precoCompra;
    }

    public java.math.BigDecimal getPrecoVenda() {
        return precoVenda;
    }

    public void setPrecoVenda(java.math.BigDecimal precoVenda) {
        this.precoVenda = precoVenda;
    }

    public Integer getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public void setQuantidadeEstoque(Integer quantidadeEstoque) {
        this.quantidadeEstoque = quantidadeEstoque;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
}