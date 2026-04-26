package com.gestao.pos.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestao.pos.entity.Produto;
import com.gestao.pos.repository.ProdutoRepository;

@Service
@Transactional
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    public Optional<Produto> buscarPorId(Long id) {
        return produtoRepository.findById(id);
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public List<Produto> listarComFiltro(String busca, String categoria) {
        List<Produto> produtos = produtoRepository.findByQuantidadeEstoqueGreaterThan(0);
        
        if (busca != null && !busca.isEmpty()) {
            String buscaLower = busca.toLowerCase();
            produtos = produtos.stream()
                .filter(p -> p.getNome().toLowerCase().contains(buscaLower))
                .collect(Collectors.toList());
        }
        
        if (categoria != null && !categoria.isEmpty() && !categoria.equals("Todas")) {
            produtos = produtos.stream()
                .filter(p -> categoria.equalsIgnoreCase(p.getCategoria()))
                .collect(Collectors.toList());
        }
        
        return produtos;
    }

    public List<String> listarCategorias() {
        return produtoRepository.findAll().stream()
            .map(Produto::getCategoria)
            .filter(c -> c != null && !c.isEmpty())
            .distinct()
            .sorted()
            .collect(Collectors.toList());
    }

    public void atualizarEstoque(Long produtoId, int quantidade) {
        Produto produto = produtoRepository.findById(produtoId)
            .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
        produto.reduzirEstoque(quantidade);
        produtoRepository.save(produto);
    }

    public boolean verificarEstoque(Long produtoId, int quantidade) {
        return produtoRepository.findById(produtoId)
            .map(produto -> produto.temEstoque(quantidade))
            .orElse(false);
    }

    public void excluir(Long id) {
        produtoRepository.deleteById(id);
    }
}