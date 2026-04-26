package com.gestao.pos.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gestao.pos.dto.MesaResponse;
import com.gestao.pos.entity.Mesa;
import com.gestao.pos.repository.MesaRepository;
import com.gestao.pos.service.MesaService;

@RestController
@RequestMapping("/api/mesas")
public class MesaController {

    private final MesaService mesaService;
    private final MesaRepository mesaRepository;

    public MesaController(MesaService mesaService, MesaRepository mesaRepository) {
        this.mesaService = mesaService;
        this.mesaRepository = mesaRepository;
    }

    @GetMapping
    public ResponseEntity<List<MesaResponse>> listarMesas() {
        List<Mesa> mesas = mesaRepository.findAll();
        List<MesaResponse> responses = mesas.stream()
            .filter(m -> !m.getNumeroMesa().equals("BALCAO"))
            .map(mesa -> mesaService.buscarOuCriarResponse(mesa.getNumeroMesa()))
            .toList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<?> criarMesa(@RequestBody CriarMesaRequest request) {
        if (request.numeroMesa() == null || request.numeroMesa().isEmpty()) {
            return ResponseEntity.badRequest().body(new ErroResponse("Número da mesa é obrigatório"));
        }
        mesaService.buscarOuCriar(request.numeroMesa());
        return ResponseEntity.ok(mesaService.buscarOuCriarResponse(request.numeroMesa()));
    }

    public record CriarMesaRequest(String numeroMesa) {}
    public record ErroResponse(String mensagem) {}
}