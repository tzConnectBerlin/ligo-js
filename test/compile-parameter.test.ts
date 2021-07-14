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

it('compile parameter default -- no error/warning', async () => {
  jest.setTimeout(50000);
  await checkAndInstall();
  const expected = {
    json_code:
      '{ "prim": "Left",\n  "args": [ { "prim": "Right", "args": [ { "int": "5" } ] } ] }',
  };
  const result = await compileParameter(compileCorrectArgs, compileOptions);
  expect(JSON.stringify(JSON.parse(result ?? '{}'))).toBe(
    JSON.stringify(expected)
  );
});
