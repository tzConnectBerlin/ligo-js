import {
  compileExpression,
  CompileExpressionArguments,
  CompileExpressionOptions,
} from '../src';
import { checkAndInstall } from '../src/install';

const compileOptions: CompileExpressionOptions = {
  displayFormat: 'json',
  michelsonFormat: 'json',
};
const compileCorrectArgs: CompileExpressionArguments = {
  expression:
    '[%Michelson ({| { PUSH nat 42; DROP ; PUSH nat 1; ADD } |} : nat -> nat)]',
  syntax: 'pascaligo',
};

beforeAll(async () => {
  jest.setTimeout(50000);
  await checkAndInstall();
});

it('compile expression default -- no error/warning', async () => {
  const expected =
    '{"json_code":"[ { \\"prim\\": \\"PUSH\\", \\"args\\": [ { \\"prim\\": \\"nat\\" }, { \\"int\\": \\"42\\" } ] },\\n  { \\"prim\\": \\"DROP\\" },\\n  { \\"prim\\": \\"PUSH\\", \\"args\\": [ { \\"prim\\": \\"nat\\" }, { \\"int\\": \\"1\\" } ] },\\n  { \\"prim\\": \\"ADD\\" } ]"}';
  const result = await compileExpression(compileCorrectArgs, compileOptions);
  expect(JSON.stringify(JSON.parse(result ?? '{}'))).toBe(expected);
});

it('compile expression no opts -- no error/warning', async () => {
  const expected = '{ PUSH nat 42 ; DROP ; PUSH nat 1 ; ADD }';
  const result = await compileExpression(compileCorrectArgs);
  expect(result).toBe(expected);
});
