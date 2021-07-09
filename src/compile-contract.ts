import path from 'path';
import { executeWithDocker } from './docker';

type DisplayFormat = 'dev' | 'json' | 'human-readable';
type Help = 'auto' | 'pager' | 'groff' | 'plain';
type MichelsonFormat = 'text' | 'json' | 'hex';
type Syntax = 'pascaligo' | 'cameligo' | 'reasonligo' | 'jsligo';

interface StringIndex {
  [key: string]: string;
}

export interface CompileContractArguments {
  entrypoint: string;
  sourceFile: string;
}

export interface CompileContractOptions {
  disableMichelsonTypeChecking?: boolean;
  displayFormat?: DisplayFormat;
  infer?: boolean;
  michelsonFormat?: MichelsonFormat;
  outputFile?: string;
  protocol?: string;
  syntax?: Syntax;
  warn?: boolean;
  [key: string]:
    | string
    | boolean
    | DisplayFormat
    | Help
    | MichelsonFormat
    | Syntax
    | undefined;
}
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

export const command = 'compile-contract';

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
        let filePath = path.normalize(compileOptions[option] as any);
        if (useDocker) {
          filePath = path.normalize(
            ('/project/' + compileOptions[option]) as any
          );
        }
        return `--${optionCMDValue}=${filePath}`;
      }
      return `--${optionCMDValue}=${compileOptions[option]}`;
    }
  );
  let source = args.sourceFile;
  if (useDocker) {
    let currentWorkingDirectory = path.normalize(process.cwd());
    const sourcePath = path.normalize(source);

    source = path
      .normalize('/project/' + sourcePath.replace(currentWorkingDirectory, ''))
      .replace(/\\/g, '/');
  }
  return [command, ...preparedOpts, source, args.entrypoint];
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
