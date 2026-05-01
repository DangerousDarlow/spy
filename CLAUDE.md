# Spy — Claude Code Guide

## Project

Asymmetric social deduction game. Built as a learning exercise for Azure Static Web Applications and managed Azure Functions.

## Repo layout

```
api/      C# Azure Functions (isolated worker, .NET 9)
ui/       SvelteKit UI (pnpm workspace)
infra/    Azure Bicep + TypeScript deploy/provision scripts + docker-compose.yml for local dev
```

## API (`api/`)

- **Runtime:** Azure Functions v4, isolated worker, .NET 9
- **Framework:** `Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore`
- **Persistence:** Azure Cosmos DB via `Microsoft.Azure.Cosmos`
- **OpenAPI:** `Microsoft.Azure.WebJobs.Extensions.OpenApi`
- **JSON:** Both `System.Text.Json` and `Newtonsoft.Json` attributes are required on models — Cosmos SDK uses Newtonsoft, the Functions runtime uses STJ
- **Player identity:** Passed via `Player-Id` header; enforced by `PlayerIdHeaderMiddleware` and `[RequirePlayerIdHeader]` attribute
- **Environment variables:** `COSMOS_CONNECTION_STRING`, `COSMOS_DATABASE_NAME`, `COSMOS_GAMES_CONTAINER_NAME`
- **Local dev:** `infra/docker-compose.yml` runs Azurite (blob/queue/table, ports 10000–10002) and the Cosmos DB Linux emulator (port 8081); API runs on `http://localhost:7245`

### Domain model

```csharp
record Game(Guid Id, string Name, GameState State, DateTime CreatedAt, Guid CreatedBy, string[] Products, Guid[] Players)

enum GameState { PlayerRegistration, GameStarted, GameOver }
```

### Endpoints

| Function | Method | Path |
|----------|--------|------|
| Create   | POST   | /api/games (creates a game in Cosmos) |
| Double   | POST   | /api/double (math demo endpoint) |

## UI (`ui/`)

- **Framework:** Svelte 5, SvelteKit (static adapter — SSG only)
- **Styling:** Tailwind CSS v4, Skeleton UI v4
- **API client:** Generated from OpenAPI spec via `@hey-api/openapi-ts` with `@tanstack/svelte-query` plugin; output at `src/lib/api/client/`
- **i18n:** `@inlang/paraglide-js`
- **Package manager:** pnpm (workspace)

### Regenerate the API client

```bash
cd ui
pnpm openapi-ts   # API must be running at localhost:7071
```

### Scripts

```bash
pnpm dev          # dev server
pnpm build        # static build
pnpm check        # svelte-check + type check
pnpm lint         # prettier + eslint
pnpm test         # unit + e2e (playwright)
```

### Testing

Two Vitest projects run in parallel:

| Project | Environment | File pattern | What it covers |
|---------|-------------|--------------|----------------|
| `client` | Chromium (headless, via `vitest-browser-svelte`) | `*.svelte.spec.ts` | Svelte component tests |
| `server` | Node | `*.spec.ts` (not `*.svelte.*`) | Pure function unit tests |

E2E tests use Playwright directly (`e2e/` directory), not Vitest.

```bash
pnpm test:unit --run                      # all unit tests once (CI)
pnpm test:unit --run --project=client     # component tests only
pnpm test:unit --run --project=server     # unit tests only
pnpm test:e2e                             # Playwright E2E (requires built app)
```

Key conventions:
- Component tests use `page.getByLabelText()`, `page.getByRole()`, `expect.element()` from `vitest/browser` and `vitest-browser-svelte`
- `vi.mock('$lib', ...)` requires a **separate test file** per mock value — `vi.mock` is hoisted and can't be toggled between tests in the same file
- Module-level `$state` (e.g. `settings`) persists across tests within a file; reset it in `beforeEach`
- TanStack Query components need a `QueryClientProvider` wrapper — use a `*Wrapper.svelte` helper in the same directory

## Infra (`infra/`)

- **Local dev containers:** `docker-compose.yml` — Azurite + Cosmos DB emulator (vnext-preview)
- **Provisioning:** `node provision.ts` — creates resource group if needed, validates and applies Bicep
- **Deployment:** `node deploy.ts` — builds UI + API, gets SWA deployment token, deploys via Azure SWA CLI
- **Resources:** Azure Static Web App, Cosmos DB account/database/container
- **Naming convention:** `{name}-{environment}-swa`, `{name}-{environment}-cosmos`, etc.

> Note: API and UI are coupled — they must be deployed together via the SWA CLI.
