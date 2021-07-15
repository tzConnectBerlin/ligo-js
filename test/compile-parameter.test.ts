import {
  compileParameter,
  CompileParameterArguments,
  CompileParameterOptions,
} from '../src';
import { checkAndInstall } from '../src/install';

const compileOptions: CompileParameterOptions = {
  displayFormat: 'json',
  michelsonFormat: 'json',
};
const compileCorrectArgs: CompileParameterArguments = {
  entrypoint: 'main',
  sourceFile: './test/fixtures/test.mligo',
  parameterExpression: 'Increment(5)',
};

beforeAll(async () => {
  jest.setTimeout(50000);
  await checkAndInstall();
});

it('compile parameter default -- no error/warning', async () => {
  const expected = {
    json_code:
      '{ "prim": "Left",\n  "args": [ { "prim": "Right", "args": [ { "int": "5" } ] } ] }',
  };
  const result = await compileParameter(compileCorrectArgs, compileOptions);
  expect(JSON.stringify(JSON.parse(result ?? '{}'))).toBe(
    JSON.stringify(expected)
  );
});

it('compile parameter no opts -- no error/warning', async () => {
  const expected = '(Left (Right 5))';
  const result = await compileParameter(compileCorrectArgs);
  expect(result).toBe(expected);
});
