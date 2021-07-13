import {
  fetchDockerImage,
  checkIfDockerImageExists,
  checkAndInstall,
} from '../src/install';
import { execSync } from 'child_process';

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
});
