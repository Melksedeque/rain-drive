# Itens Pendentes

## Funcionalidades
- [ ] **Testes Unitários:** O projeto não possui infraestrutura de testes (Jest/Vitest). Configurar e cobrir as novas funcionalidades (Recentes/Lixeira) com 80% de coverage.
- [ ] **Internacionalização (i18n):** Implementar suporte a múltiplos idiomas (atualmente hardcoded em PT-BR).
- [ ] **Webhook Vercel Blob:** Implementar webhook para garantir consistência entre uploads no Blob e registros no DB.
- [ ] **Storage Key:** Extrair chave correta do Blob URL para deleção mais robusta.
- [ ] **Limpeza Automática da Lixeira:** Configurar Cron Job (Vercel Cron) para limpar itens da lixeira com mais de 30 dias.
- [ ] **Analytics:** Adicionar rastreamento de uso para as páginas de Recentes e Lixeira.

## Melhorias Técnicas
- [ ] **Refatoração de ItemActions:** Consolidar lógica de delete em um único lugar (atualmente dividido entre `item-actions.tsx` e `trash-content.tsx`).
- [ ] **Paginação:** Implementar paginação real ou infinite scroll para listas muito grandes (atualmente limitadas a 50 em Recentes).
