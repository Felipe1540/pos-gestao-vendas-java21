package com.gestao.pos.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;

class ItemPedidoTest {

    @Test
    void deveCriarItemPedido() {
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setNome("Cerveja");
        produto.setPrecoCompra(new BigDecimal("5.00"));
        produto.setPrecoVenda(new BigDecimal("15.00"));

        ItemPedido item = ItemPedido.criar(produto, 2);

        assertNotNull(item);
        assertEquals(1L, item.getProdutoId());
        assertEquals(2, item.getQuantidade());
        assertEquals(new BigDecimal("15.00"), item.getValorUnitarioVenda());
        assertEquals(new BigDecimal("5.00"), item.getValorUnitarioCompra());
        assertNotNull(item.getDataHora());
    }

    @Test
    void deveCalcularTotal() {
        ItemPedido item = new ItemPedido();
        item.setQuantidade(3);
        item.setValorUnitarioVenda(new BigDecimal("10.00"));

        assertEquals(new BigDecimal("30.00"), item.getTotal());
    }

    @Test
    void deveCalcularCusto() {
        ItemPedido item = new ItemPedido();
        item.setQuantidade(3);
        item.setValorUnitarioCompra(new BigDecimal("5.00"));

        assertEquals(new BigDecimal("15.00"), item.getCustoTotal());
    }

    @Test
    void deveVerificarStatusPago() {
        ItemPedido item = new ItemPedido();
        
        assertFalse(item.isPago());
        
        item.setDataPagamento(LocalDateTime.now());
        
        assertTrue(item.isPago());
    }
}