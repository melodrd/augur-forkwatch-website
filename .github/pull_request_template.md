## Summary

- 

## Validation

- [ ] `bun install --frozen-lockfile`
- [ ] `bun run generate:migration-progress`
- [ ] `bun run typecheck`
- [ ] `bun run lint`
- [ ] `bun run test`
- [ ] `bun run validate:data`
- [ ] `bun run build`

## Safety Review

- [ ] No wallet-connect, signature, transaction, seed phrase, or private key flow added.
- [ ] No private RPC URL, API key, or secret can reach browser code, public JSON, or logs.
- [ ] RPC source labels are specific and safe.
- [ ] Contract addresses, migration outcome indexes, and official links were verified if changed.

