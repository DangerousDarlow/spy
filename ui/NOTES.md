Deployment works
```
npx @azure/static-web-apps-cli deploy ./dist --api-location ./build --api-language dotnetisolated --api-version 9.0 --deployment-token {my token} --env production
```

Note that the language is `dotnetisolated` not `dotnet-isolated` as the documentation suggests. What a pain!