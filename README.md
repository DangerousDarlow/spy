# Spy

An asymmetric social deduction game.

Spy has been written primarily as a learning exercise to explore Azure static web applications & functions.

## Static Web Applications

A static web application is a web application where the content is delivered to the browser as prebuilt files and no server-side code runs to generate pages at request time.

This application uses [Svelte](https://svelte.dev/), [SvelteKit](https://svelte.dev/docs/kit/introduction) and [Skeleton UI](https://www.skeleton.dev/).

Svelte is a front end framework. It is a compiled rather than runtime framework. This makes it high performance and bundle sizes small. It is cleaner and more intuitive than other frameworks I have used.

SvelteKit is an application framework built on top of Svelte. It adds functionality needed for web applications like routing. It also supports static site generation which I use because Spy UI is a static web application.

Skeleton UI component and design system built for Svelte and Tailwind CSS. Making things look good and consistent is not where I add value.

## Api

A static web application can be useful however a lot of value like multi-tenancy and persistence depends on back end code execution. An Azure static web application can have [managed Azure functions](https://learn.microsoft.com/en-us/azure/static-web-apps/apis-functions) deployed with it. Managed functions have some limitations a significant one being that only the consumption hosting plan is supported. This means cold starts when an API call is made after a sustained period of inactivity resulting in a delay of approximately 5 seconds before the first response is received.

## Provisioning

Azure resources are provisioned using Bicep. Utility script `provision.ts` does the following

- Check if the Azure resource group exists
	- Create it if it does not
- Validate Bicep files
- Provision resources

Run the script with

```
cd infra
node provision.ts
```

## Deployment

Utility script `deploy.ts` does the following

- Build the UI using `pnpm build`
- Build the API using `dotnet publish`
- Get an Azure deployment token
- Deploy the static web application and API using the Azure static web apps CLI

Note that the API is coupled to the static web app. You cannot deploy them independently. If you deploy just the static web app

Run the script with

```
cd infra
node deploy.ts
```