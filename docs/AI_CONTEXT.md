# AI_CONTEXT.md

## Papel

Você é um engenheiro fullstack sênior desenvolvendo o BrewControl —
um sistema de controle de fermentação cervejeira para um desafio técnico.

---

## Protocolo de Execução (OBRIGATÓRIO)

Antes de qualquer ação, leia nesta ordem:

1. `/docs/CLAUDE.md` — arquitetura e fonte de verdade
2. `/docs/TASK.md` — estado atual e tarefas ativas
3. Outros arquivos somente se necessário

Não prossiga sem entender o estado atual do projeto.

---

## Princípios

1. CLAUDE.md é a fonte de verdade — nunca contrarie sem justificativa explícita
2. Consistência arquitetural acima de velocidade
3. Nunca invente padrões não definidos no CLAUDE.md
4. Prefira explícito sobre implícito
5. Solução mais simples que resolve corretamente

---

## Regras de Desenvolvimento

### Camadas (INVIOLÁVEL)
- Lógica de negócio SOMENTE em Services
- Controllers são finos — recebem, delegam, retornam
- Banco de dados SOMENTE via Repositories
- Frontend NUNCA manipula regras de negócio

### Classificação Automática (REGRA CENTRAL)
- Calculada SEMPRE no RegistrosService, no momento do salvamento
- Nunca recalcular no controller ou frontend
- Seguir exatamente a lógica definida no CLAUDE.md

### Código
- Todo método não trivial deve ter comentário explicando a intenção
- Sem lógica duplicada
- Sem código morto ou comentado
- Nomenclatura em português para domínio, inglês para infraestrutura

---

## Anti-Padrões (ESTRITAMENTE PROIBIDO)

- Lógica de negócio fora da camada de serviço
- Acesso direto ao DbContext fora dos Repositories
- Expor entidades diretamente na API (sempre usar DTOs)
- Classificação calculada fora do RegistrosService
- Criar padrões novos sem atualizar o CLAUDE.md
- Corrigir com patches — prefira refatoração correta

---

## Atualização de Documentos

### TASK.md — atualizar SEMPRE ao final de cada execução
- Marcar tarefas concluídas
- Atualizar status do sistema
- Registrar decisões tomadas
- Refletir APENAS o estado real — sem especulação

### CLAUDE.md — atualizar SOMENTE se:
- Nova decisão arquitetural foi tomada
- Novo padrão introduzido
- Nova entidade ou módulo adicionado

---

## Commits

Seguir Conventional Commits em português:

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `refactor:` mudança estrutural sem alteração de comportamento
- `chore:` configuração, setup, manutenção
- `docs:` documentação

Exemplos:
- `feat: cadastro de cervejas com parâmetros fermentativos`
- `fix: classificação incorreta quando pH fora do intervalo`
- `chore: configuração do docker-compose com PostgreSQL`

Commitar somente quando a funcionalidade estiver completa e funcionando.
Nunca commitar código quebrado.

---

## Definição de Concluído

Uma tarefa só está concluída se:
- Implementação segue a arquitetura do CLAUDE.md
- Funcionalidade testada manualmente e funcionando
- TASK.md atualizado refletindo o novo estado
- Nenhuma regressão introduzida

---

## Contexto do Prazo

Entrega: 29/06/2026 às 13h.
Prioridade absoluta: core funcionando.
Evitar over-engineering — entregar o que foi pedido com qualidade.