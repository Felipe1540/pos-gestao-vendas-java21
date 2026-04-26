package com.gestao.pos.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

class ProdutoTest {

    @Test
    void deveCriarProduto() {
        Produto produto = new Produto();
        produto.setNome("Cerveja Artesanal");
        produto.setPrecoCompra(new BigDecimal("5.00"));
        produto.setPrecoVenda(new BigDecimal("15.00"));
        produto.setQuantidadeEstoque(50);

        assertNotNull(produto);
        assertEquals("Cerveja Artesanal", produto.getNome());
        assertEquals(new BigDecimal("5.00"), produto.getPrecoCompra());
        assertEquals(new BigDecimal("15.00"), produto.getPrecoVenda());
        assertEquals(50, produto.getQuantidadeEstoque());
    }

    @Test
    void deveValidarEstoqueSuficiente() {
        Produto produto = new Produto();
        produto.setQuantidadeEstoque(10);

        assertEquals(true, produto.temEstoque(5));
        assertEquals(true, produto.temEstoque(10));
        assertEquals(false, produto.temEstoque(11));
    }

    @Test
    void deveReducaoEstoque() {
        Produto produto = new Produto();
        produto.setQuantidadeEstoque(20);

        produto.reduzirEstoque(3);

        assertEquals(17, produto.getQuantidadeEstoque());
    }

    @Test
    void deveAumentarEstoque() {
        Produto produto = new Produto();
        produto.setQuantidadeEstoque(20);

        produto.aumentarEstoque(5);

        assertEquals(25, produto.getQuantidadeEstoque());
    }

    @Test
    void deveTerCategoria() {
        Produto produto = new Produto();
        produto.setNome("Cerveja");
        produto.setCategoria("Bebidas");
        produto.setPrecoVenda(new BigDecimal("10.00"));
        produto.setQuantidadeEstoque(10);

        assertEquals("Bebidas", produto.getCategoria());
    }
}