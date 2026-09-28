/** Resolve API-stored media paths for <img src>. Seed brand paths stay as-is. */
export const resolveMediaUrl = (url: string | null | undefined): string | undefined => {
  if (!url) {
    return undefined;
  }
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:') ||
    url.startsWith('/brand/')
  ) {
    return url;
  }
  if (url.startsWith('uploads/')) {
    return `/api/${url}`;
  }
  if (url.startsWith('/uploads/')) {
    return `/api${url}`;
  }
  return url;
};
