import { postInstall } from './install';

postInstall();

export { compileContract } from './commands/compile/compile-contract';
export { compileStorage } from './commands/compile/compile-storage';
export { compileParameter } from './commands/compile/compile-parameter';
export { compileExpression } from './commands/compile/compile-expression';
export { dryRun } from './commands/run/dry-run';
export * from './types';
