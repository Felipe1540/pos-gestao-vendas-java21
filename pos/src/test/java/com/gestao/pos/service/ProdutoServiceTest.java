package com.gestao.pos.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.gestao.pos.entity.Produto;
import com.gestao.pos.repository.ProdutoRepository;

@ExtendWith(MockitoExtension.class)
public class ProdutoServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private ProdutoService produtoService;

    private Produto produto;

    @BeforeEach
    void setUp() {
        produto = new Produto();
        produto.setId(1L);
        produto.setNome("Cerveja Artesanal");
        produto.setPrecoCompra(new BigDecimal("6.50"));
        produto.setPrecoVenda(new BigDecimal("12.90"));
        produto.setQuantidadeEstoque(48);
    }

    @Test
    void testSalvar() {
        when(produtoRepository.save(any(Produto.class))).thenReturn(produto);

        Produto resultado = produtoService.salvar(produto);

        assertEquals("Cerveja Artesanal", resultado.getNome());
        verify(produtoRepository).save(produto);
    }

    @Test
    void testBuscarPorId() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        Optional<Produto> resultado = produtoService.buscarPorId(1L);

        assertTrue(resultado.isPresent());
        assertEquals("Cerveja Artesanal", resultado.get().getNome());
    }

    @Test
    void testVerificarEstoque_sucesso() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        boolean resultado = produtoService.verificarEstoque(1L, 10);

        assertTrue(resultado);
    }

    @Test
    void testVerificarEstoque_falha_estoque_insuficiente() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        boolean resultado = produtoService.verificarEstoque(1L, 100);

        assertFalse(resultado);
    }

    @Test
    void testExcluir() {
        produtoService.excluir(1L);

        verify(produtoRepository).deleteById(1L);
    }
}