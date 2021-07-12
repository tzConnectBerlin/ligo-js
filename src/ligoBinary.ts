import { spawn } from 'child_process';
import { getBinaryPath } from './utils';

export const executeWithBinary = async (
  binDirectory: string,
  binName: string,
  params: string[]
): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const ligo = getBinaryPath(binDirectory, binName);

    let ligoSpawn = spawn(ligo, [...params]);

    let stdout = '';
    let stderr = '';

    ligoSpawn.stdout.on('data', data => {
      stdout += data;
    });

    ligoSpawn.stderr.on('data', data => {
      stderr += data;
    });

    ligoSpawn.on('close', code => {
      if (code != 0 || stderr.trim() != '') {
        if (stderr.includes('Warning')) {
          resolve(stderr);
        } else {
          reject(stderr);
        }
      }
      resolve(stdout.trim());
    });
  });
};
