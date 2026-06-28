# SPECS.md

## Visão do Produto

**BrewControl** é uma aplicação web para registro e acompanhamento de dados fermentativos em cervejarias.
O sistema permite cadastrar cervejas, tanques e parâmetros aceitáveis, registrar apontamentos fermentativos e classificar automaticamente cada registro com base nos parâmetros definidos para cada cerveja.

---

## Contexto do Negócio

Durante o processo de fermentação, cervejarias acompanham periodicamente parâmetros como temperatura, pH e extrato. Esses registros são fundamentais para garantir a qualidade do produto, a padronização dos processos produtivos e o atendimento às exigências regulatórias do MAPA (Ministério da Agricultura e Pecuária).

---

## Funcionalidades do MVP

### 1. Cadastro de Cervejas
- Nome
- Estilo

### 2. Cadastro de Tanques
- Nome
- Capacidade em litros

### 3. Cadastro de Parâmetros Aceitáveis
- Vinculado a uma cerveja específica
- Temperatura mínima e máxima (°C)
- pH mínimo e máximo
- Extrato mínimo e máximo (°P)

### 4. Registro de Fermentação
- Data e hora do registro
- Cerveja
- Tanque
- Número do lote
- Temperatura (°C)
- pH
- Extrato (°P)
- Observações (opcional)
- Classificação automática (gerada pelo sistema)

### 5. Dashboard Inicial
- Total de registros fermentativos
- Registros dentro do padrão
- Registros que requerem atenção
- Registros fora do padrão

### 6. Histórico de Lotes
- Seleção de um lote
- Listagem cronológica de todos os apontamentos do lote
- Exibição de data, temperatura, pH, extrato e classificação por registro
- Gráfico de evolução do lote — temperatura, pH e extrato ao longo do tempo (incluído como melhoria além do MVP)

---

## Regras de Negócio

### Classificação Automática de Registros

Ao salvar um registro fermentativo, o sistema compara os valores informados com os parâmetros definidos para a cerveja correspondente e classifica automaticamente o registro:

| Classificação     | Critério                                                                 |
|-------------------|--------------------------------------------------------------------------|
| Dentro do Padrão  | Todos os três parâmetros (temperatura, pH e extrato) dentro dos limites  |
| Atenção           | Qualquer parâmetro fora dos limites, exceto temperatura                  |
| Fora do Padrão    | Temperatura fora dos limites definidos                                   |

**Justificativa:** A temperatura é o parâmetro mais crítico no processo fermentativo.
Desvios de temperatura podem comprometer irreversivelmente o lote, enquanto variações
de pH e extrato são mais toleráveis no curto prazo e passíveis de correção.

### Premissas Adotadas
- Um lote está sempre associado a uma cerveja e a um tanque
- O número do lote é informado manualmente pelo operador (não gerado automaticamente)
- Um mesmo lote pode ter múltiplos registros ao longo do tempo (acompanhamento evolutivo)
- Parâmetros aceitáveis são definidos por cerveja, não por lote ou tanque
- Observações são opcionais no registro fermentativo

---

## Fora do Escopo (MVP)

- Autenticação e controle de acesso
- Multi-tenancy
- Exportação de relatórios (PDF/Excel)
- Notificações automáticas
- Integração com sensores ou dispositivos IoT
- Deploy em produção

---

## Stack Técnica

| Camada     | Tecnologia                        |
|------------|-----------------------------------|
| Frontend   | React + TypeScript (Vite)         |
| Backend    | C# / .NET 9 — Web API             |
| Banco      | PostgreSQL                        |
| ORM        | Entity Framework Core             |
| API Style  | REST                              |

---

## Portas de Desenvolvimento

| Serviço  | Porta |
|----------|-------|
| Backend  | 5000  |
| Frontend | 5173  |

---

## Arquitetura

- Monolito modular
- Organização por camada: Controllers → Services → Repositories → Database
- Toda lógica de negócio na camada de serviço
- Controllers finos, sem lógica
- API REST sem versionamento (arquitetura preparada para suportar no futuro)

---

## Referências

- Desafio técnico proposto pela ArBrain (2026)
- Layout de referência: Figma fornecido pela ArBrain