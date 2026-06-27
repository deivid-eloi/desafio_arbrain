# TASK.md

## Fase Atual
Core completo — finalização e entrega

---

## Foco Atual
Entrega do desafio técnico ArBrain dentro do prazo (29/06 às 13h).
Core 100% funcional. Restam apenas deploy e respostas do desafio.

---

## Status do Sistema

- Banco de dados: PostgreSQL 16 via Docker, migrations aplicadas automaticamente na inicialização
- Backend: **completo** — todos os endpoints do CLAUDE.md implementados e testados. Classificação automática funcionando no RegistrosService.
- Frontend: **completo** — 6 páginas (Dashboard, Cervejas, Tanques, Parâmetros, Registros, Histórico). Design system ArBrain aplicado.
- Docker: **completo** — `docker compose up --build` sobe os 3 serviços (postgres + backend + frontend). Healthcheck no postgres, auto-migration, nginx com proxy reverso.
- README: **completo** — instruções Docker e local, stack, endpoints, variáveis de ambiente.
- Testes automatizados: não incluso (dívida técnica intencional, documentada no SPECS.md)

---

## Invariantes Críticos

- Classificação automática SEMPRE calculada no Service, nunca no Controller ou Frontend
- Nenhuma entidade exposta diretamente pela API — sempre via DTOs
- Acesso ao banco SOMENTE via Repository
- CLAUDE.md deve ser consultado antes de qualquer decisão arquitetural

---

## Tarefas Concluídas

### Setup
- [x] Criar docker-compose.yml com PostgreSQL
- [x] Scaffold do projeto backend (.NET 9 Web API)
- [x] Configurar Entity Framework Core + string de conexão
- [x] Scaffold do projeto frontend (Vite + React + TypeScript)
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
- [x] RegistrosController + RegistrosService + RegistrosRepository
- [x] Implementar lógica de classificação automática no RegistrosService
- [x] DashboardController + DashboardService (indicadores agregados)
- [x] Endpoint de histórico por lote

### Frontend — Estrutura
- [x] Configurar roteamento (React Router)
- [x] Criar serviços de API (axios ou fetch) para cada entidade
- [x] Criar tipos TypeScript alinhados com os DTOs do backend

### Frontend — Páginas
- [x] Dashboard (indicadores + acesso rápido)
- [x] Cadastro de Cervejas (listagem + formulário)
- [x] Cadastro de Tanques (listagem + formulário)
- [x] Cadastro de Parâmetros (vinculado à cerveja)
- [x] Registro de Fermentação (formulário)
- [x] Histórico de Lotes (seleção + listagem cronológica)

### Finalização
- [x] Docker completo (postgres + backend + frontend)
- [x] Escrever README com instruções de execução
- [x] Testar todos os fluxos manualmente (clean-slate Docker: down -v → up --build → full CRUD → classificação 3/3 → dashboard → histórico ✓)
- [ ] Finalizar respostas às 4 perguntas do desafio
- [ ] Fazer commit final e enviar link por e-mail

---

## Fila (PRÓXIMO)

- Deploy em nuvem com domínio próprio (após entrega do core)
- Finalizar respostas às 4 perguntas do desafio

---

## Riscos Conhecidos

- Nenhum risco bloqueante. Core 100% funcional e testado via Docker.

---

## Dívida Técnica Intencional

- Sem autenticação (decisão de escopo, documentada no SPECS.md)
- Sem testes automatizados no MVP (documentado nas respostas do desafio)
- Sem versionamento de API (arquitetura preparada para suportar no futuro)

---

## Prazo

**29/06/2026 às 13h00**
