export function assetPath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return base && !path.startsWith(`${base}/`) ? `${base}${path}` : path;
}
