package com.gestao.pos.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;

class MesaTest {

    @Test
    void deveCriarMesa() {
        Mesa mesa = new Mesa("Mesa-01");

        assertNotNull(mesa);
        assertEquals("Mesa-01", mesa.getNumeroMesa());
        assertEquals(MesaStatus.ABERTA, mesa.getStatus());
        assertTrue(mesa.getItens().isEmpty());
    }

    @Test
    void deveCriarMesaBalcao() {
        Mesa mesa = new Mesa(Mesa.BALCAO);

        assertEquals(Mesa.BALCAO, mesa.getNumeroMesa());
    }

    @Test
    void deveAdicionarItem() {
        Mesa mesa = new Mesa("Mesa-01");
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setPrecoVenda(new BigDecimal("15.00"));

        ItemPedido item = ItemPedido.criar(produto, 2);
        mesa.adicionarItem(item);

        assertEquals(1, mesa.getItens().size());
    }

    @Test
    void deveCalcularTotal() {
        Mesa mesa = new Mesa("Mesa-01");
        
       Produto produto = new Produto();
        produto.setId(1L);
        produto.setPrecoVenda(new BigDecimal("10.00"));
        
        mesa.adicionarItem(ItemPedido.criar(produto, 2));
        
        produto.setId(2L);
        produto.setPrecoVenda(new BigDecimal("5.00"));
        mesa.adicionarItem(ItemPedido.criar(produto, 3));

        assertEquals(new BigDecimal("35.00"), mesa.getTotal());
    }

    @Test
    void deveRemoverItem() {
        Mesa mesa = new Mesa("Mesa-01");
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setPrecoVenda(new BigDecimal("15.00"));
        
        ItemPedido item = ItemPedido.criar(produto, 1);
        mesa.adicionarItem(item);

        mesa.removerItem(item.getId());

        assertTrue(mesa.getItens().isEmpty());
    }

    @Test
    void deveVerificarStatusAberta() {
        Mesa mesa = new Mesa("mesa-01");
        
        assertEquals(MesaStatus.ABERTA, mesa.getStatus());
        assertTrue(mesa.isAberta());
        assertFalse(mesa.isPaga());
    }

    @Test
    void deveVerificarStatusPaga() {
        Mesa mesa = new Mesa("mesa-01");
        
        mesa.marcarComoPaga();
        
        assertEquals(MesaStatus.PAGA, mesa.getStatus());
        assertFalse(mesa.isAberta());
        assertTrue(mesa.isPaga());
    }
}