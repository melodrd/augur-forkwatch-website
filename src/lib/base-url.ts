export function joinBasePath(
  baseUrl: string | undefined,
  path: string,
): string {
  const base = baseUrl?.trim() || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const normalizedPath = path.replace(/^\/+/, "");

  return `${normalizedBase}${normalizedPath}`;
}
