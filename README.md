# BrewControl

Sistema de controle de fermentação cervejeira. Permite cadastrar cervejas, tanques, parâmetros fermentativos e registrar leituras com **classificação automática** (Dentro do Padrão, Atenção, Fora do Padrão).

## Stack

| Camada   | Tecnologia                        |
|----------|-----------------------------------|
| Frontend | React 19 + TypeScript (Vite) + Tailwind CSS v4 + shadcn/ui |
| Backend  | C# / .NET 9 — Web API             |
| Banco    | PostgreSQL 16                     |
| ORM      | Entity Framework Core 9           |
| Infra    | Docker + Docker Compose           |

## Executar com Docker (recomendado)

Pré-requisitos: [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/).

```bash
git clone <url-do-repositorio>
cd desafio_arbrain
docker compose up --build
```

Acesse:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:5000/api

O banco de dados é criado automaticamente (migrations aplicadas na inicialização).

Para parar:

```bash
docker compose down
```

Para remover os dados do banco:

```bash
docker compose down -v
```

## Executar localmente (desenvolvimento)

Pré-requisitos: [.NET 9 SDK](https://dotnet.microsoft.com/download), [Node.js 22+](https://nodejs.org/), [Docker](https://docs.docker.com/get-docker/) (para o PostgreSQL).

### 1. Banco de dados

```bash
docker compose up postgres -d
```

### 2. Backend

```bash
cd backend/BrewControl.Api
```

Crie o arquivo `appsettings.Development.json` (não versionado):

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=brewcontrol;Username=brewuser;Password=brewpass"
  }
}
```

```bash
dotnet run
```

A API estará disponível em http://localhost:5000.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em http://localhost:5173.

## Variáveis de ambiente

| Variável | Descrição | Padrão (Docker) |
|----------|-----------|-----------------|
| `ConnectionStrings__DefaultConnection` | String de conexão PostgreSQL | `Host=postgres;Port=5432;Database=brewcontrol;Username=brewuser;Password=brewpass` |
| `ASPNETCORE_URLS` | URL de escuta do backend | `http://+:5000` |
| `VITE_API_URL` | Base URL da API no frontend | `/api` (Docker) / `http://localhost:5000/api` (dev) |

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/cervejas` | Listar cervejas |
| POST | `/api/cervejas` | Criar cerveja |
| GET | `/api/cervejas/{id}` | Obter cerveja |
| PUT | `/api/cervejas/{id}` | Atualizar cerveja |
| DELETE | `/api/cervejas/{id}` | Remover cerveja |
| GET | `/api/tanques` | Listar tanques |
| POST | `/api/tanques` | Criar tanque |
| GET | `/api/tanques/{id}` | Obter tanque |
| PUT | `/api/tanques/{id}` | Atualizar tanque |
| DELETE | `/api/tanques/{id}` | Remover tanque |
| GET | `/api/cervejas/{id}/parametros` | Obter parâmetros |
| POST | `/api/cervejas/{id}/parametros` | Criar parâmetros |
| PUT | `/api/cervejas/{id}/parametros` | Atualizar parâmetros |
| GET | `/api/registros` | Listar registros |
| POST | `/api/registros` | Criar registro (classificação automática) |
| GET | `/api/registros/{id}` | Obter registro |
| GET | `/api/registros/lote/{numeroDeLote}` | Histórico do lote |
| GET | `/api/dashboard` | Indicadores agregados |

## Regra de negócio central

A **classificação** de cada registro fermentativo é calculada automaticamente no backend (Service Layer) ao salvar, comparando os valores medidos com os parâmetros da cerveja:

- **Fora do Padrão** — temperatura fora da faixa (desvio crítico e irreversível)
- **Atenção** — pH ou extrato fora da faixa, com temperatura normal
- **Dentro do Padrão** — todos os valores dentro das faixas
