# TASK.md

## Fase Atual
Início do desenvolvimento — MVP

---

## Foco Atual
Entrega do desafio técnico ArBrain dentro do prazo (29/06 às 13h).
Prioridade: funcionalidades core funcionando antes de qualquer melhoria.

---

## Status do Sistema

- Banco de dados: não iniciado
- Backend: não iniciado
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
- [ ] Criar docker-compose.yml com PostgreSQL
- [ ] Scaffold do projeto backend (.NET 9 Web API)
- [ ] Configurar Entity Framework Core + string de conexão
- [ ] Scaffold do projeto frontend (Vite + React + TypeScript)
- [ ] Configurar CORS no backend para aceitar requisições do frontend

### Backend — Modelos e Banco
- [ ] Criar entidades: Cerveja, Tanque, ParametrosFermentativos, RegistroFermentativo
- [ ] Criar enum ClassificacaoRegistro
- [ ] Configurar DbContext com todas as entidades
- [ ] Criar e aplicar migration inicial

### Backend — Funcionalidades
- [ ] CervejasController + CervejasService + CervejasRepository (CRUD)
- [ ] TanquesController + TanquesService + TanquesRepository (CRUD)
- [ ] ParametrosController + ParametrosService + ParametrosRepository (CRUD vinculado à cerveja)
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