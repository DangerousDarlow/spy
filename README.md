# Spy

An asymmetric social deduction game.

Spy has been written primarily as a learning exercise to explore Azure static web applications & functions.

This project has components

- [ui](ui/README.md)
- [api](/api/README.md)
- [infra](infra/README.md)

To run locally see the [local run instructions](/LOCALRUN.md).
## [ui](ui/README.md)

Static web application front end.

Content is delivered to the browser as prebuilt files and no server-side code runs to generate pages at request time.

## [api](/api/README.md)

Azure functions back end.

A static web application can be useful however a lot of value like multi-tenancy and persistence depends on back end code execution. Azure functions implement this backend functionality at low cost.

## [infra](/infra/README.md)

Scripts to provision Azure resources and support local development.