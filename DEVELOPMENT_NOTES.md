# UI

## Bootstrapping

Bootstrapped using instructions.
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

Installed skeleton package.
```
pnpm add -D @skeletonlabs/skeleton @skeletonlabs/skeleton-svelte

```

Added imports to `/src/routes/layout.css`.
```
@import '@skeletonlabs/skeleton';
@import '@skeletonlabs/skeleton-svelte';
@import '@skeletonlabs/skeleton/themes/cerberus';
```

Added `data-theme` attribute to `/src/app.html`.
```
<html data-theme="cerberus">
    <!-- ... -->
</html>
```

Run with `pnpm`.
```
pnpm run dev --open
```