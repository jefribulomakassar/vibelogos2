import { google } from "googleapis";

let driveClient: ReturnType<typeof google.drive> | null = null;

export function getDriveClient() {
  if (driveClient) return driveClient;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),
    },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  driveClient = google.drive({ version: "v3", auth });
  return driveClient;
}

/**
 * Konversi Google Drive file ID ke URL thumbnail langsung (bisa dipakai di <img>)
 * Ukuran: s220 = 220px, s400 = 400px, s1600 = fullsize
 */
export function getDriveThumbnailUrl(fileId: string, size = "s400"): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=${size}`;
}

/**
 * Ambil direct download/view URL untuk file Google Drive
 */
export function getDriveViewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view`;
}

/**
 * Ambil list file dari folder Drive (untuk seed / sinkronisasi)
 */
export async function listDriveFiles(folderId: string) {
  const drive = getDriveClient();
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType, thumbnailLink, webViewLink)",
    pageSize: 100,
  });
  return res.data.files ?? [];
}
