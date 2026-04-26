package com.gestao.pos.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.gestao.pos.entity.ItemPedido;
import com.gestao.pos.entity.Mesa;
import com.gestao.pos.entity.MesaStatus;
import com.gestao.pos.entity.Produto;
import com.gestao.pos.repository.FaturamentoRepository;
import com.gestao.pos.repository.MesaRepository;
import com.gestao.pos.repository.ProdutoRepository;

@ExtendWith(MockitoExtension.class)
class MesaServiceTest {

    @Mock
    private MesaRepository mesaRepository;

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private FaturamentoRepository faturamentoRepository;

    @InjectMocks
    private MesaService mesaService;

    @Test
    void deveCriarMesa() {
        Mesa mesa = new Mesa("Mesa-01");
        
        when(mesaRepository.save(any(Mesa.class))).thenReturn(mesa);
        
        Mesa resultado = mesaService.criarMesa("Mesa-01");
        
        assertNotNull(resultado);
        assertEquals("Mesa-01", resultado.getNumeroMesa());
    }

    @Test
    void deveAdicionarItemNaMesa() {
        Mesa mesa = new Mesa("Mesa-01");
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setPrecoVenda(new BigDecimal("15.00"));
        produto.setPrecoCompra(new BigDecimal("5.00"));
        produto.setQuantidadeEstoque(10);
        
        when(mesaRepository.findByNumeroMesa("Mesa-01")).thenReturn(Optional.of(mesa));
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        when(mesaRepository.save(any(Mesa.class))).thenReturn(mesa);
        
        Mesa resultado = mesaService.adicionarItem("Mesa-01", 1L, 2);
        
        assertEquals(1, resultado.getItens().size());
    }

    @Test
    void deveCalcularTotalDaMesa() {
        Mesa mesa = new Mesa("Mesa-01");
        
        when(mesaRepository.findByNumeroMesa("Mesa-01")).thenReturn(Optional.of(mesa));
        
        BigDecimal total = mesaService.calcularTotal("Mesa-01");
        
        assertEquals(BigDecimal.ZERO, total);
    }

    @Test
    void deveAdicionarItemEReduZirEstoque() {
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setNome("Cerveja");
        produto.setPrecoVenda(new BigDecimal("10.00"));
        produto.setPrecoCompra(new BigDecimal("5.00"));
        produto.setQuantidadeEstoque(10);

        Mesa mesa = new Mesa("Mesa-01");

        when(mesaRepository.findByNumeroMesa("Mesa-01")).thenReturn(Optional.of(mesa));
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        when(mesaRepository.save(any(Mesa.class))).thenAnswer(inv -> inv.getArgument(0));

        mesaService.adicionarItem("Mesa-01", 1L, 3);

        assertEquals(7, produto.getQuantidadeEstoque());
    }

    @Test
    void deveReabrirMesaPaga() {
        Mesa mesaPaga = new Mesa("Mesa-01");
        mesaPaga.setStatus(MesaStatus.PAGA);

        when(mesaRepository.findByNumeroMesa("Mesa-01")).thenReturn(Optional.of(mesaPaga));
        when(mesaRepository.save(any(Mesa.class))).thenAnswer(inv -> inv.getArgument(0));

        Mesa result = mesaService.buscarOuCriar("Mesa-01");

        assertEquals(MesaStatus.ABERTA, result.getStatus());
    }
}