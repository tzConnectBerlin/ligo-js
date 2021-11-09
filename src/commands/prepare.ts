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
  initFile: 'init-file',
};

const DEFAULT_OPTIONS: CompileContractOptions = {
  format: 'human-readable',
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
  const commands = command.split(' ');
  const preparedOpts: string[] = Object.keys(compileOptions)
    .map((option: string) => {
      const optionCMDValue: string = OPTION_MAP[option] ?? option;
      if (NO_VALUE_OPTIONS.includes(optionCMDValue)) {
        if (compileOptions[option]) {
          return [`--${optionCMDValue}`];
        } else {
          return [];
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
        return [`--${optionCMDValue}`, filePath];
      }
      return [`--${optionCMDValue}`, `${compileOptions[option]}`];
    })
    .flat();
  if (commands[1] === 'expression') {
    const compileExpArgs = args as CompileExpressionArguments;
    return [
      ...commands,
      compileExpArgs.syntax,
      compileExpArgs.expression,
      ...preparedOpts,
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
  if (commands[1] === 'dry-run') {
    return [
      ...commands,
      ...preparedOpts,
      sourceFile,
      rest.entrypoint,
      rest.parameterExpression ?? 'undefined',
      rest.storageExpression ?? 'undefined',
    ];
  }
  if (commands[1] === 'contract') {
    return [
      ...commands,
      sourceFile,
      '--entry-point',
      rest.entrypoint,
      ...preparedOpts,
    ];
  }
  return [
    ...commands,
    sourceFile,
    rest.storageExpression ?? rest.parameterExpression ?? '',
    '--entry-point',
    rest.entrypoint,
    ...preparedOpts,
  ];
};
