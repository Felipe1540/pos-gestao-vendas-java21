package com.gestao.pos.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestao.pos.dto.RelatorioFinanceiro;
import com.gestao.pos.entity.Faturamento;
import com.gestao.pos.repository.FaturamentoRepository;

@Service
@Transactional(readOnly = true)
public class FinanceiroService {

    private final FaturamentoRepository faturamentoRepository;

    public FinanceiroService(FaturamentoRepository faturamentoRepository) {
        this.faturamentoRepository = faturamentoRepository;
    }

    public RelatorioFinanceiro gerarRelatorio() {
        return gerarRelatorioPorPeriodo(null, null);
    }

    public RelatorioFinanceiro gerarRelatorioPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        List<Faturamento> faturamentos;
        
        if (dataInicio == null && dataFim == null) {
            faturamentos = faturamentoRepository.findAll();
        } else {
            LocalDateTime inicio = dataInicio != null ? dataInicio.atStartOfDay() : LocalDate.of(2000, 1, 1).atStartOfDay();
            LocalDateTime fim = dataFim != null ? dataFim.atTime(LocalTime.MAX) : LocalDateTime.now();
            faturamentos = faturamentoRepository.findByDataPagamentoBetween(inicio, fim);
        }
        
        BigDecimal faturamentoBruto = faturamentos.stream()
            .map(Faturamento::getFaturamento)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal custoTotal = faturamentos.stream()
            .map(Faturamento::getCusto)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        int totalPedidos = faturamentos.size();
        
        return new RelatorioFinanceiro(faturamentoBruto, custoTotal, totalPedidos);
    }
}