import path from 'path';
import { CompileContractOptions, CompileContractArguments } from './types';
import { executeWithDocker } from './docker';
import { StringIndex } from './types';

const NO_VALUE_OPTIONS = ['infer', 'version', 'disable-michelson-typechecking'];

const OPTION_MAP: StringIndex = {
  disableMichelsonTypeChecking: 'disable-michelson-typechecking',
  michelsonFormat: 'michelson-format',
  outputFile: 'output-file',
  displayFormat: 'display-format',
};

const DEFAULT_OPTIONS: CompileContractOptions = {
  displayFormat: 'human-readable',
  michelsonFormat: 'text',
};

const command = 'compile-contract';

/**
 *
 * @param args arguments taken by compile-contract command
 * @param opts Options taken by compile contract command
 * @param useDocker should prepare commands compatible with docker (default: false)
 * @returns string array of command line params that can be passed to compile-contract
 */
export const prepare = (
  args: CompileContractArguments,
  opts?: CompileContractOptions,
  useDocker = false
): string[] => {
  const compileOptions: CompileContractOptions = {
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
  let { sourceFile, ...rest } = args;
  if (useDocker) {
    let currentWorkingDirectory = path.normalize(process.cwd());
    const sourcePath = path.normalize(sourceFile);

    sourceFile = path
      .normalize('/project/' + sourcePath.replace(currentWorkingDirectory, ''))
      .replace(/\\/g, '/');
  }
  return [command, ...preparedOpts, sourceFile, rest.entrypoint];
};

/**
 *
 * @param args arguments taken by compile-contract command
 * @param opts Options taken by compile contract command
 * @param useDocker should use docker to execute (default: false)
 * @returns string | undefined (depends on options)
 */
export const compileContract = async (
  args: CompileContractArguments,
  opts?: CompileContractOptions,
  useDocker = false
) => {
  if (useDocker) {
    try {
      const result = await executeWithDocker(prepare(args, opts, useDocker));
      return result;
    } catch (error) {
      throw Error(error);
    }
  } else {
    throw Error('Binary execution is not implemented');
  }
};
