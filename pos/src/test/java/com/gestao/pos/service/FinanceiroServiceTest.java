package com.gestao.pos.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.gestao.pos.dto.RelatorioFinanceiro;
import com.gestao.pos.entity.Faturamento;
import com.gestao.pos.repository.FaturamentoRepository;

@ExtendWith(MockitoExtension.class)
class FinanceiroServiceTest {

    @Mock
    private FaturamentoRepository faturamentoRepository;

    @InjectMocks
    private FinanceiroService financeiroService;

    @Test
    void deveGerarRelatorioVazio() {
        when(faturamentoRepository.findAll()).thenReturn(List.of());
        
        RelatorioFinanceiro relatorio = financeiroService.gerarRelatorio();
        
        assertEquals(BigDecimal.ZERO, relatorio.getFaturamentoBruto());
        assertEquals(BigDecimal.ZERO, relatorio.getCustoTotal());
        assertEquals(BigDecimal.ZERO, relatorio.getLucroLiquido());
    }

    @Test
    void deveGerarRelatorioComDados() {
        Faturamento f1 = new Faturamento();
        f1.setQuantidade(10);
        f1.setValorUnitarioVenda(new BigDecimal("10.00"));
        f1.setValorUnitarioCompra(new BigDecimal("4.00"));
        
        Faturamento f2 = new Faturamento();
        f2.setQuantidade(5);
        f2.setValorUnitarioVenda(new BigDecimal("10.00"));
        f2.setValorUnitarioCompra(new BigDecimal("4.00"));
        
        when(faturamentoRepository.findAll()).thenReturn(List.of(f1, f2));
        
        RelatorioFinanceiro relatorio = financeiroService.gerarRelatorio();
        
        assertEquals(new BigDecimal("150.00"), relatorio.getFaturamentoBruto());
        assertEquals(new BigDecimal("60.00"), relatorio.getCustoTotal());
        assertEquals(new BigDecimal("90.00"), relatorio.getLucroLiquido());
    }

    @Test
    void deveFiltrarPorPeriodo() {
        Faturamento f1 = new Faturamento();
        f1.setQuantidade(10);
        f1.setValorUnitarioVenda(new BigDecimal("10.00"));
        f1.setValorUnitarioCompra(new BigDecimal("4.00"));
        f1.setDataPagamento(LocalDateTime.of(2026, 1, 15, 10, 0));
        
        Faturamento f2 = new Faturamento();
        f2.setQuantidade(5);
        f2.setValorUnitarioVenda(new BigDecimal("10.00"));
        f2.setValorUnitarioCompra(new BigDecimal("4.00"));
        f2.setDataPagamento(LocalDateTime.of(2026, 2, 20, 14, 0));
        
        LocalDate dataInicio = LocalDate.of(2026, 1, 1);
        LocalDate dataFim = LocalDate.of(2026, 1, 31);
        
        when(faturamentoRepository.findByDataPagamentoBetween(any(), any()))
            .thenReturn(List.of(f1));
        
        RelatorioFinanceiro relatorio = financeiroService.gerarRelatorioPorPeriodo(dataInicio, dataFim);
        
        assertEquals(new BigDecimal("100.00"), relatorio.getFaturamentoBruto());
        assertEquals(new BigDecimal("40.00"), relatorio.getCustoTotal());
        assertEquals(new BigDecimal("60.00"), relatorio.getLucroLiquido());
    }
}