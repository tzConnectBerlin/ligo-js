import path from 'path';
import { CompileContractOptions, CompileStorageOptions, StringIndex } from '..';
import {
  CompileArguments,
  CompileExpressionArguments,
  CompileExpressionOptions,
  CompileParameterOptions,
  DryRunArguments,
  DryRunOptions,
} from '../types';

const NO_VALUE_OPTIONS = ['infer', 'version', 'disable-michelson-typechecking'];

const OPTION_MAP: StringIndex = {
  disableMichelsonTypeChecking: 'disable-michelson-typechecking',
  michelsonFormat: 'michelson-format',
  outputFile: 'output-file',
  displayFormat: 'display-format',
  initFile: 'init-file',
};

const DEFAULT_OPTIONS: CompileContractOptions = {
  displayFormat: 'human-readable',
  michelsonFormat: 'text',
};

type ArgTypes = CompileArguments | DryRunArguments | CompileExpressionArguments;

type OptionTypes =
  | CompileContractOptions
  | CompileStorageOptions
  | CompileParameterOptions
  | CompileExpressionOptions
  | DryRunOptions;

export const prepare = (
  command: string,
  args: ArgTypes,
  opts?: OptionTypes,
  useDocker = false
): string[] => {
  const compileOptions: OptionTypes = {
    ...DEFAULT_OPTIONS,
    ...opts,
  };
  const preparedOpts: string[] = Object.keys(compileOptions).map(
    (option: string) => {
      const optionCMDValue: string = OPTION_MAP[option] ?? option;
      if (NO_VALUE_OPTIONS.includes(optionCMDValue)) {
        if (compileOptions[option]) {
          return `--${optionCMDValue}`;
        } else {
          return '';
        }
      }
      if (
        option === 'outputFile' &&
        typeof compileOptions[option] === 'string'
      ) {
        const outputOpt = compileOptions[option] as string;
        const filePath = path.normalize(
          useDocker ? `/project/${outputOpt}` : outputOpt
        );
        return `--${optionCMDValue}=${filePath}`;
      }
      return `--${optionCMDValue}=${compileOptions[option]}`;
    }
  );
  if (command === 'compile-expression') {
    const compileExpArgs = args as CompileExpressionArguments;
    return [
      command,
      ...preparedOpts,
      compileExpArgs.syntax,
      compileExpArgs.expression,
    ];
  }
  let { sourceFile, ...rest } = args as CompileArguments;
  if (useDocker) {
    let currentWorkingDirectory = path.normalize(process.cwd());
    const sourcePath = path.normalize(sourceFile);

    sourceFile = path
      .normalize('/project/' + sourcePath.replace(currentWorkingDirectory, ''))
      .replace(/\\/g, '/');
  }
  if (command === 'dry-run') {
    return [
      command,
      ...preparedOpts,
      sourceFile,
      rest.entrypoint,
      rest.parameterExpression ?? 'undefined',
      rest.storageExpression ?? 'undefined',
    ];
  }
  return [
    command,
    ...preparedOpts,
    sourceFile,
    rest.entrypoint,
    rest.storageExpression ?? rest.parameterExpression ?? '',
  ];
};
