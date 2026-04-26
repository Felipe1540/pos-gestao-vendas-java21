package com.gestao.pos.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gestao.pos.dto.AdicionarItemRequest;
import com.gestao.pos.dto.ItemAgrupadoResponse;
import com.gestao.pos.entity.Mesa;
import com.gestao.pos.service.MesaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final MesaService mesaService;

    public PedidoController(MesaService mesaService) {
        this.mesaService = mesaService;
    }

    @PostMapping("/{local}")
    public ResponseEntity<?> adicionarItem(
            @PathVariable String local,
            @Valid @RequestBody AdicionarItemRequest request) {
        try {
            Mesa mesa = mesaService.adicionarItem(local, request.getProdutoId(), request.getQuantidade());
            return ResponseEntity.status(HttpStatus.CREATED).body(mesaService.buscarOuCriarResponse(local));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErroResponse(e.getMessage()));
        }
    }

    @GetMapping("/{local}")
    public ResponseEntity<?> buscarMesa(@PathVariable String local) {
        var response = mesaService.buscarOuCriarResponse(local);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{local}/itens")
    public ResponseEntity<?> listarItens(@PathVariable String local) {
        var response = mesaService.buscarOuCriarResponse(local);
        return ResponseEntity.ok(response.getItens());
    }

    @DeleteMapping("/{local}/item/{produtoId}")
    public ResponseEntity<?> removerItem(
            @PathVariable String local,
            @PathVariable Long produtoId,
            @RequestParam(defaultValue = "1") int quantidade) {
        try {
            mesaService.removerItens(local, produtoId, quantidade);
            return ResponseEntity.ok(mesaService.buscarOuCriarResponse(local));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErroResponse(e.getMessage()));
        }
    }

    public record ErroResponse(String mensagem) {}
}