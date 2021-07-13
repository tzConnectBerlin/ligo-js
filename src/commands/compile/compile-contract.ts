import { CompileContractOptions, CompileContractArguments } from '../../types';
import { executeWithDocker } from '../../execute/docker';
import { DEFAULT_BIN_DIR, DEFAULT_BIN_NAME } from '../../globals';
import { executeWithBinary } from '../../execute/ligoBinary';
import { shouldUseDocker } from '../../utils';
import { prepare } from '../prepare';

const command = 'compile-contract';

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
