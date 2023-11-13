## Import shared lib

Add to yours project `tsconfig.json` new paths alias.
```js
{
  "compilerOptions": {
    "paths": {
      "@shared/": [
        "../libs" // relative path to the lib
      ],
      "@shared/*": [
        "../libs/*" // relative path to the lib
      ]
    }
  }
}
```
