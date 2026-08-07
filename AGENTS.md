# E-commerce Monorepo

## Objetivo

Projeto Next.js em manutenção de código legado. Prioridade: estabilizar comportamento atual antes de refatorar. Migrar backend por módulos, nunca reescrever tudo de uma vez.

## Stack e regras

- Next.js App Router.
- Server Components por padrão.
- Server Actions ou Route Handlers (no ecommerce) para mutações.
- Sem React Context. Use props, `useState`, URL search params, cookies e estado no servidor.
- Prisma é a ORM escolhida.
- Não instalar dependências, rodar scripts, rodar migrations, apagar dados ou alterar banco sem pedido explícito.

## Monorepo

```txt
apps/
  ecommerce/       # loja
  dashboard/       # administração
packages/
  core/            # regras de negócio e use cases e services (repositories)
  prisma/          # schema, migrations e cliente Prisma
  db/              # implementações de repositories com Prisma
  ui/              # shadcn e componentes React compartilhados
  lib/             # integrações externas
  utils/           # funções puras reutilizáveis
```

## Backend

Organize cada domínio em `packages/core/src/modules`:

```txt
modules/products/
  domain/          # entidades, tipos e regras puras
  use-cases/       # ações: listar, criar, atualizar
```

- Use case coordena regra de negócio.
- Repository lê e grava dados.
- Repository não contém regra de negócio.
- Implementação Prisma fica em `packages/db`.
- `packages/prisma` contém somente schema, migrations e cliente Prisma.
- Não criar camadas `service` que apenas encaminham chamadas ao repository.

## Prisma

1. `packages/prisma/schema.prisma` é contrato do banco.
2. Criar migrations somente após validar mudança localmente.
3. Aplicar migrations apenas com pedido explícito.
4. Migrar um módulo vertical por vez: repository, use case, rota, tela.
5. Não trocar Prisma por outro ORM sem pedido explícito.

## Frontend

- Dados servidor: carregar no Server Component.
- Dados interativos: Route Handler ou Server Action.
- Estado local: `useState`.
- Filtros e paginação: URL search params.
- Componentes genéricos: `packages/ui`.
- Componentes de domínio: app ou módulo dono da feature.

## Qualidade

- Não mover ou reformatar arquivos fora da tarefa.
- Antes de alterar legado, identificar rota, dados de entrada, saída e efeitos no banco.
- Preferir mudanças pequenas, testáveis e reversíveis.
- Explicar erros com causa e correção.
