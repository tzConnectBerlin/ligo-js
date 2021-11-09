import path from 'path';
import fs from 'fs';
import {
  compileContract,
  CompileContractArguments,
  CompileContractOptions,
} from '../src';
import { checkAndInstall } from '../src/install';

const compileOptions: CompileContractOptions = {
  format: 'json',
  michelsonFormat: 'json',
  outputFile: './test/contracts/test.mligo.json',
};
const compileCorrectArgs: CompileContractArguments = {
  entrypoint: 'main',
  sourceFile: './test/contracts/test.mligo',
};

const compileWarnArgs: CompileContractArguments = {
  entrypoint: 'main',
  sourceFile: './test/contracts/test-warn.mligo',
};

const compileErrorArgs: CompileContractArguments = {
  entrypoint: 'main',
  sourceFile: './test/contracts/test-error.mligo',
};

beforeAll(async () => {
  jest.setTimeout(50000);
  await checkAndInstall();
});

it('compile contracts default -- no error/warning', async () => {
  await compileContract(compileCorrectArgs, compileOptions);
  const filePath = path.normalize(
    process.cwd() + '/test/contracts/test.mligo.json'
  );
  expect(fs.existsSync(filePath)).toBe(true);
});

it('compile contracts default -- with warning', async () => {
  const warning = await compileContract(compileWarnArgs, compileOptions);
  const filePath = path.normalize(
    process.cwd() + '/test/contracts/test.mligo.json'
  );
  expect(fs.existsSync(filePath)).toBe(true);
  expect(JSON.parse(warning ?? '{}').status).toEqual('warning');
});

it('compile contracts default -- with error', async () => {
  await expect(async () => {
    try {
      await compileContract(compileErrorArgs, compileOptions);
    } catch (error) {
      throw Error(error as any);
    }
  }).rejects.toThrow();
});

it('compile contracts useDocker -- no error/warning', async () => {
  jest.setTimeout(50000);
  await checkAndInstall('next', true, undefined, undefined, true);
  await compileContract(compileCorrectArgs, compileOptions, true);
  const filePath = path.normalize(
    process.cwd() + '/test/contracts/test.mligo.json'
  );
  expect(fs.existsSync(filePath)).toBe(true);
});
