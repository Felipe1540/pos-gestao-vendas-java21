package com.gestao.pos.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestao.pos.dto.ItemAgrupadoResponse;
import com.gestao.pos.dto.MesaResponse;
import com.gestao.pos.entity.Faturamento;
import com.gestao.pos.entity.ItemPedido;
import com.gestao.pos.entity.Mesa;
import com.gestao.pos.entity.MesaStatus;
import com.gestao.pos.entity.Produto;
import com.gestao.pos.repository.FaturamentoRepository;
import com.gestao.pos.repository.MesaRepository;
import com.gestao.pos.repository.ProdutoRepository;

@Service
@Transactional
public class MesaService {

    private final MesaRepository mesaRepository;
    private final ProdutoRepository produtoRepository;
    private final FaturamentoRepository faturamentoRepository;

    public MesaService(MesaRepository mesaRepository, ProdutoRepository produtoRepository, 
                   FaturamentoRepository faturamentoRepository) {
        this.mesaRepository = mesaRepository;
        this.produtoRepository = produtoRepository;
        this.faturamentoRepository = faturamentoRepository;
    }

    public Mesa criarMesa(String numeroMesa) {
        Mesa mesa = new Mesa(numeroMesa);
        return mesaRepository.save(mesa);
    }

    public Optional<Mesa> buscarPorNumero(String numeroMesa) {
        if (numeroMesa == null || numeroMesa.isEmpty()) {
            numeroMesa = Mesa.BALCAO;
        }
        return mesaRepository.findByNumeroMesa(numeroMesa);
    }

    public Mesa buscarOuCriar(String numeroMesa) {
        final String local = (numeroMesa == null || numeroMesa.isEmpty()) 
            ? Mesa.BALCAO 
            : numeroMesa;
        Optional<Mesa> existente = mesaRepository.findByNumeroMesa(local);
        if (existente.isPresent()) {
            Mesa mesa = existente.get();
            if (mesa.isPaga()) {
                mesa.setStatus(MesaStatus.ABERTA);
                return mesaRepository.save(mesa);
            }
            return mesa;
        }
        return criarMesa(local);
    }

    public Mesa adicionarItem(String numeroMesa, Long produtoId, int quantidade) {
        Mesa mesa = buscarOuCriar(numeroMesa);
        Produto produto = produtoRepository.findById(produtoId)
            .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado: " + produtoId));

        if (!produto.temEstoque(quantidade)) {
            throw new IllegalArgumentException("Estoque insuficiente para: " + produto.getNome());
        }

        produto.reduzirEstoque(quantidade);
        produtoRepository.save(produto);

        ItemPedido item = ItemPedido.criar(produto, quantidade);
        mesa.adicionarItem(item);
        
        return mesaRepository.save(mesa);
    }

    public Mesa removerItem(String numeroMesa, Long itemId) {
        Mesa mesa = buscarOuCriar(numeroMesa);
        
        ItemPedido itemRemover = mesa.getItens().stream()
            .filter(item -> item.getId().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Item não encontrado"));

        Produto produto = produtoRepository.findById(itemRemover.getProdutoId())
            .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
        produto.aumentarEstoque(itemRemover.getQuantidade());
        produtoRepository.save(produto);

        mesa.removerItem(itemId);
        
        return mesaRepository.save(mesa);
    }

    public BigDecimal calcularTotal(String numeroMesa) {
        return buscarOuCriar(numeroMesa).getTotal();
    }

    public List<ItemPedido> listarItens(String numeroMesa) {
        return buscarOuCriar(numeroMesa).getItens();
    }

    public Mesa pagarItens(String numeroMesa, List<Long> itemIds) {
        Mesa mesa = buscarOuCriar(numeroMesa);
        
        if (!mesa.isAberta()) {
            throw new IllegalStateException("Mesa já está paga");
        }

        List<ItemPedido> itensParaPagar = mesa.getItens().stream()
            .filter(item -> itemIds.contains(item.getId()))
            .collect(Collectors.toList());

        if (itensParaPagar.isEmpty()) {
            throw new IllegalArgumentException("Nenhum item encontrado para pagamento");
        }

        for (ItemPedido item : itensParaPagar) {
            item.marcarComoPago();
            Faturamento faturamento = Faturamento.criar(item);
            faturamentoRepository.save(faturamento);
        }

        mesa.getItens().removeIf(item -> itemIds.contains(item.getId()));
        
        if (mesa.getItens().isEmpty()) {
            mesa.setStatus(MesaStatus.PAGA);
        }
        
        return mesaRepository.save(mesa);
    }

    public Mesa pagarTodos(String numeroMesa) {
        Mesa mesa = buscarOuCriar(numeroMesa);
        
        if (!mesa.isAberta()) {
            throw new IllegalStateException("Mesa já está paga");
        }

        for (ItemPedido item : mesa.getItens()) {
            item.marcarComoPago();
            Faturamento faturamento = Faturamento.criar(item);
            faturamentoRepository.save(faturamento);
        }

        mesa.setStatus(MesaStatus.PAGA);
        mesa.getItens().clear();
        
        return mesaRepository.save(mesa);
    }

    public MesaResponse buscarOuCriarResponse(String numeroMesa) {
        Mesa mesa = buscarOuCriar(numeroMesa);
        
        Map<Long, List<ItemPedido>> itensPorProduto = mesa.getItens().stream()
            .collect(Collectors.groupingBy(ItemPedido::getProdutoId));
        
        List<ItemAgrupadoResponse> itensAgrupados = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        
        for (Map.Entry<Long, List<ItemPedido>> entry : itensPorProduto.entrySet()) {
            List<ItemPedido> itensDoProduto = entry.getValue();
            
            Produto produto = produtoRepository.findById(entry.getKey()).orElse(null);
            String nomeProduto = produto != null ? produto.getNome() : "Produto #" + entry.getKey();
            
            int qtdTotal = itensDoProduto.stream().mapToInt(ItemPedido::getQuantidade).sum();
            ItemPedido primeiro = itensDoProduto.get(0);
            
            ItemAgrupadoResponse agrupado = new ItemAgrupadoResponse(
                entry.getKey(),
                nomeProduto,
                qtdTotal,
                primeiro.getValorUnitarioVenda(),
                primeiro.getValorUnitarioCompra()
            );
            
            itensAgrupados.add(agrupado);
            total = total.add(agrupado.getSubtotal());
        }
        
        MesaResponse response = new MesaResponse();
        response.setId(mesa.getId());
        response.setNumeroMesa(mesa.getNumeroMesa());
        response.setStatus(mesa.getStatus().name());
        response.setTotal(total);
        response.setItens(itensAgrupados);
        
        return response;
    }

    public void removerItens(String numeroMesa, Long produtoId, int quantidade) {
        Mesa mesa = buscarOuCriar(numeroMesa);
        
        List<ItemPedido> itensDoProduto = mesa.getItens().stream()
            .filter(item -> item.getProdutoId().equals(produtoId) && !item.isPago())
            .collect(Collectors.toList());
        
        int qtdRemover = quantidade;
        for (ItemPedido item : itensDoProduto) {
            if (qtdRemover <= 0) break;
            
            int qtdItem = item.getQuantidade();
            int qtdReal = Math.min(qtdItem, qtdRemover);
            
            Produto produto = produtoRepository.findById(produtoId).orElse(null);
            if (produto != null) {
                produto.aumentarEstoque(qtdReal);
                produtoRepository.save(produto);
            }
            
            item.setQuantidade(qtdItem - qtdReal);
            qtdRemover -= qtdReal;
            
            if (item.getQuantidade() <= 0) {
                mesa.getItens().remove(item);
            }
        }
        
        mesaRepository.save(mesa);
    }

    public void pagarItensPorProduto(String numeroMesa, Long produtoId, int quantidade) {
        Mesa mesa = buscarOuCriar(numeroMesa);
        
        if (!mesa.isAberta()) {
            throw new IllegalStateException("Mesa já está paga");
        }
        
        List<ItemPedido> itensDoProduto = mesa.getItens().stream()
            .filter(item -> item.getProdutoId().equals(produtoId) && !item.isPago())
            .collect(Collectors.toList());
        
        int qtdPagar = quantidade;
        for (ItemPedido item : itensDoProduto) {
            if (qtdPagar <= 0) break;
            
            int qtdItem = item.getQuantidade();
            int qtdReal = Math.min(qtdItem, qtdPagar);
            
            ItemPedido itemParcial = new ItemPedido();
            itemParcial.setProdutoId(item.getProdutoId());
            itemParcial.setQuantidade(qtdReal);
            itemParcial.setValorUnitarioVenda(item.getValorUnitarioVenda());
            itemParcial.setValorUnitarioCompra(item.getValorUnitarioCompra());
            itemParcial.setDataHora(item.getDataHora());
            itemParcial.marcarComoPago();
            
            Faturamento faturamento = Faturamento.criar(itemParcial);
            faturamentoRepository.save(faturamento);
            
            qtdPagar -= qtdReal;
            
            if (qtdItem == qtdReal) {
                mesa.getItens().remove(item);
            } else {
                item.setQuantidade(qtdItem - qtdReal);
            }
        }
        
        if (mesa.getItens().isEmpty()) {
            mesa.setStatus(MesaStatus.PAGA);
        }
        
        mesaRepository.save(mesa);
    }
}