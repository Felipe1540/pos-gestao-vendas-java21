-- V2__add_produtos.sql
-- Adiciona coluna categoria e 10 produtos

ALTER TABLE produtos ADD COLUMN categoria VARCHAR(100);

INSERT INTO produtos (nome, preco_compra, preco_venda, quantidade_estoque, categoria) VALUES
('Cerveja Artesanal', 6.50, 12.90, 48, 'Bebidas'),
('Suco Natural', 3.00, 8.00, 30, 'Bebidas'),
('Agua Mineral', 1.50, 4.00, 50, 'Bebidas'),
('Refrigerante Lata', 2.00, 5.00, 40, 'Bebidas'),
('Batata Frita', 5.00, 15.00, 20, 'Acompanhamentos'),
('Onion Rings', 6.00, 18.00, 15, 'Acompanhamentos'),
('Pao de Queijo', 2.50, 6.00, 25, 'Acompanhamentos'),
('Arroz Branco', 3.00, 8.00, 20, 'Acompanhamentos'),
('Feijao Tropeiro', 4.00, 10.00, 18, 'Acompanhamentos'),
('Mandioca Frita', 4.50, 12.00, 15, 'Acompanhamentos');