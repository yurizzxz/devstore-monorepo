**Mapa de tarefas — E-commerce Monorepo**

Varredura em 04/10/2026. Escopo: loja, dashboard e pacotes compartilhados. Base: leitura do código, contratos, manifests, lockfile e migrations; sem execução da aplicação, build, lint, testes ou acesso ao banco. Este documento registra trabalho pendente; nenhum item foi implementado nesta varredura.

P0 = bloqueador ou segurança; P1 = integridade e fluxo principal; P2 = acabamento e manutenção. “Confirmado” significa evidência no código, sem reprodução em execução. “Risco” exige cenário de validação. “Melhoria” depende da prioridade do produto.

Já existem: autocomplete com debounce/teclado, estados globais de loading/erro/404, autenticação da loja, carrinho no servidor, endereços, pedidos e Stripe Checkout. Preservar preço calculado no servidor, reserva atômica de estoque, snapshot do endereço, assinatura do webhook e transições idempotentes de pagamento/cancelamento.

Ordem sugerida: desbloquear loja; fechar integridade de compra; completar catálogo; consolidar pacotes e validação. Migrar dashboard depois, com a proteção de suas APIs antecipada se estiver acessível.

**1. Desbloquear navegação e compilação**

- [ ] **T01 · P0 · Atualizar patches de segurança e alinhar versões.** Confirmado: apps usam Next.js 15.2.4 e React 19.0.0; eslint-config-next está em 15.1.7. Lockfile também resolve React DOM 19.2.8 em alguns pacotes, enquanto a loja usa 19.0.0. Escolher versões compatíveis e corrigidas, alinhando React/React DOM e ESLint; não exigir mudança de major para resolver patches.
  Evidência: [loja](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/package.json>), [dashboard](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/package.json>) e [lockfile](<E:/React Projects/Projetos ReactJS/Ecommerce/pnpm-lock.yaml>). O [aviso oficial do Next.js](https://nextjs.org/blog/security-update-2025-12-11) inclui vulnerabilidades no App Router da linha 15.2.x e versões corrigidas posteriores a 15.2.4. Consultar avisos vigentes ao executar a atualização.
  Conclusão: versões alinhadas e patches verificados; instalação e validações somente com autorização.

- [ ] **T02 · P0 · Permitir visitante anônimo no header.** Confirmado: HeaderAccount chama requireCustomer; o layout o inclui também no login. Sem sessão, redireciona para a própria autenticação. Usar sessão opcional no header e manter proteção nas páginas de conta/checkout.
  Evidência: [header-account.tsx](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/components/common/header/header-account.tsx:12>) e [require-customer.ts](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/lib/require-customer.ts:11>).
  Conclusão: home, catálogo, produto e login acessíveis sem sessão; dados privados continuam protegidos.

- [ ] **T03 · P0 · Consolidar busca e corrigir export de tipos Prisma.** Confirmado: repository tem duas implementações searchProducts; também importa Prisma de um módulo que exporta somente Product como tipo. Manter uma busca, com normalização, limite e decisão explícita sobre produtos sem estoque.
  Evidência: [repository](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/db/src/repositories/prisma-catalog-repository.ts:32>), [segunda implementação](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/db/src/repositories/prisma-catalog-repository.ts:89>) e [cliente Prisma](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/client.ts:3>).
  Conclusão: método único e contrato de tipos válido; typecheck autorizado confirma correção.

- [ ] **T04 · P0 · Corrigir prop do menu mobile.** Confirmado: side está em Sheet, mas seu contrato aceita essa prop apenas em SheetContent.
  Evidência: [consumidor](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/components/common/header/header-account-client.tsx:133>) e [componente compartilhado](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/ui/src/components/sheet.tsx:47>).
  Conclusão: prop no componente correto, menu abrindo/fechando e tipos válidos.

**2. Fechar carrinho, checkout e conta**

- [ ] **T05 · P1 · Tornar mutações do carrinho atômicas.** Risco: quantidade é lida e gravada em operações separadas; total e versão do carrinho são atualizados depois. Coordenar item, total e versão numa operação que também respeite checkout concorrente.
  Evidência: [AddProductToCart](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/core/src/modules/cart/use-cases/add-product-to-cart.ts:32>) e [repository](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/db/src/repositories/prisma-cart-repository.ts:63>).
  Conclusão: duas adições simultâneas não perdem quantidade; alteração concorrente ao checkout não perde itens nem deixa total inconsistente.

- [ ] **T06 · P1 · Unificar preço efetivo em todas as telas.** Confirmado: catálogo, busca, produto e linhas do carrinho/checkout mostram preço base; regras de carrinho e pedido aplicam promoção. Subtotal persistido pode ficar desatualizado quando preço muda. Compartilhar regra de preço e produzir dados de leitura consistentes, preservando recálculo no checkout.
  Evidência: [regra atual](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/core/src/modules/cart/domain/cart.ts:14>), [carrinho](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/components/ui/cart-list.tsx:97>) e [checkout](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/(public)/checkout/page.tsx:76>).
  Conclusão: linhas, subtotal e cobrança concordam; promoção expirada ou mudança de preço recebe tratamento claro.

- [ ] **T07 · P1 · Recuperar reservas e pedidos após falha Stripe.** Risco: criação do pedido confirma reserva e limpa carrinho antes da chamada externa. Falhas de expire/cancel são ignoradas; não foi encontrado fluxo de reconciliação. Registrar falhas e recuperar pedidos sem sessão ou com evento não processado.
  Evidência: [criação e compensação](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/actions/checkout/create-checkout.ts:85>) e [transação do pedido](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/db/src/repositories/prisma-order-repository.ts:147>).
  Conclusão: pedido pendente não prende estoque indefinidamente; consultar situação do pagamento antes de liberar reserva; reposição ocorre uma única vez. Projetar recuperação simples antes de escolher scheduler ou fila.

- [ ] **T08 · P1 · Permitir continuar compra interrompida.** Lacuna: histórico não oferece retomada; voltar do Stripe deixa pedido pendente e carrinho já foi esvaziado. Reutilizar sessão válida ou oferecer nova tentativa com preço/estoque revalidados.
  Evidência: [histórico](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/(public)/orders/page.tsx:74>) e [retorno de cancelamento](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/(public)/checkout/cancel/page.tsx:19>).
  Conclusão: cliente consegue retomar ou recuperar itens sem duplicar cobrança/reserva; estado de espera prolongada permite nova consulta de pagamento.

- [ ] **T09 · P1 · Entregar erros de negócio úteis na UI.** Confirmado: actions convertem erros em Error com mensagem amigável, mas createSafeActionClient sem configuração mascara mensagens com texto genérico em inglês. Definir erros esperados e tratamento central; não expor mensagens de falhas internas.
  Evidência: [safe-action.ts](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/lib/safe-action.ts:3>) e [mapeamento do carrinho](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/actions/cart/errors.ts:9>); comportamento padrão conferido no código da dependência instalada.
  Conclusão: falta de estoque, sessão expirada e endereço inválido têm mensagem específica; falha inesperada recebe mensagem neutra e registro no servidor.

- [ ] **T10 · P1 · Alinhar cadastro e continuidade após login.** Confirmado: cadastro aceita senha de 6 caracteres; backend exige 8. Cadastro não bloqueia botão durante envio. Login/cadastro sempre retornam à home. Alinhar validação, impedir envio repetido e preservar destino local solicitado.
  Evidência: [cadastro](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/(public)/authentication/_components/sign-up-form.tsx:18>), [backend](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/auth/lib/auth.ts:21>) e [login](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/(public)/authentication/_components/sign-in-form.tsx:51>).
  Conclusão: regras iguais nos dois lados; checkout/conta retomados após login; destino externo não aceito.

- [ ] **T11 · P2 · Rejeitar atualização de endereço sem alteração.** Confirmado no arquivo já modificado localmente: refine conta id obrigatório e aceita payload contendo só id. Validar presença de campo atualizável, incluindo tratamento de undefined e limpeza do complemento.
  Evidência: [update-address.ts](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/actions/address/update-address.ts:26>).
  Conclusão: edição vazia rejeitada; edição real funciona; preservar trabalho local existente.

- [ ] **T12 · P2 · Definir exclusão de endereço usado em pedido.** Confirmado: exclusão física encontra relação obrigatória no pedido. Para MVP, bloquear com mensagem clara é menor que alterar schema; remoção da agenda mantendo histórico exige decisão de contrato.
  Evidência: [deleteMany](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/db/src/repositories/prisma-address-repository.ts:57>) e [relação](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/schema.prisma:265>).
  Conclusão: ação tem comportamento previsível e mantém histórico; eventual migration exige autorização específica.

**3. Completar catálogo e comunicação da loja**

- [ ] **T13 · P1 · Conectar filtros aos dados e à URL.** Confirmado: filtros têm opções fixas e controles sem conexão com consulta; listagem lê apenas q. Repository já possui listProducts/getFilterData, sem consumidores encontrados.
  Evidência: [filtros](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/components/common/product-filters.tsx:30>), [listagem](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/(public)/products/page.tsx:14>) e [consulta disponível](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/db/src/repositories/prisma-catalog-repository.ts:144>).
  Conclusão: marca, categoria, atributos, faixa de preço e promoção combináveis; filtros persistem após reload e navegação voltar; entradas validadas no servidor.

- [ ] **T14 · P2 · Paginar catálogo e histórico de pedidos.** Confirmado: consultas trazem lista completa; catálogo sem resultado renderiza grid vazio. Usar página na URL, limites e ordenação estável.
  Evidência: [produtos](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/data/get-products.ts:20>) e [pedidos](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/(public)/orders/page.tsx:39>).
  Conclusão: volume limitado por página; filtros reiniciam paginação; vazio mostra orientação útil; histórico permanece restrito ao proprietário.

- [ ] **T15 · P2 · Fechar navegação de categorias.** Confirmado: header lista todas; schema possui flags/ordem de navegação; consulta atual usa categoria exata e repository inclui filha direta. Escolher profundidade suportada e aplicar mesma política.
  Evidência: [categorias do header](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/data/get-categories.ts:6>) e [escopo do repository](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/db/src/repositories/prisma-catalog-repository.ts:237>).
  Conclusão: categorias visíveis, ordenação e produtos retornados correspondem à configuração do catálogo.

- [ ] **T16 · P1 · Alinhar frete e promoção de primeira compra.** Confirmado: header promete frete grátis e 20% na primeira compra; produto promete cálculo de frete; checkout monta apenas itens. Decidir regras do MVP e implementar ou retirar promessas sem suporte.
  Evidência: [promotions-bar.tsx](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/components/common/header/promotions-bar.tsx:14>), [produto](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/(public)/product/[slug]/page.tsx:124>) e [Stripe Checkout](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/actions/checkout/create-checkout.ts:48>).
  Conclusão: comunicação, resumo e cobrança refletem regra comercial real; integração de frete/cupom só se fizer parte do escopo escolhido.

- [ ] **T17 · P2 · Resolver destinos inexistentes do rodapé.** Confirmado: Sobre, Contato, Política de Privacidade e Termos apontam para rotas ausentes; redes usam # e seção Produtos está vazia. Criar conteúdo/destinos previstos ou remover links provisórios.
  Evidência: [footer.tsx](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/components/common/footer.tsx:19>).
  Conclusão: links visíveis têm destino válido e conteúdo adequado ao projeto.

- [ ] **T18 · P2 · Completar invalidação de cache.** Lacuna: produtos e categorias têm tags distintas, mas endpoint interno invalida apenas products. Definir invalidação nas mudanças do catálogo e integração administrativa quando o dashboard passar a usar o mesmo banco.
  Evidência: [endpoint](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/api/internal/revalidate-products/route.ts:20>) e [cache de categorias](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/data/get-categories.ts:17>).
  Conclusão: mudanças de produto/categoria aparecem no prazo escolhido; endpoint continua autenticado e restrito a tags permitidas; dados privados fora do cache compartilhado.

- [ ] **T19 · P2 · Completar metadata e indexação.** Melhoria: produto/categoria sem metadata específico; sitemap/robots não encontrados; layout referencia favicon ausente no inventário. Definir metadados públicos e política de indexação das páginas privadas.
  Evidência: [layout](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/layout.tsx:8>) e [produto](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/(public)/product/[slug]/page.tsx>).
  Conclusão: títulos/descrições/URLs/imagens coerentes, favicon válido e páginas de conta fora da indexação prevista.

**4. Consolidar pacotes e validação**

- [ ] **T20 · P1 · Concluir Redis/rate limit em andamento.** Confirmado: arquivos locais não rastreados implementam cliente REST e sliding window, mas @repo/lib exporta apenas Stripe; não há uso nas rotas. Completar exports e configuração; conectar primeiro à busca. Verificar proteção já fornecida pelo Better Auth antes de duplicá-la.
  Evidência: [exports](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/lib/package.json:6>), [rate limiter](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/lib/src/rate-limit/redis-sliding-window.ts:74>) e [busca](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/api/products/search/route.ts:11>).
  Conclusão: limite integrado com 429/Retry-After, timeout e política explícita de falha do Redis; configuração documentada sem expor tokens. Preservar trabalho local.

- [ ] **T21 · P2 · Concluir migração vertical de leituras do catálogo.** Confirmado: busca usa repository, mas dados de listagem/detalhe e categoria consultam Prisma diretamente. Consolidar consultas e contratos num módulo, começando pelos filtros; evitar use cases que apenas encaminham leitura e evitar reescrita geral.
  Evidência: [data/get-products.ts](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/data/get-products.ts>) e [categoria](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/app/(public)/products/[slug]/page.tsx:23>).
  Conclusão: rota, consulta, filtros, cache e DTO do catálogo concordam; comportamento atual preservado.

- [ ] **T22 · P1 antes de migrar banco · Revisar pré-condições das migrations.** Risco documentado: migration de auth adiciona User.updatedAt obrigatório sem backfill; outra cria índices únicos em carrinhos/itens, sujeitos a duplicatas legadas. Verificar estado real e planejar tratamento antes de qualquer aplicação.
  Evidência: [migration auth](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/migrations/20260809215546_add_better_auth/migration.sql:4>) e [unicidade](<E:/React Projects/Projetos ReactJS/Ecommerce/packages/prisma/migrations/20260906174501_unique_cart_user_id/migration.sql:4>).
  Conclusão: instalação limpa e atualização de banco populado têm caminho validado; não reescrever migrations já aplicadas; consultas/migrations somente com autorização.

- [ ] **T23 · P1 · Criar validação dos fluxos críticos.** Lacuna: não foram encontrados testes automatizados nem comando dedicado de typecheck. Começar pelos riscos de integridade e falhas encontradas, mantendo validação da loja independente do dashboard.
  Evidência: [scripts raiz](<E:/React Projects/Projetos ReactJS/Ecommerce/package.json:5>) e [scripts da loja](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/package.json:4>).
  Conclusão: cobertura útil para visitante anônimo, concorrência do carrinho/estoque, promoção expirada, falha Stripe, webhook repetido/fora de ordem e acesso a endereço/pedido alheio. Instalação, scripts e execução precisam de autorização.

- [ ] **T24 · P2 · Documentar setup e operação local.** Lacuna: não existe guia raiz de instalação/configuração/validação. Documentar variáveis por pacote, geração do Prisma, dados de desenvolvimento, eventos Stripe e comandos por app. Confirmar estratégia de seed sem usar banco real.
  Evidência: [workspace](<E:/React Projects/Projetos ReactJS/Ecommerce/pnpm-workspace.yaml>) e [manifest raiz](<E:/React Projects/Projetos ReactJS/Ecommerce/package.json>).
  Conclusão: outro desenvolvedor consegue configurar ambiente autorizado; requisitos, pendências e validações não realizadas ficam explícitos.

- [ ] **T25 · P2 · Retirar resíduos legados após estabilização.** Melhoria: useFilteredProducts retorna []; useCart mantém contrato local diferente do carrinho servidor; não foram encontrados consumidores desses hooks na loja. Confirmar ausência de uso e remover somente arquivos órfãos. Revisar também entrypoints vazios do core.
  Evidência: [useProducts.ts](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/hooks/useProducts.ts:12>) e [useCart.ts](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/ecommerce/src/hooks/useCart.ts>).
  Conclusão: um fluxo de carrinho/catálogo ativo, sem limpeza fora do escopo e sem camadas vazias adicionais.

**5. Dashboard legado — migração separada**

Checklist específico ampliado: [Mapa de tarefas do dashboard — 37 tarefas](<E:/React Projects/Projetos ReactJS/Ecommerce/MAPA-DE-TAREFAS-DASHBOARD.md>). O documento detalha módulos, dependências e entregas de MVP; T26–T31 abaixo permanecem como resumo do monorepo.

Bloco inventariado pela varredura geral. A migração completa pode esperar a estabilização da loja; T26 precisa vir primeiro caso o painel esteja acessível. Não basta esconder telas para proteger APIs.

- [ ] **T26 · P0 se acessível · Proteger APIs e restringir dados administrativos.** Confirmado: CRUD não verifica sessão/permissão; listagem de usuários usa SELECT * e devolve hashes/dados pessoais. Atualizações aceitam chaves arbitrárias e registram valores. Aplicar guarda no servidor, autorização administrativa, allowlist/validação e DTO seguro.
  Evidência: [usuários](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/api/user/route.js:9>), [handlers](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/api/user/route.js:135>) e [produtos](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/api/produto/route.js:136>).
  Conclusão: acesso anônimo negado; consumidor sem permissão não administra; hashes e campos sensíveis não retornam nem são registrados.

- [ ] **T27 · P1 · Migrar contrato de banco e autenticação por módulo.** Confirmado: dashboard usa MySQL/tabelas antigas, JWT em localStorage e AuthContext; loja usa PostgreSQL/Prisma/Better Auth. Cadastro administrativo trata token inexistente como válido. Remover fallback de segredo JWT e adotar sessão servidor com permissão administrativa explícita.
  Evidência: [db.js](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/lib/db.js:1>), [AuthContext](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/context/AuthContext.tsx:30>) e [login](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/login/login-form.tsx:76>).
  Conclusão: primeiro módulo completo usa contrato atual e autenticação verificada; migração incremental, sem React Context e sem trocar Prisma.

- [ ] **T28 · P1 · Corrigir imports e dependências do dashboard.** Confirmado: imports de utils/formatCurrency apontam para arquivo inexistente; manifest não declara várias dependências usadas. Antes de instalar pacotes legados, decidir quais serão eliminados pela migração e quais continuam necessários.
  Evidência: [section-cards.tsx](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/components/dashboard/section-cards.tsx:13>), [table-actions.tsx](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/components/table/table-actions.tsx:16>) e [manifest](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/package.json>).
  Conclusão: imports resolvem, dependências diretas necessárias declaradas e React/React DOM alinhados; validar compilação somente com autorização.

- [ ] **T29 · P1 · Migrar operações de pedidos para regras seguras.** Confirmado: pedido/itens são inseridos sem transação; API aceita total/preço/status do cliente; exclusão remove pai antes dos itens. Reutilizar domínio de pedidos e definir transições administrativas permitidas, preservando confirmação de pagamento pelo Stripe.
  Evidência: [orders/route.js](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/api/orders/route.js:25>).
  Conclusão: preço/total calculados no servidor, transação completa, transições autorizadas e exclusão/histórico definidos; pedido pago não é fabricado pelo cliente.

- [ ] **T30 · P1 · Corrigir contratos de edição de produtos/categorias/usuários.** Confirmado: formulário envia price enquanto SQL espera preco; selects usam índices como IDs; email editável não possui onChange. Definir DTO e validação compartilhados, usando IDs reais e RHF/Zod.
  Evidência: [table-actions.tsx](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/components/table/table-actions.tsx:155>) e [API produto](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/api/produto/route.js:45>).
  Conclusão: edição persiste os campos corretos e não produz colunas arbitrárias; alterações no catálogo atual invalidam cache da loja, conforme T18.

- [ ] **T31 · P2 · Tornar métricas confiáveis e liberar recursos legados.** Confirmado: endpoints adquirem conexões sem release; cards usam percentuais fixos. Migrar consultas para contrato atual; enquanto MySQL existir, liberar conexão em finally; calcular comparações reais ou remover números ilustrativos.
  Evidência: [faturamento](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/app/api/faturamento/route.js:6>) e [cards](<E:/React Projects/Projetos ReactJS/Ecommerce/apps/dashboard/src/components/dashboard/section-cards.tsx:32>).
  Conclusão: métricas correspondem ao período e status definidos; ausência de dados tratada; chamadas não esgotam pool.

**Dependências para execução**

- T02, T03 e T04 precedem validação funcional da loja; T01 precede exposição com a versão corrigida.
- T05, T06 e T07 precedem considerar checkout estabilizado; T08 aproveita recuperação de T07.
- T03 precede filtros T13; T13 deve usar os contratos definidos em T21, evitando implementação paralela.
- T16 exige decisão de regra comercial; frete grátis sem cotação é opção de MVP, desde que a comunicação corresponda.
- T22 precede qualquer nova aplicação de migrations; T23 verifica mudanças com cenários úteis, mediante autorização.
- T26 precede exposição administrativa; T27 orienta T28–T31 para evitar reparar em massa backend que será substituído.

Alterações preexistentes preservadas: update-address.ts e arquivos locais de Redis/rate limit. Resultado desta tarefa: somente criação deste checklist. Nenhuma instalação, execução de script, alteração de banco ou deploy realizada.
