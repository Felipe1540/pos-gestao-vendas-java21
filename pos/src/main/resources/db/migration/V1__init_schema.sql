-- V1__init_schema.sql
-- Sistema de Gestão de Vendas - PostgreSQL

CREATE TABLE produtos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco_compra NUMERIC(10,2) NOT NULL,
    preco_venda NUMERIC(10,2) NOT NULL,
    quantidade_estoque INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mesas (
    id BIGSERIAL PRIMARY KEY,
    numero_mesa VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itens_pedido (
    id BIGSERIAL PRIMARY KEY,
    mesa_id BIGINT,
    produto_id BIGINT NOT NULL,
    quantidade INTEGER NOT NULL,
    valor_unitario_venda NUMERIC(10,2) NOT NULL,
    valor_unitario_compra NUMERIC(10,2) NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_pagamento TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE faturas (
    id BIGSERIAL PRIMARY KEY,
    produto_id BIGINT NOT NULL,
    quantidade INTEGER NOT NULL,
    valor_unitario_venda NUMERIC(10,2) NOT NULL,
    valor_unitario_compra NUMERIC(10,2) NOT NULL,
    data_pagamento TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_itens_mesa ON itens_pedido(mesa_id);
CREATE INDEX idx_itens_produto ON itens_pedido(produto_id);
CREATE INDEX idx_faturas_data ON faturas(data_pagamento);

ALTER TABLE itens_pedido ADD CONSTRAINT fk_itens_mesa FOREIGN KEY (mesa_id) REFERENCES mesas(id);
ALTER TABLE itens_pedido ADD CONSTRAINT fk_itens_produto FOREIGN KEY (produto_id) REFERENCES produtos(id);
ALTER TABLE faturas ADD CONSTRAINT fk_faturas_produto FOREIGN KEY (produto_id) REFERENCES produtos(id);