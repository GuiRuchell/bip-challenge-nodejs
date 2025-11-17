Perfeito! Vou simplificar o README, removendo tudo sobre Swagger e mantendo apenas **Postman, Node.js, MongoDB, Docker e JWT**, refletindo exatamente o que você implementou.

---

# Desafio Técnico — Desenvolvedor Backend Node.js

## Visão Geral

API RESTful para gerenciamento de **clientes, contas e transações financeiras**, desenvolvida em **Node.js** com **Express** e **MongoDB**.

A aplicação segue boas práticas de **arquitetura modular, clean code, segurança e performance**, conforme o desafio técnico.

Principais recursos:

* Cadastro de clientes e contas
* Registro de transações (depósitos, transferências)
* Autenticação via **JWT**
* Testes automatizados
* Execução via **Docker** ou localmente
* Documentação via **Postman**

---

## Funcionalidades

* **Clientes**: Criar e gerenciar perfis
* **Contas**: Associar contas a clientes e gerenciar saldo
* **Transações**: Depositar, transferir e consultar histórico
* **Autenticação JWT**: Proteção de rotas sensíveis

---

## Tecnologias Utilizadas

* Node.js + Express
* MongoDB + Mongoose (Replica Set)
* JWT para autenticação
* Jest + Supertest para testes
* Docker + Docker Compose
* ESLint + Prettier para qualidade de código

---

## Pré-requisitos

* Docker e Docker Compose
* Node.js >= 18
* Git

---

## Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/GuiRuchell/bip-challenge-nodejs.git
cd bip-challenge-nodejs
```

### 2. Criar arquivo `.env`

Na raiz do projeto:

```env
PORT=3000
MONGO_URI=mongodb://mongo:27017/desafio?replicaSet=rs0
JWT_SECRET=supersecret
```

---

## Como Executar a Aplicação

### Com Docker (Recomendado)

1. Suba os containers:

```bash
docker-compose up -d
```

2. Inicialize o Replica Set do MongoDB:

```bash
docker exec -it desafio_backend_mongo mongosh
rs.initiate()
rs.status()
```

3. Instale dependências (dentro do container):

```bash
docker exec -it desafio_backend_app bash
npm install
```

4. Inicie a aplicação:

```bash
npm start   # produção
npm run dev # desenvolvimento com hot-reload
```

A aplicação estará disponível em: `http://localhost:3000`

---

### Sem Docker (Local)

* MongoDB rodando localmente ou remoto.
* Atualize `MONGO_URI` no `.env`.
* Execute:

```bash
npm install
npm run dev
```

---

## Testes

* Executar todos os testes:

```bash
npm test
```

* Cobertura de testes:

```bash
npm run test:coverage
```

---

## Documentação da API

* **Base URL:** `http://localhost:3000`
* **Postman:** importe `postman_collection.json` na raiz do projeto

Endpoints disponíveis:

* `POST /api/auth/register` — Registrar usuário
* `POST /api/auth/login` — Login
* `GET /api/users/me` — Consultar perfil do usuário autenticado
* `POST /api/accounts` — Criar conta
* `GET /api/accounts` — Listar contas
* `POST /api/transactions/deposit` — Depositar
* `POST /api/transactions/transfer` — Transferir
* `GET /api/transactions` — Listar transações

---

## Arquitetura e Boas Práticas

* **Estrutura modular**: controllers, services, models, routes, middlewares
* **Segurança**: validação, proteção contra injeções
* **Performance**: indexes no MongoDB, aggregations para relatórios
* **DevOps**: Dockerfile, docker-compose, pipeline CI/CD via GitHub Actions
* **Qualidade de código**: ESLint + Prettier

---

## Entrega

* Código-fonte completo
* README atualizado
* Instruções de execução e testes

---
