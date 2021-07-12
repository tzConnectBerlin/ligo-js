import { CompileStorageOptions, CompileStorageArguments } from './types';
import { executeWithDocker } from './docker';
import { shouldUseDocker } from './utils';
import { executeWithBinary } from './ligoBinary';
import { DEFAULT_BIN_DIR, DEFAULT_BIN_NAME } from './globals';
import { prepare } from './compile';

const command = 'compile-storage';

/**
 *
 * @param args arguments taken by compile-storage command
 * @param opts Options taken by compile storage command
 * @param useDocker should use docker to execute (default: false)
 * @returns string | undefined (depends on options)
 */
export const compileStorage = async (
  args: CompileStorageArguments,
  opts?: CompileStorageOptions,
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
