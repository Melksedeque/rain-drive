# Tarefas Pendentes e Melhorias Futuras

Este arquivo lista itens identificados durante a revisão de código que requerem atenção futura, refatoração ou implementação de melhorias.

## Backend & API

- [ ] **Cache de Clima Persistente**: O cache atual em `src/lib/weather.ts` é em memória. Para produção serverless, migrar para Redis ou Vercel KV.
- [ ] **Webhook de Upload**: Implementar o handler `onUploadCompleted` em `src/app/api/upload/route.ts` para garantir consistência entre o armazenamento (Vercel Blob) e o banco de dados, independente do sucesso do cliente.
- [ ] **Storage Key**: Em `src/actions/storage.ts` (`createFile`), extrair a chave correta do blob em vez de usar a URL completa como `storageKey`.

## Lógica de Negócio

- [ ] **Movimentação de Pastas**: A verificação de dependência circular em `src/actions/storage.ts` (`moveItem`) precisa ser robusta e recursiva para evitar que uma pasta pai seja movida para dentro de um filho.

## Frontend

- [ ] **Tipagem Estrita**: Revisar componentes que ainda possam ter tipagens genéricas implícitas e garantir cobertura total de interfaces.
