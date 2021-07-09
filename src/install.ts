import https from 'https';
import fs from 'fs';
import { spawn, exec } from 'child_process';
import {
  DEFAULT_BIN_PATH,
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

export const downloadLinuxBinary = (path: string, force = false) => {
  https.get(LIGO_PATH, res => {
    if (fs.existsSync(path)) {
      if (force) {
        fs.unlinkSync(path);
      } else {
        return;
      }
    }
    const filePath = fs.createWriteStream(path, { encoding: 'binary' });
    res.pipe(filePath);
    filePath.on('finish', () => {
      filePath.close();
      console.log('Download Completed.\nSetting necessary permissions.');
      fs.chmod(path, '0755', () => {
        console.log('Done!');
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
  path = DEFAULT_BIN_PATH,
  dockerOnly = false
) => {
  const operatingSystem = process.platform;
  if (operatingSystem === 'linux' && !dockerOnly) {
    downloadLinuxBinary(path, force);
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
    await checkAndInstall(undefined, true);
  }
};
