import path from 'path';

export const getBinaryPath = (binDirectory: string, binName: string) => {
  return path.normalize(process.cwd() + '/' + binDirectory + '/' + binName);
};

export const getBinaryDirectory = (binDirectory: string) => {
  return path.normalize(process.cwd() + '/' + binDirectory);
};

export const shouldUseDocker = () => {
  return process.platform === 'darwin' || process.platform === 'win32';
};
