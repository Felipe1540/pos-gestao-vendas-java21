package com.gestao.pos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestao.pos.entity.Faturamento;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FaturamentoRepository extends JpaRepository<Faturamento, Long> {
    List<Faturamento> findByDataPagamentoBetween(LocalDateTime inicio, LocalDateTime fim);
}