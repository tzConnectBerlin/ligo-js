import path from 'path';
import fs from 'fs';
import {
  compileContract,
  CompileContractArguments,
  CompileContractOptions,
} from '../src';
import { checkAndInstall } from '../src/install';

beforeAll(async () => {
  jest.setTimeout(50000);
  await checkAndInstall();
});

it('compile contracts -- no error/warning', async () => {
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
  console.log(filePath);
  expect(fs.existsSync(filePath)).toBe(true);
});
