import { postInstall } from './install';

postInstall();

export { compileContract } from './compile-contract';
export { compileStorage } from './compile-storage';
export { compileParameter } from './compile-parameter';
export { dryRun } from './dry-run';
export * from './types';
