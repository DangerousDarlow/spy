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
<html data-theme="cerberus">
    <!-- ... -->
</html>
```

## Local Development

To run locally see the [local run instructions](/LOCALRUN.md).

## Production Preview

Build & preview production package.

```sh
pnpm build
pnpm preview
```
