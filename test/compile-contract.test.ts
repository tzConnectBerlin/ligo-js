import path from 'path';
import fs from 'fs';
import {
  compileContract,
  CompileContractArguments,
  CompileContractOptions,
} from '../src';
import { checkAndInstall } from '../src/install';

it('compile contracts default -- no error/warning', async () => {
  jest.setTimeout(50000);
  await checkAndInstall();
  const compileOptions: CompileContractOptions = {
    displayFormat: 'json',
    michelsonFormat: 'json',
    outputFile: './test/fixtures/test.mligo.json',
  };
  const compileArgs: CompileContractArguments = {
    entrypoint: 'main',
    sourceFile: './test/fixtures/test.mligo',
  };
  await compileContract(compileArgs, compileOptions);
  const filePath = path.normalize(
    process.cwd() + '/test/fixtures/test.mligo.json'
  );
  expect(fs.existsSync(filePath)).toBe(true);
});

it('compile contracts useDocker -- no error/warning', async () => {
  jest.setTimeout(50000);
  await checkAndInstall('next', true, undefined, undefined, true);
  const compileOptions: CompileContractOptions = {
    displayFormat: 'json',
    michelsonFormat: 'json',
    outputFile: './test/fixtures/test.mligo.json',
  };
  const compileArgs: CompileContractArguments = {
    entrypoint: 'main',
    sourceFile: './test/fixtures/test.mligo',
  };
  await compileContract(compileArgs, compileOptions, true);
  const filePath = path.normalize(
    process.cwd() + '/test/fixtures/test.mligo.json'
  );
  expect(fs.existsSync(filePath)).toBe(true);
});
