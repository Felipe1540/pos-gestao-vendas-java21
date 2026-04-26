package com.gestao.pos.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "mesas")
public class Mesa {

    public static final String BALCAO = "BALCAO";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroMesa;

    private MesaStatus status;

    @OneToMany(mappedBy = "mesa", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ItemPedido> itens = new ArrayList<>();

    public Mesa() {
    }

    public Mesa(String numeroMesa) {
        this.numeroMesa = numeroMesa;
        this.status = MesaStatus.ABERTA;
    }

    public void adicionarItem(ItemPedido item) {
        item.setMesa(this);
        itens.add(item);
    }

    public void removerItem(Long itemId) {
        itens.removeIf(item -> Objects.equals(item.getId(), itemId));
    }

    public BigDecimal getTotal() {
        return itens.stream()
            .map(ItemPedido::getTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void marcarComoPaga() {
        this.status = MesaStatus.PAGA;
        for (ItemPedido item : itens) {
            item.marcarComoPago();
        }
    }

    public boolean isAberta() {
        return status == MesaStatus.ABERTA;
    }

    public boolean isPaga() {
        return status == MesaStatus.PAGA;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroMesa() {
        return numeroMesa;
    }

    public void setNumeroMesa(String numeroMesa) {
        this.numeroMesa = numeroMesa;
    }

    public MesaStatus getStatus() {
        return status;
    }

    public void setStatus(MesaStatus status) {
        this.status = status;
    }

    public List<ItemPedido> getItens() {
        return itens;
    }

    public void setItens(List<ItemPedido> itens) {
        this.itens = itens;
    }
}