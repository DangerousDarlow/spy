# UI

## Bootstrap

Bootstrap using instructions.
https://www.skeleton.dev/docs/svelte/get-started/installation/sveltekit

Specifically `npx sv create --types ts ui` picking options

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
```
pnpm add -D @skeletonlabs/skeleton @skeletonlabs/skeleton-svelte

```

Add imports to `/src/routes/layout.css`.
```
@import '@skeletonlabs/skeleton';
@import '@skeletonlabs/skeleton-svelte';
@import '@skeletonlabs/skeleton/themes/cerberus';
```

Add `data-theme` attribute to `/src/app.html`.
```
<html data-theme="cerberus">
    <!-- ... -->
</html>
```

## Local Development

Run with
```sh
pnpm dev -- --open
```

## Build

Build production package with
```sh
pnpm build
```