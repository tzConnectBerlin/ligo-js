import { CompileStorageOptions, CompileStorageArguments } from '../../types';
import { executeWithDocker } from '../../execute/docker';
import { shouldUseDocker } from '../../utils';
import { executeWithBinary } from '../../execute/ligoBinary';
import { DEFAULT_BIN_DIR, DEFAULT_BIN_NAME } from '../../globals';
import { prepare } from '../prepare';

const command = 'compile storage';

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
  const docker = shouldUseDocker() || useDocker;
  const params = prepare(command, args, opts, docker);
  if (docker) {
    return await executeWithDocker(params);
  } else {
    return await executeWithBinary(DEFAULT_BIN_DIR, DEFAULT_BIN_NAME, params);
  }
};
