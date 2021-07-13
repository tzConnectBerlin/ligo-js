import { spawn } from 'child_process';
import { getBinaryPath } from '../utils';

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
      const err = stderr.trim();
      if (code !== 0 || !['', '[]'].includes(err)) {
        if (err.includes('Warning')) {
          resolve(err);
        } else {
          reject(['', '[]'].includes(err) ? stdout : err);
        }
      }
      resolve(stdout.trim());
    });
  });
};
