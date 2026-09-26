export function isImageUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      Boolean(url.hostname) &&
      url.href.length <= 2048
    );
  } catch {
    return false;
  }
}
