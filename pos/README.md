# Controle de Gestão de Vendas – Breja's

## 1. Objetivo do Sistema
Solução multiplataforma (Web, Android e iOS) para gestão operacional e financeira, permitindo o controle total de vendas por mesa, vendas avulsas e gestão de estoque com foco no cálculo real de lucro líquido.

## 2. Funcionalidades Operacionais (Frente de Caixa)
- **Gestão de Mesas**: Acompanhamento em tempo real de mesas ocupadas e disponíveis.
- **Vendas Avulsas (Balcão)**: Possibilidade de registrar vendas rápidas sem necessidade de vincular a uma mesa específica.
- **Pedidos Flexíveis**: Registro de múltiplos itens por mesa com atualização imediata do sistema.
- **Pagamento Parcial**: Funcionalidade que permite "dividir a conta" ou pagar itens individuais de uma mesa sem encerrar o consumo dos restantes clientes.

## 3. Gestão de Estoque e Depósito
- **Cadastro Completo de Produtos**: Registro de nome, quantidade disponível e, fundamentalmente, o valor de custo (compra) e valor de venda.
- **Baixa Automática**: O estoque é atualizado no momento em que o pedido é realizado, evitando a venda de produtos indisponíveis.
- **Histórico de Custos**: O sistema grava o preço de compra no momento exato da venda para garantir a precisão dos relatórios financeiros, mesmo que os preços dos fornecedores mudem depois.

## 4. Inteligência Financeira e Relatórios
Diferente de sistemas comuns, o foco aqui é a saúde financeira do negócio:
- **Faturamento Bruto**: Visualização do total de entrada de dinheiro.
- **Custo de Mercadoria Vendida (CMV)**: Cálculo automático do quanto foi gasto para realizar aquelas vendas.
- **Lucro Líquido**: Demonstração do ganho real após a subtração dos custos.
- **Relatório de Pedidos**: Listagem detalhada de todos os itens vendidos, com data, hora e origem (mesa ou avulso).

---

## Stack Tecnológica
- **Backend**: Java 21, Spring Boot 3, Maven
- **Database**: PostgreSQL com Flyway (H2 para desenvolvimento)
- **API**: RESTful com JSON

---

## Endpoints da API

### Produtos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/produtos` | Listar todos os produtos |
| POST | `/api/produtos` | Criar novo produto |
| GET | `/api/produtos/{id}` | Buscar produto por ID |
| PUT | `/api/produtos/{id}` | Atualizar produto |

### Pedidos/Mesas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/pedidos/{local}` | Adicionar item na mesa |
| GET | `/api/pedidos/{local}` | Ver mesa com itens agrupados |
| GET | `/api/pedidos/{local}/itens` | Listar itens da mesa |
| DELETE | `/api/pedidos/{local}/item/{produtoId}` | Remover itens (por produto) |

### Pagamentos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/pagamentos/parcial/{local}` | Pagamento parcial (itens específicos) |
| POST | `/api/pagamentos/total/{local}` | Pagamento total da mesa |

### Financeiro
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/financeiro/relatorio` | Relatório financeiro |

---

## Executando o Projeto

### Pré-requisitos
- Java 21
- Maven

### Development
```bash
cd pos
./mvnw.cmd spring-boot:run
```

A aplicação estará disponível em: `http://localhost:8080`

### Swagger
Interface visual em: `http://localhost:8080/swagger-ui.html`

### Testes
```bash
./mvnw.cmd test
```

---

## Estrutura do Banco de Dados

### Tabelas
- **produtos**: Cadastro de produtos com preço de custo e venda
- **mesas**: Controle de mesas (ABERTA/PAGA)
- **itens_pedido**: Itens vinculados a uma mesa
- **faturamentos**: Histórico de vendas para relatórios