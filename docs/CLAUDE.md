# CLAUDE.md

## Visão Geral

**BrewControl** — Sistema de controle de fermentação cervejeira.
Este arquivo é o entrypoint e a fonte de verdade arquitetural do projeto.
Leia este arquivo antes de qualquer ação.

---

## Stack

| Camada     | Tecnologia                        |
|------------|-----------------------------------|
| Frontend   | React + TypeScript (Vite) + Tailwind CSS v4 + shadcn/ui |
| Backend    | C# / .NET 9 — Web API             |
| Banco      | PostgreSQL (Docker em dev)        |
| ORM        | Entity Framework Core             |

---

## Estrutura de Diretórios

```
desafio_arbrain/
├── backend/
│   └── BrewControl.Api/
│       ├── Controllers/        # Endpoints HTTP — sem lógica de negócio
│       ├── Services/           # Toda lógica de negócio vive aqui
│       ├── Repositories/       # Acesso ao banco via EF Core
│       ├── Models/             # Entidades do banco de dados
│       ├── DTOs/               # Objetos de entrada e saída da API
│       ├── Enums/              # Enumeradores (ex: ClassificacaoRegistro)
│       └── Data/               # DbContext e configurações do EF Core
├── frontend/
│   └── src/
│       ├── components/         # Componentes reutilizáveis (domínio)
│       │   └── ui/             # Componentes base do shadcn/ui
│       ├── pages/              # Páginas da aplicação
│       ├── services/           # Chamadas à API (fetch/axios)
│       ├── types/              # Tipos e interfaces TypeScript
│       ├── lib/                # Utilitários compartilhados (ex: cn)
│       └── utils/              # Funções utilitárias
└── docs/
    ├── CLAUDE.md               # Este arquivo — fonte de verdade
    ├── SPECS.md                # Escopo e decisões do produto
    ├── TASK.md                 # Estado atual e tarefas
    └── AI_CONTEXT.md           # Regras de comportamento da IA
```

---

## Entidades do Banco de Dados

### Cerveja
```
Id          (int, PK)
Nome        (string, obrigatório)
Estilo      (string, obrigatório)
```

### Tanque
```
Id            (int, PK)
Nome          (string, obrigatório)
Capacidade    (decimal, obrigatório) — em litros
```

### ParametrosFermentativos
```
Id                  (int, PK)
CervejaId           (int, FK → Cerveja)
TemperaturaMinima   (decimal, obrigatório) — °C
TemperaturaMaxima   (decimal, obrigatório) — °C
PhMinimo            (decimal, obrigatório)
PhMaximo            (decimal, obrigatório)
ExtratoPMinimo      (decimal, obrigatório) — °P
ExtratoPMaximo      (decimal, obrigatório) — °P
```

### RegistroFermentativo
```
Id              (int, PK)
DataHora        (DateTime, obrigatório)
CervejaId       (int, FK → Cerveja)
TanqueId        (int, FK → Tanque)
NumeroDeLote    (string, obrigatório)
Temperatura     (decimal, obrigatório) — °C
Ph              (decimal, obrigatório)
Extrato         (decimal, obrigatório) — °P
Observacoes     (string, opcional)
Classificacao   (enum: DentroDopadrao | Atencao | ForaDoPadrao)
```

---

## Regra de Negócio Central — Classificação Automática

A classificação é calculada na camada de serviço no momento do salvamento.
**Nunca no controller. Nunca no frontend.**

```
SE temperatura fora do intervalo definido para a cerveja
    → Classificação = ForaDoPadrao

SENÃO SE qualquer outro parâmetro (pH ou extrato) fora do intervalo
    → Classificação = Atencao

SENÃO
    → Classificação = DentroDopadrao
```

**Justificativa:** Temperatura é o parâmetro mais crítico — desvios podem
comprometer irreversivelmente o lote. Variações de pH e extrato são recuperáveis.

---

## Arquitetura — Fluxo de Dados

```
Frontend (React) → API REST (.NET) → Service Layer → Repository → PostgreSQL
```

### Regras de Camada

**Controllers**
- Recebem requisições HTTP
- Validam entrada básica (model binding)
- Delegam para o Service correspondente
- Retornam o resultado
- **Proibido:** lógica de negócio, acesso direto ao banco

**Services**
- Contêm toda a lógica de negócio
- Executam a classificação automática
- Orquestram chamadas aos Repositories
- **Proibido:** acesso direto ao DbContext

**Repositories**
- Único ponto de acesso ao banco de dados
- Operações CRUD via Entity Framework Core
- **Proibido:** lógica de negócio

**DTOs**
- Toda entrada e saída da API usa DTOs — nunca entidades diretamente
- Request DTOs: dados recebidos do frontend
- Response DTOs: dados enviados ao frontend

---

## Endpoints da API

### Cervejas
```
GET     /api/cervejas
POST    /api/cervejas
GET     /api/cervejas/{id}
PUT     /api/cervejas/{id}
DELETE  /api/cervejas/{id}
```

### Tanques
```
GET     /api/tanques
POST    /api/tanques
GET     /api/tanques/{id}
PUT     /api/tanques/{id}
DELETE  /api/tanques/{id}
```

### Parâmetros Fermentativos
```
GET     /api/cervejas/{id}/parametros
POST    /api/cervejas/{id}/parametros
PUT     /api/cervejas/{id}/parametros
```

### Registros Fermentativos
```
GET     /api/registros
POST    /api/registros
GET     /api/registros/{id}
GET     /api/registros/lote/{numeroDeLote}
```

### Dashboard
```
GET     /api/dashboard
```

---

## Padrões de Código

### Backend (C#)
- Nomenclatura em português para domínio (entidades, propriedades, métodos de negócio)
- Nomenclatura em inglês para infraestrutura (Program.cs, DbContext, configurações)
- Comentários explicativos em português em toda lógica não trivial
- Injeção de dependência via construtor
- Retornos tipados com DTOs

### Frontend (TypeScript)
- Componentes funcionais com hooks
- Tipos explícitos — sem `any`
- Chamadas à API centralizadas em `/services`
- Nomenclatura em português para labels e textos de UI
- Componentes base via **shadcn/ui** (em `components/ui`); estilização com **Tailwind CSS v4** (classes utilitárias), evitando estilos inline
- Alias de importação `@/*` → `src/*`

---

## Design System (ArBrain)

### Fonte
- Montserrat (import via Google Fonts)

### Cores
- --color-bg: #1D1D2D (fundo escuro)
- --color-primary: #063852 (azul escuro)
- --color-secondary: #ACBBCD (azul cinza)
- --color-gray: #A4A4A4 (cinza)
- --color-gray-light: #E8E8E8 (cinza claro)
- --color-yellow: #FFC524 (destaque / Atenção)
- --color-green: #9CDA97 (Dentro do Padrão)
- --color-red: #FA9897 (Fora do Padrão)

### Classificação — cores por status
- DentroDopadrao → --color-green (#9CDA97)
- Atencao → --color-yellow (#FFC524)
- ForaDoPadrao → --color-red (#FA9897)

### Fundação de Componentes (shadcn/ui)
- **shadcn/ui é a fundação de componentes, não a identidade visual.** A paleta
  ArBrain permanece DOMINANTE.
- As variáveis `--color-*` da paleta ArBrain vivem em `index.css` e são a fonte
  de verdade das cores.
- Os tokens semânticos do shadcn (`--background`, `--card`, `--primary`, etc.)
  são remapeados para a paleta ArBrain (tema escuro) em `index.css`, de modo que
  todos os componentes herdem a marca.
- Obs.: `--primary`, `--secondary` e `--border` usam valores literais porque seus
  nomes de token no Tailwind v4 (`--color-primary/secondary/border`) colidem com
  a paleta ArBrain — literais evitam referência circular.
- As classificações usam variantes próprias do `Badge` (`dentroDopadrao`,
  `atencao`, `foraDoPadrao`) com as cores de status acima.

---

## Configuração Docker

### Estratégia
O projeto terá dois modos de execução documentados no README:
- **Docker completo:** um único `docker-compose up` sobe banco + backend + frontend
- **Execução local:** cada serviço rodado manualmente (para desenvolvimento e debug)

### docker-compose.yml (estrutura final esperada)
```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: brewcontrol
      POSTGRES_USER: brewuser
      POSTGRES_PASSWORD: brewpass
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - ASPNETCORE_URLS=http://+:5000
      - ConnectionStrings__DefaultConnection=Host=postgres;Port=5432;Database=brewcontrol;Username=brewuser;Password=brewpass
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "5173:80"
    depends_on:
      - backend
```

### Quando implementar
Docker completo (backend + frontend) deve ser feito APÓS o core estar funcionando localmente.
Não bloqueia o desenvolvimento — implementar na fase de finalização.

### String de conexão — desenvolvimento local
```
Host=localhost;Port=5432;Database=brewcontrol;Username=brewuser;Password=brewpass
```
Definida em `backend/BrewControl.Api/appsettings.Development.json` (não commitar — está no .gitignore).

---

## Quando Atualizar Este Arquivo

Atualizar SOMENTE quando:
- Uma nova decisão arquitetural for tomada
- Um padrão for introduzido ou alterado
- Uma nova entidade ou módulo for adicionado

**Proibido:**
- Reescrever este arquivo integralmente
- Alterar decisões existentes sem justificativa explícita
- Adicionar detalhes de implementação ou tarefas