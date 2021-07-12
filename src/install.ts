import https from 'https';
import path from 'path';
import fs from 'fs';
import { spawn, exec } from 'child_process';
import {
  DEFAULT_BIN_NAME,
  DEFAULT_BIN_DIR,
  LIGO_PATH,
  DEFAULT_INSTALL_VERSION,
} from './globals';

export const checkIfDockerImageExists = async (version: string) => {
  return new Promise(resolve => {
    exec(`docker image inspect ligolang/ligo:${version}`, err => {
      if (err) {
        resolve(false);
      }
      resolve(true);
    });
  });
};

export const downloadLinuxBinary = (
  binDirectory: string,
  binName: string,
  force = false
) => {
  const normalizedDir = path.normalize(process.cwd() + '/' + binDirectory);
  const normalizedPath = path.normalize(normalizedDir + '/' + binName);
  if (fs.existsSync(normalizedPath)) {
    if (force) {
      fs.unlinkSync(normalizedPath);
    } else {
      return;
    }
  } else if (!fs.existsSync(normalizedDir)) {
    fs.mkdirSync(normalizedDir, { recursive: true });
  }
  return new Promise(resolve => {
    const binaryFile = fs.createWriteStream(normalizedPath, {
      encoding: 'binary',
    });
    https.get(LIGO_PATH, res => {
      res.pipe(binaryFile);
      binaryFile.on('finish', () => {
        binaryFile.close();
        console.log('Download Completed.\nSetting necessary permissions.');
        fs.chmod(normalizedPath, '0755', () => {
          console.log('Done!');
          resolve(normalizedPath);
        });
      });
    });
  });
};

export const fetchDockerImage = async (version: string, force = false) => {
  const exits = await checkIfDockerImageExists(version);
  if (!exits || !force) {
    return new Promise((resolve, reject) => {
      console.log(
        `Using docker to setup ligolang. Installing version ${version}...`
      );
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

        console.log(`Installation Complete.`);
        resolve(stdout.trim());
      });
    });
  }
};

export const checkAndInstall = async (
  version = DEFAULT_INSTALL_VERSION,
  force = false,
  binName = DEFAULT_BIN_NAME,
  binDir = DEFAULT_BIN_DIR,
  dockerOnly = false
) => {
  const operatingSystem = process.platform;
  if (operatingSystem === 'linux' && !dockerOnly) {
    await downloadLinuxBinary(binDir, binName, force);
  } else if (
    operatingSystem === 'win32' ||
    operatingSystem === 'darwin' ||
    (operatingSystem === 'linux' && dockerOnly)
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
