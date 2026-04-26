package com.gestao.pos.dto;

import java.math.BigDecimal;
import java.util.List;

public class MesaResponse {
    
    private Long id;
    private String numeroMesa;
    private String status;
    private BigDecimal total;
    private List<ItemAgrupadoResponse> itens;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNumeroMesa() { return numeroMesa; }
    public void setNumeroMesa(String numeroMesa) { this.numeroMesa = numeroMesa; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    
    public List<ItemAgrupadoResponse> getItens() { return itens; }
    public void setItens(List<ItemAgrupadoResponse> itens) { this.itens = itens; }
}