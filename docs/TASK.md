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
- Backend: **completo** — todos os endpoints do CLAUDE.md implementados e testados. Classificação automática funcionando no RegistrosService (lógica pura extraída para `ClassificacaoHelper`, fonte única de verdade).
- Frontend: **completo** — 6 páginas (Dashboard, Cervejas, Tanques, Parâmetros, Registros, Histórico). Componentes migrados para **shadcn/ui** sobre **Tailwind CSS v4**, mantendo a paleta ArBrain dominante (tokens do shadcn remapeados em index.css). Ícones SVG na navegação e nas ações de tabela. Dark theme, animações, loading states, confirmação inline de exclusão. Gráfico de evolução do lote (Temperatura, pH e Extrato ao longo do tempo) na página de Histórico via **Recharts**, com faixas de referência dos parâmetros da cerveja.
- Docker: **completo** — `docker compose up --build` sobe os 3 serviços (postgres + backend + frontend). Healthcheck no postgres, auto-migration, nginx com proxy reverso.
- README: **completo** — instruções Docker e local, stack, endpoints, variáveis de ambiente.
- Testes automatizados: **regra de negócio central coberta** — projeto xUnit `backend/BrewControl.Tests` com 5 testes de unidade da classificação automática (`ClassificacaoHelper`), isolados (sem banco/HTTP). Demais camadas seguem sem testes (dívida técnica intencional, documentada no SPECS.md)

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
- [x] Auditoria completa do codebase — backend e frontend
- [x] Melhorias visuais e UX — dark theme, animações, loading states, confirmação inline, empty states
- [x] Melhorias de layout e densidade — subtítulos, contadores, seções extras no dashboard, resumos contextuais
- [x] Seed data — 3 cervejas, 3 tanques, parâmetros e 12 registros em 3 lotes (IPA-2026-001 ×5, PIL-2026-003 ×3, WEI-2026-004 ×4) com curvas fermentativas realistas (temperatura sobe e recua, extrato decrescente, pH estável) e horários variados ao longo do dia; classificação SEMPRE via `RegistrosService.Classificar` (nunca hardcoded); seed idempotente (`!db.Cervejas.Any()`). Distribuição resultante: 7 dentro · 3 atenção · 2 fora
- [x] Refatoração do frontend para shadcn/ui sobre Tailwind CSS v4 — Button, Card, Table, Badge (variantes de classificação), Input, Select, Textarea, Separator; paleta ArBrain mapeada nos tokens semânticos; `tsc -b` sem erros; build Docker do frontend rebuildado e validado (serve em :5173, proxy /api operante)
- [x] Ícones SVG (de `src/assets/icons/`) — navegação na sidebar (opacidade 0.85 → 1 em ativo/hover) e botões Editar/Remover (16×16); importados como asset URLs do Vite (`import ... from '@/assets/icons/*.svg'`); `tsc -b` limpo; Docker do frontend rebuildado
- [x] Gráfico "Evolução do Lote" na página de Histórico (Recharts) — `LineChart`/`ResponsiveContainer` (largura total, 300px), três linhas (Temperatura `#FA9897`, pH `#FFC524`, Extrato `#9CDA97`) com eixo Y auto-escalado por métrica, eixo X `dd/MM HH:mm`, `Legend` + `Tooltip`, e `ReferenceLine` de mín/máx a partir de `GET /api/cervejas/{id}/parametros`; renderizado apenas quando há resultados, sem nova chamada para os dados do gráfico; `tsc -b` limpo; Docker do frontend rebuildado
- [x] Testes de unidade da classificação automática — projeto xUnit `backend/BrewControl.Tests` (net9.0) com 5 testes cobrindo todos os cenários (dentro, pH/extrato fora → atenção, temperatura fora → fora, prioridade da temperatura); lógica pura extraída para `ClassificacaoHelper` (fonte única, sem dependência de banco/HTTP) e `RegistrosService.Classificar` passa a delegar; `dotnet test` verde (5/5)
- [x] Revisão pré-deploy — auditoria de README/docs/código/git/Docker. Sem `console.log`, sem `TODO`/`FIXME`, sem placeholders; `tsc -b --noEmit` limpo; cores "hardcoded" são literais justificados e documentados (`#acbbcd` para Total — `--color-secondary` é sombreado por `@theme inline`; cores do gráfico Recharts; texto sobre amarelo). Correções aplicadas: SPECS (gráfico de evolução movido de "Fora do Escopo" para entregue), README Stack (Tailwind v4 + shadcn/ui), `docker-compose.yml` (`restart: unless-stopped` nos 3 serviços)
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

## Correções da Auditoria

- **FK delete crash → 409 Conflict** — exclusão de Cerveja/Tanque com registros vinculados agora retorna 409 com ProblemDetails (antes: 500 com stack trace)
- **Global exception handler** — exceções não tratadas retornam JSON padronizado, sem vazar stack traces
- **Respostas de erro padronizadas** — todos os endpoints usam ProblemDetails (400, 404, 409, 422, 500)
- **Frontend: erros silenciosos** — RegistrosPage agora exibe mensagem quando API está inacessível (antes: `.catch(() => {})`)
- **Frontend: extração de erro** — compatível com ProblemDetails (extrai campo `detail`)
- **Removido UseHttpsRedirection** — middleware era no-op (app só escuta HTTP)

---

## Dívida Técnica Intencional

- Sem autenticação (decisão de escopo, documentada no SPECS.md)
- Cobertura de testes focada na regra de negócio central (classificação automática, 5 testes xUnit); demais camadas sem testes no MVP (documentado nas respostas do desafio)
- Sem versionamento de API (arquitetura preparada para suportar no futuro)

---

## Prazo

**29/06/2026 às 13h00**
