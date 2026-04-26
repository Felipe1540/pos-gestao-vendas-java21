package com.gestao.pos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gestao.pos.dto.MesaResponse;
import com.gestao.pos.dto.PagamentoParcialRequest;
import com.gestao.pos.service.MesaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentoController {

    private final MesaService mesaService;

    public PagamentoController(MesaService mesaService) {
        this.mesaService = mesaService;
    }

    @PostMapping("/parcial/{local}")
    public ResponseEntity<?> pagamentoParcial(
            @PathVariable String local,
            @Valid @RequestBody PagamentoParcialRequest request) {
        try {
            for (PagamentoParcialRequest.ItemPagamento item : request.getItens()) {
                mesaService.pagarItensPorProduto(local, item.getProdutoId(), item.getQuantidade());
            }
            return ResponseEntity.ok(mesaService.buscarOuCriarResponse(local));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest()
                .body(new PedidoController.ErroResponse(e.getMessage()));
        }
    }

    @PostMapping("/parcial")
    public ResponseEntity<?> pagamentoParcialSimples(@RequestBody PagamentoSimplesRequest request) {
        try {
            mesaService.pagarItensPorProduto(request.getNumeroMesa(), request.getProdutoId(), request.getQuantidade());
            return ResponseEntity.ok(mesaService.buscarOuCriarResponse(request.getNumeroMesa()));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest()
                .body(new PedidoController.ErroResponse(e.getMessage()));
        }
    }

    public static class PagamentoSimplesRequest {
        private String numeroMesa;
        private Long produtoId;
        private Integer quantidade;

        public String getNumeroMesa() { return numeroMesa; }
        public void setNumeroMesa(String numeroMesa) { this.numeroMesa = numeroMesa; }
        public Long getProdutoId() { return produtoId; }
        public void setProdutoId(Long produtoId) { this.produtoId = produtoId; }
        public Integer getQuantidade() { return quantidade; }
        public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    }

    @PostMapping("/total/{local}")
    public ResponseEntity<?> pagamentoTotal(@PathVariable String local) {
        try {
            mesaService.pagarTodos(local);
            return ResponseEntity.ok(mesaService.buscarOuCriarResponse(local));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                .body(new PedidoController.ErroResponse(e.getMessage()));
        }
    }
}