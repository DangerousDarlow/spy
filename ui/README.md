# ui

This static web application uses [Svelte](https://svelte.dev/), [SvelteKit](https://svelte.dev/docs/kit/introduction) and [Skeleton UI](https://www.skeleton.dev/).

Svelte is a front end framework. It is a compiled rather than runtime framework. This makes it high performance and bundle sizes small. It is cleaner and more intuitive than other frameworks I have used.

SvelteKit is an application framework built on top of Svelte. It adds functionality needed for web applications like routing. It supports static site generation which I use because Spy UI is a static web application.

Skeleton UI component and design system built for Svelte and Tailwind CSS. Making things look good and consistent is not where I add value.

## Bootstrap

Bootstrap using [instructions](https://www.skeleton.dev/docs/svelte/get-started/installation/sveltekit). Specifically `npx sv create --types ts ui` picking options

- prettier
- eslint
- vitest
  - unit testing
- playwright
- tailwindcss
  - typography
  - forms
- sveltekit-adapter
  - static
- devtools-json
- paraglide
  - en-gb
  - demo
- pnpm

Install skeleton package.

```sh
pnpm add -D @skeletonlabs/skeleton @skeletonlabs/skeleton-svelte
```

Add imports to `/src/routes/layout.css`.

```css
@import '@skeletonlabs/skeleton';
@import '@skeletonlabs/skeleton-svelte';
@import '@skeletonlabs/skeleton/themes/cerberus';
```

Add `data-theme` attribute to `/src/app.html`.

```html
<html lang="en-GB" data-theme="cerberus">
	<!-- ... -->
</html>
```

## Local Development

To run locally see the [local run instructions](../LOCALRUN.md).

## Production Preview

Build & preview production package.

```sh
pnpm build
pnpm preview
```

## Testing

The project has three layers of tests:

| Layer     | Tool                                        | Scope                             |
| --------- | ------------------------------------------- | --------------------------------- |
| Unit      | Vitest (Node)                               | Pure TypeScript functions         |
| Component | Vitest + `vitest-browser-svelte` (Chromium) | Svelte components                 |
| E2E       | Playwright                                  | Full user journeys in a built app |

### Running tests

```sh
pnpm test                                 # unit + E2E (full suite, used in CI)
pnpm test:unit --run                      # all unit tests once
pnpm test:unit --run --project=client     # component tests only (Chromium)
pnpm test:unit --run --project=server     # unit tests only (Node)
pnpm test:e2e                             # Playwright E2E (builds app first)
pnpm test:unit                            # unit tests in watch mode
```

First-time setup: Playwright browsers must be installed before component or E2E tests can run.

```sh
pnpm exec playwright install chromium
```

### File naming conventions

- `src/**/*.svelte.spec.ts` — component tests, run in Chromium via `vitest-browser-svelte`
- `src/**/*.spec.ts` (no `.svelte.`) — unit tests, run in Node
- `e2e/**/*.spec.ts` — Playwright E2E tests

### Component test patterns

Component tests use `render` from `vitest-browser-svelte` and the `page` locator API from `vitest/browser`.

```ts
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

render(MyComponent);
await expect.element(page.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
await page.getByLabelText('Name').fill('Nick');
```

Available locators on `page`: `getByRole`, `getByLabelText`, `getByText`, `getByTitle`, `getByPlaceholder`, `getByTestId`, `getByAltText`.

Locators returned by `page.getBy*()` support `.elements()` (sync array of `HTMLElement`), `.all()` (array of `Locator`), `.nth(n)`, `.first()`, `.last()`, and `.fill()` / `.click()`.

### Mocking notes

- `vi.mock('$lib', ...)` can override individual barrel exports (e.g. `dev`) while preserving the rest via `importOriginal`
- A single `vi.mock` value applies for the entire file — to test different values of the same import, use separate spec files (e.g. `Settings.svelte.spec.ts` for dev mode, `Settings.prod.svelte.spec.ts` for production mode)
- Components using TanStack Query need a `QueryClientProvider` — wrap them in a `*Wrapper.svelte` helper in the same directory
