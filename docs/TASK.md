# TASK.md

## Fase Atual
Início do desenvolvimento — MVP

---

## Foco Atual
Entrega do desafio técnico ArBrain dentro do prazo (29/06 às 13h).
Prioridade: funcionalidades core funcionando antes de qualquer melhoria.

---

## Status do Sistema

- Banco de dados: PostgreSQL rodando via Docker; migration inicial aplicada (4 tabelas criadas)
- Backend: CRUD completo (Controller/Service/Repository/DTOs) de Cervejas, Tanques e Parâmetros Fermentativos funcionando e testado; CORS liberado para o frontend. Faltam Registros e Dashboard.
- Frontend: não iniciado
- Deploy: não iniciado
- Testes: não iniciado

---

## Invariantes Críticos

- Classificação automática SEMPRE calculada no Service, nunca no Controller ou Frontend
- Nenhuma entidade exposta diretamente pela API — sempre via DTOs
- Acesso ao banco SOMENTE via Repository
- CLAUDE.md deve ser consultado antes de qualquer decisão arquitetural

---

## Tarefas Ativas (FAZER AGORA)

### Setup
- [x] Criar docker-compose.yml com PostgreSQL
- [x] Scaffold do projeto backend (.NET 9 Web API)
- [x] Configurar Entity Framework Core + string de conexão
- [ ] Scaffold do projeto frontend (Vite + React + TypeScript)
- [x] Configurar CORS no backend para aceitar requisições do frontend

### Backend — Modelos e Banco
- [x] Criar entidades: Cerveja, Tanque, ParametrosFermentativos, RegistroFermentativo
- [x] Criar enum ClassificacaoRegistro
- [x] Configurar DbContext com todas as entidades
- [x] Criar e aplicar migration inicial

### Backend — Funcionalidades
- [x] CervejasController + CervejasService + CervejasRepository (CRUD)
- [x] TanquesController + TanquesService + TanquesRepository (CRUD)
- [x] ParametrosController + ParametrosService + ParametrosRepository (CRUD vinculado à cerveja)
- [ ] RegistrosController + RegistrosService + RegistrosRepository
- [ ] Implementar lógica de classificação automática no RegistrosService
- [ ] DashboardController + DashboardService (indicadores agregados)
- [ ] Endpoint de histórico por lote

### Frontend — Estrutura
- [ ] Configurar roteamento (React Router)
- [ ] Criar serviços de API (axios ou fetch) para cada entidade
- [ ] Criar tipos TypeScript alinhados com os DTOs do backend

### Frontend — Páginas
- [ ] Dashboard (indicadores + acesso rápido)
- [ ] Cadastro de Cervejas (listagem + formulário)
- [ ] Cadastro de Tanques (listagem + formulário)
- [ ] Cadastro de Parâmetros (vinculado à cerveja)
- [ ] Registro de Fermentação (formulário)
- [ ] Histórico de Lotes (seleção + listagem cronológica)

### Finalização
- [ ] Testar todos os fluxos manualmente
- [ ] Escrever README com instruções de execução
- [ ] Finalizar respostas às 4 perguntas do desafio
- [ ] Fazer commit final e enviar link por e-mail

---

## Fila (PRÓXIMO)

- Deploy em nuvem com domínio próprio (após core completo)

---

## Concluído Recentemente

- CORS configurado no Program.cs liberando http://localhost:5173 (frontend Vite)
- CRUD completo de Cervejas, Tanques e Parâmetros Fermentativos (Controller fino + Service com regra/mapa + Repository EF Core + DTOs request/response)
- Parâmetros aninhados em /api/cervejas/{id}/parametros, relação 1:1 (POST cria, PUT atualiza; sem DELETE conforme CLAUDE.md)
- DI com classes concretas (sem interfaces — padrão não previsto no CLAUDE.md; mantida simplicidade)
- Validação de entrada via DataAnnotations + [ApiController] (400 automático)
- Todos os endpoints testados manualmente via curl (200/201/204/400/404/409 conforme esperado); dados de teste removidos do banco
- Setup do backend: docker-compose (PostgreSQL 16), scaffold .NET 9 Web API (template controllers, boilerplate WeatherForecast removido)
- EF Core + Npgsql instalados e fixados (Npgsql 9.0.4, EF Design 9.0.17); ferramenta dotnet-ef instalada
- appsettings.Development.json com string de conexão (gitignore corrigido para o caminho real do projeto)
- Entidades, enum ClassificacaoRegistro e AppDbContext criados; DbContext registrado no Program.cs
- Migration inicial (InicialCreate) criada e aplicada — banco com as 4 tabelas
- Estrutura de diretórios criada
- SPECS.md preenchido
- CLAUDE.md preenchido
- TASK.md preenchido
- AI_CONTEXT.md preenchido

---

## Riscos Conhecidos

- C# / .NET é o ponto mais fraco do stack — priorizar scaffold e configuração do EF Core cedo
- Configuração do PostgreSQL com Docker pode gerar atrito — resolver antes de qualquer código de negócio

---

## Dívida Técnica Intencional

- Sem autenticação (decisão de escopo, documentada no SPECS.md)
- Sem testes automatizados no MVP (documentado nas respostas do desafio)
- Sem versionamento de API (arquitetura preparada para suportar no futuro)

---

## Prazo

**29/06/2026 às 13h00**