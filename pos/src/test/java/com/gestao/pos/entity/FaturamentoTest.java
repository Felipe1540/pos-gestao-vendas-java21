package com.gestao.pos.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;

class FaturamentoTest {

    @Test
    void deveCriarFaturamento() {
        ItemPedido item = new ItemPedido();
        item.setProdutoId(1L);
        item.setQuantidade(2);
        item.setValorUnitarioVenda(new BigDecimal("15.00"));
        item.setValorUnitarioCompra(new BigDecimal("5.00"));
        item.marcarComoPago();

        Faturamento faturamento = Faturamento.criar(item);

        assertNotNull(faturamento);
        assertEquals(1L, faturamento.getProdutoId());
        assertEquals(2, faturamento.getQuantidade());
        assertEquals(new BigDecimal("30.00"), faturamento.getFaturamento());
        assertEquals(new BigDecimal("10.00"), faturamento.getCusto());
        assertEquals(new BigDecimal("20.00"), faturamento.getLucro());
        assertNotNull(faturamento.getDataPagamento());
    }

    @Test
    void deveCalcularLucroNegativo() {
        ItemPedido item = new ItemPedido();
        item.setQuantidade(1);
        item.setValorUnitarioVenda(new BigDecimal("10.00"));
        item.setValorUnitarioCompra(new BigDecimal("15.00"));
        item.marcarComoPago();

        Faturamento faturamento = Faturamento.criar(item);

        assertEquals(new BigDecimal("-5.00"), faturamento.getLucro());
    }
}