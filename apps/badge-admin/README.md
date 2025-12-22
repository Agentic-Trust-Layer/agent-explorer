### Badge Admin env vars

Create `apps/badge-admin/.env`:

```bash
VITE_BADGE_ADMIN_GRAPHQL_URL=http://localhost:4000/graphql
VITE_BADGE_ADMIN_ACCESS_CODE=your_access_code_here
```

Then run:

```bash
pnpm --filter badge-admin dev
```


