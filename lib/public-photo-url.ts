export function publicPhotoUrl(image: string, siteUrl: string): string {
  const url = new URL(image, siteUrl);
  const host = url.hostname.toLowerCase();
  if (
    url.protocol !== "https:" || url.username || url.password ||
    !host.includes(".") || host.endsWith(".localhost") ||
    host.endsWith(".local") || host.endsWith(".test") ||
    /^\d+\.\d+\.\d+\.\d+$/.test(host) || host.includes(":")
  ) {
    throw new Error("A public HTTPS website is required for gallery photo links.");
  }
  return url.href;
}
