import { DryRunArguments, DryRunOptions } from '../types';
import { executeWithDocker } from '../execute/docker';
import { shouldUseDocker } from '../utils';
import { executeWithBinary } from '../execute/ligoBinary';
import { DEFAULT_BIN_DIR, DEFAULT_BIN_NAME } from '../globals';
import { prepare } from './prepare';

const command = 'dry-run';

/**
 *
 * @param args arguments taken by dry-run command
 * @param opts Options taken by dry-run command
 * @param useDocker should use docker to execute (default: false)
 * @returns string | undefined (depends on options)
 */
export const dryRun = async (
  args: DryRunArguments,
  opts?: DryRunOptions,
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
