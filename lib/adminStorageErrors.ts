export function getAdminStorageWriteErrorMessage(error: unknown, area = "Content") {
  const message = String(error);
  if (message.includes("GitHub repo storage is not configured")) {
    return `${area} save failed because GitHub storage is not configured. Set GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, and GITHUB_BRANCH.`;
  }
  if (message.includes("GitHub write failed") || message.includes("GitHub delete failed")) {
    return `${area} save failed in GitHub storage. Check GITHUB_TOKEN permissions and repository settings.`;
  }
  if (message.includes("Blob upload failed")) {
    return `${area} failed in Vercel Blob. Check BLOB_READ_WRITE_TOKEN and Blob permissions.`;
  }
  if (
    message.includes("/var/task") ||
    message.includes("EROFS") ||
    message.includes("EACCES") ||
    message.includes("ENOENT")
  ) {
    return `${area} save failed on Vercel. This admin route writes local files, which are not writable in serverless production.`;
  }
  return null;
}
