package com.gestao.pos.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

public class PagamentoParcialRequest {
    
    private List<ItemPagamento> itens;

    public List<ItemPagamento> getItens() {
        return itens;
    }

    public void setItens(List<ItemPagamento> itens) {
        this.itens = itens;
    }

    public static class ItemPagamento {
        
        @NotNull(message = "Produto ID é obrigatório")
        private Long produtoId;
        
        @NotNull(message = "Quantidade é obrigatória")
        @Positive(message = "Quantidade deve ser positiva")
        private Integer quantidade;

        public Long getProdutoId() { return produtoId; }
        public void setProdutoId(Long produtoId) { this.produtoId = produtoId; }
        
        public Integer getQuantidade() { return quantidade; }
        public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    }
}