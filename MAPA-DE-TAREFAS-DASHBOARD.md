**Mapa de tarefas — Dashboard administrativo**

Atualizado em 04/10/2026. Escopo: planejamento de apps/dashboard e dos contratos compartilhados necessários. Levantamento estático; nenhum módulo implementado, script executado ou banco acessado nesta tarefa.

O painel possui esqueleto de navegação, tabelas, formulários e gráficos. Seu backend continua em MySQL, com contratos diferentes do PostgreSQL/Prisma da loja. As telas existentes precisam ser migradas e validadas por módulo; presença de uma tela não significa feature concluída.

P0 = acesso, segurança e bloqueadores; P1 = operação administrativa básica; P2 = segunda entrega ou melhoria. Itens marcados como opcionais exigem necessidade do produto, mesmo que já exista modelo no banco.

**Estado dos módulos**

| Módulo | Situação encontrada | Trabalho necessário |
| --- | --- | --- |
| Acesso administrativo | JWT local/localStorage; APIs sem guarda | Sessão servidor e autorização administrativa |
| Categorias | CRUD legado e campos incompatíveis | Migrar contrato e hierarquia |
| Produtos/estoque | CRUD legado, IDs numéricos e preço em contrato antigo | Gestão do Product atual e atualização segura de estoque |
| Marcas | Modelo Prisma; tela/CRUD não encontrados | Gestão conforme necessidade do catálogo |
| Promoções | Tratadas como segunda categoria no legado | Gestão de Promotion/PromotionProduct |
| Atributos e computadores | Modelos Prisma; gestão não encontrada | Segunda entrega, caso catálogo utilize esses recursos |
| Pedidos | Lista/status numéricos e API insegura | Consultar pedidos reais e definir ações permitidas |
| Usuários | CRUD direto de senha/dados pessoais | Separar clientes, contas e permissões |
| Conteúdo | Seções em tabelas antigas; home da loja usa banner fixo e destaques | Escopo simples de destaques; CMS somente se necessário |
| Métricas | Queries/views antigas e percentuais fixos | Indicadores calculados no contrato atual |
| Configurações | Link # | Definir escopo ou retirar item provisório |

Base: [schema Prisma](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma>), [tipos legados](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/lib/types.ts>), [menu](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/data/links.ts>) e [backend atual](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/lib/db.js:1>).

**1. Base técnica e acesso administrativo — D01 a D07**

- [ ] **D01 · P0 · Corrigir imports e dependências diretas.** Resolver formatCurrency ausente; usar util de centavos apropriado. Inventariar dependências realmente utilizadas, inclusive React DOM e workspaces db/auth/utils. Evitar instalar bibliotecas do backend legado que serão removidas.
  Conclusão: imports e manifests coerentes; typecheck/build somente após autorização. Evidência: [manifest](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/package.json>), [import quebrado](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/components/table/data-table.tsx:12>) e [util existente](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/utils/money.ts>).

- [ ] **D02 · P0 · Alinhar versões e patches de segurança.** Tratar Next/React/React DOM/ESLint em conjunto, conforme T01 do mapa geral. Consultar avisos vigentes no momento da execução; atualização de major somente se necessária ou escolhida.
  Conclusão: versões compatíveis e corrigidas, com validação autorizada. Evidência: [T01 do mapa geral](<E:/React Projects/Projetos ReactJS/Ecommerce/MAPA-DE-TAREFAS.md:13>).

- [ ] **D03 · P0 · Definir permissão administrativa mínima.** User atual não possui role; cargo pertence ao contrato antigo. Escolher onde persistir permissão de administrador e como provisionar primeiro administrador por procedimento restrito. Cadastro público nunca pode conceder permissão.
  Conclusão: usuário comum negado no painel; concessão/revogação protegidas; eventual mudança de schema/migration documentada e autorizada. Começar com permissão simples, sem sistema granular de permissões. Evidência: [User](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:10>).

- [ ] **D04 · P0 · Migrar login, sessão e logout para servidor.** Integrar Better Auth conforme URLs/cookies dos apps; conferir comportamento nos hosts de desenvolvimento e ambiente publicado. Eliminar JWT próprio, fallback de segredo e token em localStorage. Separar login administrativo de cadastro de cliente.
  Conclusão: sessão verificada no servidor; usuário sem permissão não entra; logout encerra acesso; login não depende de token fictício de cadastro. Evidência: [login](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/login/login-form.tsx>), [JWT legado](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/api/auth/login/route.js>) e [auth compartilhada](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/auth/lib/auth.ts>).

- [ ] **D05 · P0 · Proteger todas as APIs e restringir payloads.** Aplicar sessão + permissão em cada leitura/mutação administrativa. Remover SELECT *, campos arbitrários e logs de dados pessoais. Validar campos explicitamente e devolver DTO seguro; avaliar proteção contra abuso nas operações sensíveis sem duplicar proteção já existente.
  Conclusão: chamadas diretas sem permissão recebem negação; hashes, tokens e dados desnecessários não retornam; edição não permite elevar privilégios. Evidência: [API usuários](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/api/user/route.js>), [produtos](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/api/produto/route.js>) e [pedidos](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/api/orders/route.js>).

- [ ] **D06 · P0 · Separar login do layout protegido.** Login não deve receber a guarda que exige sessão; páginas administrativas precisam de autorização no servidor. Exibir identidade real da sessão, removendo usuário/avatar provisórios.
  Conclusão: visitante chega ao login sem loop; URL direta do painel exige permissão; navegação mostra administrador atual. Evidência: [layout](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/layout.tsx>) e [dados provisórios](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/data/links.ts>).

- [ ] **D07 · P1 · Definir contratos e migrar transporte por módulo.** Usar IDs string, valores em centavos, enums e relações reais. Regras/use cases no core; implementações Prisma no db; transporte autenticado no app conforme arquitetura escolhida. Leituras iniciais em Server Components; validar entradas no servidor.
  Conclusão: primeiro domínio completo funciona com schema atual, sem acesso MySQL ou regra duplicada na tela. Cada módulo migra rota, dados, formulário e persistência juntos. Evidência: [tipos antigos](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/lib/types.ts>) e [schema atual](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma>).

**2. Categorias, marcas e produtos — D08 a D19**

- [ ] **D08 · P1 · Migrar CRUD de categorias.** Listar/criar/editar nome, slug e categoria pai; validar unicidade, pai existente e ausência de ciclos. Bloquear exclusão quando houver produtos, filhas ou relações que precisam ser preservadas. Remover description/promotion do contrato antigo, pois não são campos de Category atual.
  Conclusão: categoria criada pode ser usada no produto; edição/exclusão têm comportamento previsível. Evidência: [formulário antigo](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/(public)/categories/register/form.tsx>) e [Category](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:161>).

- [ ] **D09 · P1 · Gerenciar visibilidade e ordem de categorias.** Editar showInNavigation/navigationOrder e, quando a home suportar, showOnHomepage/homeOrder. Usar controles booleanos/números adequados; payload parcial precisa aceitar false e zero.
  Conclusão: salvar e recarregar preservam valores; interface só promete efeitos consumidos pela loja. Integração do header/home depende das tarefas do catálogo no mapa geral. Evidência: [campos atuais](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:170>) e [filtro legado que descarta false](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/hooks/categories/useCategoryActions.ts>).

- [ ] **D10 · P2 · Criar gestão de marcas, se usada pelo catálogo.** Listar/criar/editar name e slug; tratar duplicidade; permitir selecionar marca no produto e definir remoção com produtos vinculados.
  Conclusão: marca aparece nas opções do formulário e nos filtros da loja; referência não vira campo livre de ID. Evidência: [Brand](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:154>); rotas administrativas de marcas não encontradas.

- [ ] **D11 · P1 · Migrar listagem de produtos.** Consultar Product com categoria/marca reais; busca, filtros, ordenação e paginação na URL, aplicados no servidor. Retirar categorias/promos fixas e paginação por slice do array completo.
  Conclusão: resultado limitado por página; filtros persistem ao atualizar/voltar; estado vazio e erro distinguíveis. Evidência: [página](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/(public)/products/page.tsx>), [hook](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/hooks/products/useProducts.ts>) e [paginação local](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/components/table/data-table.tsx:182>).

- [ ] **D12 · P1 · Migrar cadastro de produto.** Formulário RHF/Zod para name, slug, description, specifications, productImage, categoryId, preço em centavos, estoque inicial e campos exigidos pelo schema; marca/tipo/destaque conforme escopo. Converter entrada monetária sem perder centavos; validar relações e limites no servidor.
  Conclusão: produto cadastrado no banco atual aparece na loja com preço, imagem e categoria corretos. Definir significado de avaliationStars sem apresentar valor manual como avaliação de clientes. Evidência: [cadastro](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/(public)/products/register/form.tsx>) e [Product](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:75>).

- [ ] **D13 · P1 · Migrar edição de produto.** Carregar dados atuais; corrigir price/preco, categorias por índice e campos sem handler; permitir alterações parciais, false, zero e limpeza de campos opcionais. Escolher destino antigo do slug quando ele mudar.
  Conclusão: edição persiste apenas campos permitidos, continua consistente com a loja e mostra erros de unicidade/validação. Evidência: [edição atual](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/components/table/table-actions.tsx>) e [action hook](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/hooks/products/useProductActions.ts>).

- [ ] **D14 · P1 · Definir remoção ou indisponibilidade de produto.** Product possui relações com carrinhos, pedidos, promoções e kits; não há flag de arquivamento no schema atual. Para MVP, bloquear exclusão vinculada com mensagem clara. Arquivamento exige contrato próprio se necessário.
  Conclusão: exclusão não quebra histórico nem relações; indisponibilidade não é confundida com remoção; mudança de schema só com autorização. Evidência: [relações Product](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:92>).

- [ ] **D15 · P1 · Implementar ajuste de estoque compatível com reservas.** Não sobrescrever silenciosamente saldo calculado antes de uma compra concorrente. Definir ajustes absolutos/por quantidade e executar atualização atômica; impedir valores negativos e respeitar reposição de pedido cancelado.
  Conclusão: ajuste administrativo e checkout simultâneos não perdem decremento; saldo exibido tem significado claro. Registro de movimentações só se necessário, com contrato autorizado. Evidência: [estoque atual](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:91>) e [reserva no checkout](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/db/src/repositories/prisma-order-repository.ts:104>).

- [ ] **D16 · P1 · Fechar imagem de produto e preview.** Para MVP, aceitar URL válida com preview e configuração de origem compatível com imagens reais da loja. Corrigir configuração antiga de imagens do dashboard. Upload e gerenciamento de mídia ficam opcionais para segunda entrega.
  Conclusão: imagem salva renderiza em ambos os apps; entrada inválida recebe mensagem útil. Evidência: [next.config dashboard](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/next.config.ts>) e [origem da loja](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/next.config.ts>).

- [ ] **D17 · P1 após produto básico · Criar gestão real de promoções.** Listar/criar/editar período, ativação e produtos com promotionPriceInCents. Promoção não é categoria2. Validar datas, preços e vínculos; preservar regra compartilhada para promoções sobrepostas.
  Conclusão: ativação/expiração afetam preço conforme regra do core e telas da loja; desconto não depende de ID fixo. Evidência: [Promotion](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:178>) e [PromotionProduct](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:205>).

- [ ] **D18 · P2 · Gerenciar atributos técnicos, se utilizados.** Criar atributo com key/type/unit; vincular categorias e editar valor do produto conforme TEXT/NUMBER/BOOLEAN/SELECT. Definir opções de SELECT antes de criar UI, pois schema não tem modelo separado de opções.
  Conclusão: valores respeitam tipo/unidade, não duplicam atributo por produto e alimentam filtros técnicos da loja. Evidência: [Attribute e vínculos](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:109>).

- [ ] **D19 · P2 opcional · Gerenciar computadores/kits.** Criar composição ProductKitItem somente se COMPUTER fizer parte do catálogo. Definir se estoque do computador é próprio ou derivado dos componentes antes de implementar; impedir autocontenção e composições inválidas.
  Conclusão: composição, disponibilidade e preço seguem política explícita; nenhuma regra de kit é presumida só pela existência da tabela. Evidência: [ProductKind](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:104>) e [ProductKitItem](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:192>).

**3. Pedidos, clientes e permissões — D20 a D24**

- [ ] **D20 · P1 · Migrar consulta de pedidos reais.** Buscar Order com cliente, total em centavos, data e enum atual; filtrar por status/período/identificador e paginar no servidor. Remover mapeamento numérico Pendente/Ativo/Finalizado que não corresponde ao schema.
  Conclusão: pedidos feitos na loja aparecem no painel com filtros corretos e acesso administrativo. Evidência: [lista antiga](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/(public)/orders/page.tsx>), [mappers](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/utils/mappers.ts>) e [OrderStatus](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:298>).

- [ ] **D21 · P1 · Criar detalhe do pedido.** Exibir itens/quantidades/preços armazenados, total, snapshot de entrega e status de pagamento; restringir dados pessoais aos campos necessários. Não reconstruir preço/endereço histórico a partir do cadastro atual.
  Conclusão: administrador consegue conferir pedido sem alterar cobrança ou dados históricos. Identificadores Stripe usados apenas quando úteis para suporte. Evidência: [Order/OrderItem](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:260>); rota de detalhe administrativo não encontrada.

- [ ] **D22 · P1 · Substituir edição livre de status por ações válidas.** Pedido pago é confirmado pelo Stripe, não pelo formulário. Definir cancelamento de pendente coordenado com sessão Stripe/reserva. Para MVP, painel pode começar somente com consulta; reembolso e expedição exigem fluxo/estado próprios se requisitados.
  Conclusão: não é possível inventar pagamento, editar total ou devolver estoque duas vezes; exclusão destrutiva de pedido não é ação padrão. Evidência: [API antiga](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/api/orders/route.js>) e [regras atuais](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/core/src/modules/orders/domain/order.ts>).

- [ ] **D23 · P1 · Migrar consulta de clientes.** Usar User atual e relacionar pedidos/endereço apenas onde necessário. CPF/telefone/endereço não são colunas de User no schema atual. Listar nome/email/data com busca/paginação e detalhe restrito; não retornar password/account/session.
  Conclusão: cliente da loja aparece no painel sem exposição de credenciais ou campos inexistentes. Evidência: [tipos antigos](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/lib/types.ts>) e [modelos atuais](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma>).

- [ ] **D24 · P2 · Separar gestão de contas de gestão de clientes.** Decidir quais alterações administrativas são necessárias. Usar APIs oficiais de autenticação para ações de conta, não bcrypt/Prisma direto no hash. Proteger concessão/revogação de administrador e evitar remoção do último administrador operacional.
  Conclusão: contas não podem ser criadas com privilégio via payload livre; alteração de email/senha/sessão segue fluxo de auth escolhido. Evidência: [CRUD legado de usuários](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/api/user/route.js>) e [User atual](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:10>).

**4. Conteúdo e configurações — D25 a D27**

- [ ] **D25 · P1 · Gerenciar destaques da loja.** Expor isFeatured na edição de produto e listar produtos destacados. Conectar flags de categoria/home somente quando consumidas pelo frontend. Começar com campos existentes; não criar CMS genérico para selecionar destaques.
  Conclusão: alteração no painel se reflete na home com invalidação correta. Evidência: [home atual](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/(public)/(home)/page.tsx>) e [isFeatured](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:90>).

- [ ] **D26 · P2 opcional · Definir destino da gestão de seções/banners.** CRUD legado de sections não corresponde a modelo Prisma; banner atual é arquivo fixo. Escolher retirar item provisório, restringi-lo aos controles de destaque ou criar modelo mínimo se banners/seções editáveis forem requisito.
  Conclusão: painel não apresenta gestão fictícia; eventual modelo, ordenação e consumo pela loja aprovados antes da migration. Evidência: [conteúdo antigo](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/(public)/content/page.tsx>) e [home](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/(public)/(home)/page.tsx>).

- [ ] **D27 · P2 · Fechar escopo de Configurações.** Link atual aponta para #. Definir se haverá perfil/senha do administrador ou configuração comercial; disponibilizar só operações suportadas. Segredos de integração permanecem fora de formulários comuns.
  Conclusão: menu não tem destino provisório; ações escolhidas possuem persistência e proteção reais. Evidência: [navSecondary](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/data/links.ts>).

**5. Funcionamento consistente das telas — D28 a D32**

- [ ] **D28 · P1 · Tipar tabelas e ações por domínio.** Tabela atual converte qualquer linha para Product, inclusive usuário/pedido/categoria. Separar configuração/ações específicas e manter apenas apresentação genérica compartilhada quando útil; não trocar casts por uma abstração maior.
  Conclusão: ação recebe tipo correto; colunas mostram relações reais e unidades corretas; paginação reinicia quando filtro muda. Evidência: [casts da tabela](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/components/table/data-table.tsx:219>).

- [ ] **D29 · P1 · Migrar formulários para RHF/Zod durante cada módulo.** Validar campos na UI e servidor; inputs de dinheiro/estoque/datas com conversão explícita; selects com IDs reais. Diferenciar campo não alterado de false, zero, vazio permitido e null.
  Conclusão: create/update têm contrato correto, feedback por campo e envio bloqueado enquanto pendente. Evidência: [hooks legados](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/hooks/products/useProductActions.ts>) e [categoria descarta false](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/hooks/categories/useCategoryActions.ts>).

- [ ] **D30 · P1 · Completar loading, erro e atualização após mutação.** Hooks atuais confundem falha de leitura com lista vazia; mutations recarregam página inteira. Carregar dados iniciais no servidor, fornecer erro/vazio distintos, mensagens esperadas e atualização adequada após salvar/excluir.
  Conclusão: erro de API não aparece como ausência de dados; uma ação por vez; filtros/página não se perdem sem motivo. Evidência: [useProducts](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/hooks/products/useProducts.ts>) e [useProductActions](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/hooks/products/useProductActions.ts>).

- [ ] **D31 · P1 · Adequar estado e navegação às regras do projeto.** Remover AuthContext; identidade via servidor/props e estado local via useState. Rever SidebarProvider, que também usa Context, para cumprir veto do projeto sem refatorar todos os componentes. Ajustar idioma pt-BR, título, foco e navegação mobile nas telas migradas; reaproveitar componentes existentes em packages/ui quando compatíveis.
  Conclusão: estado administrativo não depende de Context/localStorage; sidebar e formulários funcionam por teclado/mobile; metadados não são Create Next App. Evidência: [layout](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/layout.tsx>) e [sidebar](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/components/ui/sidebar.tsx>).

- [ ] **D32 · P1 · Integrar invalidação com a loja.** Apps Next separados não devem presumir cache compartilhado. Após persistir produto/categoria/promoção, acionar integração servidor autenticada para tags permitidas. Definir erro/retry quando dado salva e invalidação falha.
  Conclusão: dados administrativos aparecem na loja no prazo escolhido; segredo não vai para navegador; atualização não é reportada como perdida se só cache falhou. Evidência: [endpoint atual da loja](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/api/internal/revalidate-products/route.ts>) e T18 do mapa geral.

**6. Métricas, validação e retirada do legado — D33 a D37**

- [ ] **D33 · P2 · Definir e calcular indicadores reais.** Definir período/timezone e o significado de cada card: valor de pedidos pagos, quantidade de pedidos por status, clientes e itens vendidos. Não chamar soma de pedidos de receita líquida/lucro sem dados para isso. Usar consultas Prisma e DTOs pequenos.
  Conclusão: indicadores conferem com pedidos reais; cancelados/pendentes tratados conforme definição; não dependem de views MySQL antigas. Evidência: [cards](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/components/dashboard/section-cards.tsx>) e [endpoint antigo](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/api/faturamento/route.js>).

- [ ] **D34 · P2 · Conectar gráficos e comparação de períodos.** Remover percentuais fixos e dados ilustrativos; buscar agregações para período selecionado. Preferir poucos gráficos úteis ao administrador; retirar visual sem fonte/objetivo definido.
  Conclusão: números/gráficos usam mesma definição e período; sem dados mostra estado vazio; comparação não divide por zero. Evidência: [charts](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/components/dashboard/charts/line-chart.tsx>) e [percentuais dos cards](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/components/dashboard/section-cards.tsx:32>).

- [ ] **D35 · P1 durante migração · Validar segurança e operações essenciais.** Planejar testes para acesso anônimo/cliente, privilégio por payload, duplicidade de slug, valores inválidos, alterações concorrentes de estoque, relações na exclusão e pedidos pagos. Validar primeiro módulo completo antes de avançar; teste de integração com banco somente em ambiente autorizado.
  Conclusão: typecheck/lint/build e cenários relevantes passam quando execução for autorizada; documentar limites de validação. Evidência: [scripts existentes](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/package.json>); testes do dashboard não encontrados.

- [ ] **D36 · P2 · Remover legado substituído por domínio.** Após validar módulo novo, retirar sua rota SQL/hooks/tipos obsoletos. Enquanto MySQL ainda existir, liberar conexões em finally. Remover cliente/dependências MySQL apenas quando não restar consumidor; não apagar banco/tabelas/dados como parte da limpeza.
  Conclusão: cada domínio tem implementação ativa única; dependências antigas só saem quando substituídas. Evidência: [cliente antigo](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/lib/db.js>) e [conexão sem release](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/api/faturamento/route.js:6>).

- [ ] **D37 · P2 · Documentar setup, administrador inicial e operação.** Registrar variáveis por app, permissões, contratos, módulos migrados, estratégia autorizada de migrations e roteiro de validação. Documentar ambientes/URLs/cookies e integração de cache, sem guardar segredos.
  Conclusão: ambiente reproduzível e lista explícita de funcionalidades entregues/pendentes; ninguém precisa adivinhar qual backend uma tela usa.

**Entregas sugeridas**

1. **Painel protegido:** D01–D07, com D31 na parte de sessão/layout e validações de acesso de D35.
2. **Catálogo administrável mínimo:** categorias D08–D09; produtos D11–D16; destaques D25. D28–D32 acompanham cada módulo. Resultado: criar/editar produto, ajustar estoque e conferir efeito na loja.
3. **Operação de pedidos:** D20–D23. Começar por consulta; permitir ação administrativa apenas após fechar regra de D22. Resultado: conferir compras reais sem inventar estados de pagamento.
4. **Recursos complementares:** marcas D10, promoções D17, contas D24 e métricas D33–D34, conforme prioridade do catálogo/operação.
5. **Expansões opcionais:** atributos D18, kits D19, conteúdo editável D26 e configurações D27. Só implementar recursos com necessidade definida.
6. **Fechamento contínuo:** D35–D37 por entrega; retirar legado progressivamente, preservando comportamento validado.

MVP concluído quando administrador autorizado consegue entrar, gerir categorias/produtos/estoque, consultar pedidos/clientes e ver mudanças refletidas na loja, com validações e tratamento de erros. Gráficos e CMS vêm depois desses fluxos.

Dependências que podem exigir autorização específica: instalação de pacotes, comandos de validação, acesso ao banco, mudanças de schema/migrations e implementação nos consumidores da loja. Este mapa não autoriza deploy nem executa essas operações.
