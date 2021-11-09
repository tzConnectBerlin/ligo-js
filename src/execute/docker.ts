import { spawn } from 'child_process';
import path from 'path';

export const executeWithDocker = async (
  params: string[]
): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const currentWorkingDirectory = path.normalize(process.cwd());
    let dockerSpawn = spawn(
      'docker',
      [
        'run',
        `--platform=linux/amd64`,
        '-v',
        `${currentWorkingDirectory}:/project`,
        '--rm',
        '-i',
        'ligolang/ligo:next',
        ...params,
      ],
      {}
    );

    let stdout = '';
    let stderr = '';

    dockerSpawn.stdout.on('data', data => {
      stdout += data;
    });

    dockerSpawn.stderr.on('data', data => {
      stderr += data;
    });

    dockerSpawn.on('close', code => {
      if (code !== 0) {
        reject(stderr);
      }
      if (stderr.includes('warning')) {
        resolve(stderr);
      }
      resolve(stdout.trim());
    });
  });
};
