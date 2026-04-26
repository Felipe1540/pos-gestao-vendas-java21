package com.gestao.pos.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gestao.pos.dto.ProdutoRequest;
import com.gestao.pos.entity.Produto;
import com.gestao.pos.service.ProdutoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listar(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) String categoria) {
        return ResponseEntity.ok(produtoService.listarComFiltro(busca, categoria));
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<String>> listarCategorias() {
        return ResponseEntity.ok(produtoService.listarCategorias());
    }

    @PostMapping
    public ResponseEntity<Produto> criar(@Valid @RequestBody ProdutoRequest request) {
        Produto produto = new Produto();
        produto.setNome(request.getNome());
        produto.setPrecoCompra(request.getPrecoCompra());
        produto.setPrecoVenda(request.getPrecoVenda());
        produto.setQuantidadeEstoque(request.getQuantidadeEstoque());
        produto.setCategoria(request.getCategoria());
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(produtoService.salvar(produto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(
            @PathVariable Long id, 
            @Valid @RequestBody ProdutoRequest request) {
        return produtoService.buscarPorId(id)
            .map(produto -> {
                produto.setNome(request.getNome());
                produto.setPrecoCompra(request.getPrecoCompra());
                produto.setPrecoVenda(request.getPrecoVenda());
                produto.setQuantidadeEstoque(request.getQuantidadeEstoque());
                produto.setCategoria(request.getCategoria());
                return ResponseEntity.ok(produtoService.salvar(produto));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscar(@PathVariable Long id) {
        return produtoService.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        return produtoService.buscarPorId(id)
            .map(produto -> {
                produtoService.excluir(id);
                return ResponseEntity.noContent().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}