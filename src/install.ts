import https from 'https';
import fs from 'fs';
import { spawn, exec } from 'child_process';
import {
  DEFAULT_BIN_NAME,
  DEFAULT_BIN_DIR,
  LIGO_PATH,
  DEFAULT_INSTALL_VERSION,
} from './globals';
import { getBinaryDirectory, getBinaryPath, shouldUseDocker } from './utils';

export const checkIfDockerImageExists = async (
  version: string
): Promise<boolean> => {
  return new Promise(resolve => {
    exec(`docker image inspect ligolang/ligo:${version}`, err => {
      if (err) {
        resolve(false);
      }
      resolve(true);
    });
  });
};

export const downloadLinuxBinary = (path: string): Promise<string> => {
  return new Promise(resolve => {
    const binaryFile = fs.createWriteStream(path, {
      encoding: 'binary',
      mode: 0o755,
    });
    https.get(LIGO_PATH, res => {
      res.pipe(binaryFile);
      binaryFile.on('finish', () => {
        binaryFile.close();
        resolve(path);
      });
    });
  });
};

export const installLinuxBinary = async (
  binDirectory: string,
  binName: string,
  force = false
): Promise<string> => {
  const normalizedDir = getBinaryDirectory(binDirectory);
  const normalizedPath = getBinaryPath(binDirectory, binName);
  if (fs.existsSync(normalizedPath)) {
    if (force) {
      fs.unlinkSync(normalizedPath);
    } else {
      return Promise.resolve('');
    }
  } else if (!fs.existsSync(normalizedDir)) {
    fs.mkdirSync(normalizedDir, { recursive: true });
  }
  return downloadLinuxBinary(normalizedPath);
};

export const fetchDockerImage = async (version: string, force = false) => {
  const exits = await checkIfDockerImageExists(version);
  if (!exits || !force) {
    return new Promise((resolve, reject) => {
      let dockerSpawn = spawn('docker', ['pull', `ligolang/ligo:${version}`]);

      let stdout = '';
      let stderr = '';

      dockerSpawn.stdout.on('data', data => {
        stdout += data;
      });

      dockerSpawn.stderr.on('data', data => {
        stderr += data;
      });

      dockerSpawn.on('close', code => {
        if (code != 0 || stderr != '') {
          reject(
            `Unable to pull ligolang version ${version}.\nError:\n${stderr}`
          );
        }
        resolve(stdout.trim());
      });
    });
  }
};

export const checkAndInstall = async (
  version = DEFAULT_INSTALL_VERSION,
  force = false,
  binDir = DEFAULT_BIN_DIR,
  binName = DEFAULT_BIN_NAME,
  dockerOnly = false
) => {
  if (process.platform === 'linux' && !dockerOnly) {
    await installLinuxBinary(binDir, binName, force);
  } else if (
    shouldUseDocker() ||
    (process.platform === 'linux' && dockerOnly)
  ) {
    await fetchDockerImage(version, force);
  }
};

export const postInstall = async () => {
  const args = process.argv[2];
  if (args && args === '--postinstall') {
    await checkAndInstall('next', true);
  }
};
