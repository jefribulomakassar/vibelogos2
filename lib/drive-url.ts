// Khusus untuk Client Components — tidak import googleapis
export function getDriveThumbnailUrl(fileId: string, size = "s400"): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=${size}`;
}

export function getDriveViewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view`;
}
