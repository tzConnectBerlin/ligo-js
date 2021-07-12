# Ligo-js

> A JavaScript/TypeScript wrapper for [Ligo](https://ligolang.org/)

## Prerequisite

**For Windows or Mac please install DOCKER before installing this.**

## Available Scripts

- `build` to build the package in `dist` folder.
- `test` to run the tests (if any)
- `lint` to run the linter
- `size-limit` to see the size of the package
- `analyze` to show the deps and source size in browser
- `prepare` npm prepare hook that executes `build`
- `postinstall` npm post install hook to setup necessary env for Ligo to work.

### How `postinstall` works

Checks if the platform is one of 3: `win32`, `darwin` or `linux`.

- If `linux` then installs the linux binary.
- If `win32` or `darwin` then pulls the latest ligo docker image.

## Available Methods

- [x] compile-contract => `compileContract`
- [x] compile-storage => `compileStorage`
- [x] compile-parameter => `compileParameter`
- [ ] compile-expression
- [ ] dry-run
- [ ] evaluate-expr
- [ ] evaluate-call
- [ ] measure-contract
