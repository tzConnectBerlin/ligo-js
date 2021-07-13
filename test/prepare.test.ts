import {
  CompileContractArguments,
  CompileContractOptions,
  CompileExpressionArguments,
  CompileExpressionOptions,
  CompileParameterArguments,
  CompileParameterOptions,
  CompileStorageArguments,
  CompileStorageOptions,
  DryRunArguments,
  DryRunOptions,
} from '../src';
import { prepare } from '../src/commands/prepare';

describe('prepares arguments for compile-contract', () => {
  it('prepares valid args for binary', () => {
    const compileOptions: CompileContractOptions = {
      disableMichelsonTypeChecking: false,
      displayFormat: 'json',
      infer: true,
      michelsonFormat: 'json',
      outputFile: './fake/file.json',
      protocol: 'edo',
      syntax: 'cameligo',
      warn: true,
    };
    const compileArgs: CompileContractArguments = {
      entrypoint: 'main',
      sourceFile: './fake/file.mligo',
    };
    const args = prepare('compile-contract', compileArgs, compileOptions);
    expect(args.join(' ').trim()).toEqual(
      'compile-contract --display-format=json --michelson-format=json  --infer --output-file=fake/file.json --protocol=edo --syntax=cameligo --warn=true ./fake/file.mligo main'
    );
  });
  it('prepares valid args for docker', () => {
    const compileOptions: CompileContractOptions = {
      disableMichelsonTypeChecking: false,
      displayFormat: 'json',
      infer: true,
      michelsonFormat: 'json',
      outputFile: './fake/file.json',
      protocol: 'edo',
      syntax: 'cameligo',
      warn: true,
    };
    const compileArgs: CompileContractArguments = {
      entrypoint: 'main',
      sourceFile: './fake/file.mligo',
    };
    const args = prepare('compile-contract', compileArgs, compileOptions, true);
    expect(args.join(' ').trim()).toEqual(
      'compile-contract --display-format=json --michelson-format=json  --infer --output-file=/project/fake/file.json --protocol=edo --syntax=cameligo --warn=true /project/fake/file.mligo main'
    );
  });
  it('prepares valid args without flags', () => {
    const compileOptions: CompileContractOptions = {
      displayFormat: 'json',
      michelsonFormat: 'json',
      outputFile: './fake/file.json',
      protocol: 'edo',
      syntax: 'cameligo',
    };
    const compileArgs: CompileContractArguments = {
      entrypoint: 'main',
      sourceFile: './fake/file.mligo',
    };
    const args = prepare('compile-contract', compileArgs, compileOptions);
    expect(args.join(' ').trim()).toEqual(
      'compile-contract --display-format=json --michelson-format=json --output-file=fake/file.json --protocol=edo --syntax=cameligo ./fake/file.mligo main'
    );
  });
});

describe('prepares arguments for compile-expression', () => {
  test('prepares valid arguments', () => {
    const compileOptions: CompileExpressionOptions = {
      initFile: './fake/init/file',
    };
    const compileArgs: CompileExpressionArguments = {
      expression: '{}',
      syntax: 'cameligo',
    };
    const args = prepare('compile-expression', compileArgs, compileOptions);
    expect(args.join(' ')).toEqual(
      'compile-expression --display-format=human-readable --michelson-format=text --init-file=./fake/init/file cameligo {}'
    );
  });
});

describe('prepares arguments for compile-storage', () => {
  test('prepares valid arguments', () => {
    const compileOptions: CompileStorageOptions = {
      amount: 1,
      balance: 10,
      displayFormat: 'json',
      infer: true,
      michelsonFormat: 'json',
      now: '2021-07-13T11:05:54.986Z',
      outputFile: './fake/outputFile.json',
      protocol: 'edo',
      sender: 'tz11111111',
      source: 'fakeSource',
      syntax: 'cameligo',
      warn: true,
    };
    const compileArgs: CompileStorageArguments = {
      entrypoint: 'main',
      storageExpression: '{}',
      sourceFile: './fake/file.mligo',
    };
    const args = prepare('compile-storage', compileArgs, compileOptions);
    expect(args.join(' ')).toEqual(
      'compile-storage --display-format=json --michelson-format=json --amount=1 --balance=10 --infer --now=2021-07-13T11:05:54.986Z --output-file=fake/outputFile.json --protocol=edo --sender=tz11111111 --source=fakeSource --syntax=cameligo --warn=true ./fake/file.mligo main {}'
    );
  });
});

describe('prepares arguments for compile-parameter', () => {
  test('prepares valid arguments', () => {
    const compileOptions: CompileParameterOptions = {
      amount: 1,
      balance: 10,
      displayFormat: 'json',
      infer: true,
      michelsonFormat: 'json',
      now: '2021-07-13T11:05:54.986Z',
      outputFile: './fake/outputFile.json',
      protocol: 'edo',
      sender: 'tz11111111',
      source: 'fakeSource',
      syntax: 'cameligo',
      warn: true,
    };
    const compileArgs: CompileParameterArguments = {
      entrypoint: 'main',
      sourceFile: './fake/file.mligo',
      parameterExpression: '{param exp}',
    };
    const args = prepare('compile-parameter', compileArgs, compileOptions);
    expect(args.join(' ')).toEqual(
      'compile-parameter --display-format=json --michelson-format=json --amount=1 --balance=10 --infer --now=2021-07-13T11:05:54.986Z --output-file=fake/outputFile.json --protocol=edo --sender=tz11111111 --source=fakeSource --syntax=cameligo --warn=true ./fake/file.mligo main {param exp}'
    );
  });
});

describe('prepares arguments for dry-run', () => {
  test('prepares valid arguments', () => {
    const compileOptions: DryRunOptions = {
      amount: 1,
      balance: 10,
      displayFormat: 'json',
      infer: true,
      michelsonFormat: 'json',
      now: '2021-07-13T11:05:54.986Z',
      outputFile: './fake/outputFile.json',
      protocol: 'edo',
      sender: 'tz11111111',
      source: 'fakeSource',
      syntax: 'cameligo',
      warn: true,
    };
    const compileArgs: DryRunArguments = {
      entrypoint: 'main',
      sourceFile: './fake/file.mligo',
      parameterExpression: '{param exp}',
      storageExpression: '{storage exp}',
    };
    const args = prepare('dry-run', compileArgs, compileOptions);
    expect(args.join(' ')).toEqual(
      'dry-run --display-format=json --michelson-format=json --amount=1 --balance=10 --infer --now=2021-07-13T11:05:54.986Z --output-file=fake/outputFile.json --protocol=edo --sender=tz11111111 --source=fakeSource --syntax=cameligo --warn=true ./fake/file.mligo main {param exp} {storage exp}'
    );
  });
});
