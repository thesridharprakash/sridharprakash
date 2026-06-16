import { POST as communityPost } from "../community/route";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  return communityPost(request);
}
