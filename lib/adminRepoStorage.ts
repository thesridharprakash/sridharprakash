type RepoConfig = {
  owner: string;
  repo: string;
  branch: string;
  token: string;
};

function getRepoConfig(): RepoConfig | null {
  const owner = process.env.GITHUB_OWNER?.trim() || "";
  const repo = process.env.GITHUB_REPO?.trim() || "";
  const branch = process.env.GITHUB_BRANCH?.trim() || "main";
  const token = process.env.GITHUB_TOKEN?.trim() || "";
  if (!owner || !repo || !token) return null;
  return { owner, repo, branch, token };
}

export function isAdminRepoStorageEnabled() {
  return Boolean(getRepoConfig());
}

type RepoContentResponse = {
  sha?: string;
  content?: string;
  encoding?: string;
};

async function githubFetch(pathname: string, init: RequestInit = {}) {
  const config = getRepoConfig();
  if (!config) {
    throw new Error("GitHub repo storage is not configured.");
  }

  const url = `https://api.github.com/repos/${config.owner}/${config.repo}${pathname}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  return { response, config };
}

async function getRepoFileSha(repoPath: string) {
  const config = getRepoConfig();
  if (!config) {
    throw new Error("GitHub repo storage is not configured.");
  }
  const { response } = await githubFetch(`/contents/${repoPath}?ref=${encodeURIComponent(config.branch)}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`GitHub read failed (${response.status}) for ${repoPath}`);
  }

  const payload = (await response.json()) as RepoContentResponse;
  return payload.sha ?? null;
}

export async function writeRepoFile(repoPath: string, content: string, message: string) {
  const config = getRepoConfig();
  if (!config) {
    throw new Error("GitHub repo storage is not configured.");
  }

  const sha = await getRepoFileSha(repoPath);
  const body = {
    message,
    content: Buffer.from(content, "utf8").toString("base64"),
    branch: config.branch,
    ...(sha ? { sha } : {}),
  };

  const { response } = await githubFetch(`/contents/${repoPath}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`GitHub write failed (${response.status}) for ${repoPath}: ${detail}`);
  }
}

export async function repoFileExists(repoPath: string) {
  return (await getRepoFileSha(repoPath)) !== null;
}

export async function deleteRepoFile(repoPath: string, message: string) {
  const config = getRepoConfig();
  if (!config) {
    throw new Error("GitHub repo storage is not configured.");
  }

  const sha = await getRepoFileSha(repoPath);
  if (!sha) {
    throw new Error(`GitHub delete failed: file not found (${repoPath})`);
  }

  const { response } = await githubFetch(`/contents/${repoPath}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      sha,
      branch: config.branch,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`GitHub delete failed (${response.status}) for ${repoPath}: ${detail}`);
  }
}
