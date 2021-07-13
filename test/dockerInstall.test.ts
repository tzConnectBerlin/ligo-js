import fs from 'fs';
import {
  fetchDockerImage,
  checkIfDockerImageExists,
  checkAndInstall,
} from '../src/install';
import { execSync } from 'child_process';
import { DEFAULT_BIN_DIR, DEFAULT_BIN_NAME } from '../src/globals';
import { getBinaryPath } from '../src/utils';

const deleteLigoImage = () => {
  try {
    execSync('docker rmi ligolang/ligo:next');
  } catch (error) {}
};

beforeEach(() => {
  if (checkIfDockerImageExists('next')) {
    deleteLigoImage();
  }
});

describe('Docker Install', () => {
  jest.setTimeout(50000);
  it('should fetch ligo docker image if not exist', async () => {
    let imageExits = await checkIfDockerImageExists('next');
    expect(imageExits).toBe(false);
    await fetchDockerImage('next');
    imageExits = await checkIfDockerImageExists('next');
    expect(imageExits).toBe(true);
  });
});

describe('checkAndInstall tests', () => {
  jest.setTimeout(50000);
  it('should fetch and install docker only', async () => {
    let imageExits = await checkIfDockerImageExists('next');
    expect(imageExits).toBe(false);
    await checkAndInstall('next', true, undefined, undefined, true);
    imageExits = await checkIfDockerImageExists('next');
    expect(imageExits).toBe(true);
  });

  it('defaults', async () => {
    let exits = false;
    if (process.platform === 'linux') {
      const binPath = getBinaryPath(DEFAULT_BIN_DIR, DEFAULT_BIN_NAME);
      if (fs.existsSync(binPath)) {
        fs.unlinkSync(binPath);
      }
    } else {
      exits = await checkIfDockerImageExists('next');
      expect(exits).toBe(false);
    }
    await checkAndInstall();
    exits = await checkIfDockerImageExists('next');
    expect(exits).toBe(true);
  });
});
