export function withBase(path: string): string {
  let base = import.meta.env.BASE_URL || "/";

  if (base !== "/" && !base.endsWith("/")) {
    base = `${base}/`;
  }

  if (!path) {
    return base;
  }

  if (path.startsWith("?") || path.startsWith("#")) {
    return base === "/" ? path : `${base.replace(/\/$/, "")}${path}`;
  }

  if (path.startsWith("/")) {
    return base === "/" ? path : `${base}${path.slice(1)}`;
  }

  return `${base}${path}`;
}
