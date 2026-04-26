package com.gestao.pos.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class PagamentoRequest {

    @NotEmpty(message = "Lista de itens é obrigatória")
    private List<Long> itemIds;

    public List<Long> getItemIds() {
        return itemIds;
    }

    public void setItemIds(List<Long> itemIds) {
        this.itemIds = itemIds;
    }
}