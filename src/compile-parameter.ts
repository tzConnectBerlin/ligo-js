import { CompileParameterOptions, CompileParameterArguments } from './types';
import { executeWithDocker } from './docker';
import { DEFAULT_BIN_DIR, DEFAULT_BIN_NAME } from './globals';
import { executeWithBinary } from './ligoBinary';
import { shouldUseDocker } from './utils';
import { prepare } from './compile';

const command = 'compile-parameter';

/**
 *
 * @param args arguments taken by compile-parameter command
 * @param opts Options taken by compile parameter command
 * @param useDocker should use docker to execute (default: false)
 * @returns string | undefined (depends on options)
 */
export const compileParameter = async (
  args: CompileParameterArguments,
  opts?: CompileParameterOptions,
  useDocker = false
) => {
  try {
    const docker = shouldUseDocker() || useDocker;
    const params = prepare(command, args, opts, docker);
    if (docker) {
      return await executeWithDocker(params);
    } else {
      return await executeWithBinary(DEFAULT_BIN_DIR, DEFAULT_BIN_NAME, params);
    }
  } catch (error) {
    throw Error(error);
  }
};
