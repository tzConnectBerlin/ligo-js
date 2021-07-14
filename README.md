# Ligo-js

> A JavaScript/TypeScript wrapper for [Ligo](https://ligolang.org/)

[![CircleCI](https://circleci.com/gh/tzConnectBerlin/ligo-js/tree/main.svg?style=svg&circle-token=24cb837cbe8ce091c59c3a77c598fc3c4bd152f8)](https://circleci.com/gh/tzConnectBerlin/ligo-js/tree/main)

[![codecov](https://codecov.io/gh/tzConnectBerlin/ligo-js/branch/main/graph/badge.svg?token=YZHWODI8VN)](https://codecov.io/gh/tzConnectBerlin/ligo-js)

## Prerequisite

**For Windows or Mac please install DOCKER before installing this.**
**For Windows enable support for Linux containers"

## Available Scripts

- `build` to build the package in `dist` folder.
- `test` to run the tests
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
- [x] compile-expression => `compileExpression`
- [x] dry-run => `dryRun`
- [ ] evaluate-expr
- [ ] evaluate-call
- [ ] measure-contract
