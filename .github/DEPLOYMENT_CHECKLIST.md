# 🚀 Deployment Checklist

## Pré-Deployment (Todos os ambientes)

- [ ] Code review aprovado
- [ ] Todos os testes passando
- [ ] Sem merge conflicts
- [ ] Dependências atualizadas (`npm outdated`)
- [ ] Nenhuma vulnerabilidade conhecida (`npm audit`)
- [ ] ESLint passing sem warnings
- [ ] TypeScript type-checking passing
- [ ] Documentação atualizada
- [ ] Changelog atualizado

## Staging Deployment

### Antes do Deploy
- [ ] Branch `develop` atualizada
- [ ] Build local testado: `npm run build && npm start`
- [ ] Variáveis de ambiente validadas
- [ ] Database migrations testadas (se aplicável)

### Depois do Deploy
- [ ] Verificar health check: `/api/health`
- [ ] Testar fluxos principais de autenticação
- [ ] Verificar integrações com APIs externas (Supabase, OpenAI, CNPJ)
- [ ] Monitorar logs por 30 minutos
- [ ] Executar smoke tests
- [ ] Compartilhar link de staging com stakeholders

## Production Deployment

### Antes do Deploy
- [ ] Code review em Staging por 24h+
- [ ] Todos os bugs conhecidos resolvidos
- [ ] Backup de banco de dados criado
- [ ] Plano de rollback documentado
- [ ] Aprovação de gerente/lead
- [ ] Performance testing concluído

### Durante o Deploy
- [ ] Equipe de suporte em prontidão
- [ ] Anunciar janela de manutenção (se necessário)
- [ ] Monitorar aplicação em tempo real
- [ ] Prepared rollback command

### Depois do Deploy
- [ ] Todos os endpoints respondendo
- [ ] Usuários conseguindo fazer login
- [ ] Funcionalidades críticas testadas:
  - [ ] Chat functionality
  - [ ] Document upload
  - [ ] CNPJ search
  - [ ] Report generation
  - [ ] Dashboard display
- [ ] Verificar Application Insights por erros
- [ ] Checar logs para warnings/errors
- [ ] Comunicar sucesso ao time
- [ ] Documentar qualquer issue encontrado

## Performance Checks

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Response time < 200ms (p95)

## Security Checks

- [ ] CSP headers configurados
- [ ] CORS headers validados
- [ ] Rate limiting ativo
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens presentes

## Rollback Plan

Se algo der errado:

```bash
# Reverter para última versão stable
git revert <commit-hash>
git push origin main

# Ou usar o plano de disaster recovery
az webapp deployment slot swap -g <resource-group> \
  -n <app-name> --slot staging
```

## Post-Deployment Monitoring (24h)

- [ ] Monitorar Error Rate (target: < 0.1%)
- [ ] Monitorar CPU Usage (target: < 70%)
- [ ] Monitorar Memory Usage (target: < 80%)
- [ ] Monitorar Response Time (target: < 200ms)
- [ ] Revisar logs de erro
- [ ] Verificar relatórios de usuários

## Sign-off

- **Deployed by**: ___________________
- **Date/Time**: ___________________
- **Approved by**: ___________________
- **Status**: ☐ Success ☐ Failed ☐ Rolled Back
- **Notes**: 
  ```
  
  
  ```
