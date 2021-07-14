import path from 'path';
import fs from 'fs';
import {
  compileContract,
  CompileContractArguments,
  CompileContractOptions,
} from '../src';
import { checkAndInstall } from '../src/install';

const compileOptions: CompileContractOptions = {
  displayFormat: 'json',
  michelsonFormat: 'json',
  outputFile: './test/fixtures/test.mligo.json',
};
const compileCorrectArgs: CompileContractArguments = {
  entrypoint: 'main',
  sourceFile: './test/fixtures/test.mligo',
};

const compileWarnArgs: CompileContractArguments = {
  entrypoint: 'main',
  sourceFile: './test/fixtures/test-warn.mligo',
};

const compileErrorArgs: CompileContractArguments = {
  entrypoint: 'main',
  sourceFile: './test/fixtures/test-error.mligo',
};

it('compile contracts default -- no error/warning', async () => {
  jest.setTimeout(50000);
  await checkAndInstall();
  await compileContract(compileCorrectArgs, compileOptions);
  const filePath = path.normalize(
    process.cwd() + '/test/fixtures/test.mligo.json'
  );
  expect(fs.existsSync(filePath)).toBe(true);
});

it('compile contracts useDocker -- no error/warning', async () => {
  jest.setTimeout(50000);
  await checkAndInstall('next', true, undefined, undefined, true);
  await compileContract(compileCorrectArgs, compileOptions, true);
  const filePath = path.normalize(
    process.cwd() + '/test/fixtures/test.mligo.json'
  );
  expect(fs.existsSync(filePath)).toBe(true);
});

it('compile contracts default -- with warning', async () => {
  jest.setTimeout(50000);
  await checkAndInstall();
  const warning = await compileContract(compileWarnArgs, compileOptions);
  const filePath = path.normalize(
    process.cwd() + '/test/fixtures/test.mligo.json'
  );
  expect(fs.existsSync(filePath)).toBe(true);
  expect(JSON.parse(warning ?? '{}')[0].status).toEqual('warning');
});

it('compile contracts default -- with error', async () => {
  jest.setTimeout(50000);
  await checkAndInstall();
  await expect(async () => {
    try {
      await compileContract(compileErrorArgs, compileOptions);
    } catch (error) {
      throw Error(error);
    }
  }).rejects.toThrow();
});
