import fs from 'fs';
import { DEFAULT_BIN_DIR, DEFAULT_BIN_NAME } from '../src/globals';
import { installLinuxBinary } from '../src/install';
import { getBinaryPath } from '../src/utils';

describe('Binary Install', () => {
  jest.setTimeout(50000);
  it('should fetch/install ligo binary', async () => {
    const expected = getBinaryPath(DEFAULT_BIN_DIR, DEFAULT_BIN_NAME);
    const binaryPath = await installLinuxBinary(
      DEFAULT_BIN_DIR,
      DEFAULT_BIN_NAME,
      true
    );
    expect(binaryPath).toBe(expected);
    expect(fs.existsSync(binaryPath)).toBe(true);
  });

  it('should not install if file already exits', async () => {
    const binPath = getBinaryPath(DEFAULT_BIN_DIR, DEFAULT_BIN_NAME);
    const binaryPath = await installLinuxBinary(
      DEFAULT_BIN_DIR,
      DEFAULT_BIN_NAME
    );
    expect(binaryPath).not.toBe(binPath);
    expect(binaryPath).toBe('');
    expect(fs.existsSync(binPath)).toBe(true);
  });
});
