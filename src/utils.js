import path from 'path';

// eslint-disable-next-line import/prefer-default-export
export const normalizePath = (p) => {
  if (!p) {
    return null;
  }
  return path.isAbsolute(p) ? p : path.join(process.cwd(), p);
};
