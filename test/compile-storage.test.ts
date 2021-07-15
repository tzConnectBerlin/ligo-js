import {
  compileStorage,
  CompileStorageArguments,
  CompileStorageOptions,
} from '../src';
import { checkAndInstall } from '../src/install';

const compileOptions: CompileStorageOptions = {
  displayFormat: 'json',
  michelsonFormat: 'json',
};
const compileCorrectArgs: CompileStorageArguments = {
  entrypoint: 'main',
  sourceFile: './test/contracts/test.mligo',
  storageExpression: '5',
};

beforeAll(async () => {
  jest.setTimeout(50000);
  await checkAndInstall();
});

it('compile storage default -- no error/warning', async () => {
  const expected = '{"json_code":"{ \\"int\\": \\"5\\" }"}';
  const result = await compileStorage(compileCorrectArgs, compileOptions);
  expect(JSON.stringify(JSON.parse(result ?? '{}'))).toBe(expected);
});

it('compile storage no opts -- no error/warning', async () => {
  const expected = '5';
  const result = await compileStorage(compileCorrectArgs);
  expect(result).toBe(expected);
});

it('compile storage no opts with docker -- no error/warning', async () => {
  jest.setTimeout(50000);
  await checkAndInstall('next', true, undefined, undefined, true);
  const expected = '5';
  const result = await compileStorage(compileCorrectArgs, undefined, true);
  expect(result).toBe(expected);
});
