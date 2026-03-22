const rawApiBase = (import.meta.env.VITE_API_BASE_URL || '').trim();

export const apiBaseOrigin = rawApiBase.replace(/\/$/, '');

export function withApiBase(path) {
  if (!path) return path;
  if (!apiBaseOrigin || /^https?:\/\//i.test(path)) return path;
  return `${apiBaseOrigin}${path.startsWith('/') ? path : `/${path}`}`;
}

export function resolveUploadPath(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/uploads/') && apiBaseOrigin) {
    return `${apiBaseOrigin}${path}`;
  }
  return path;
}