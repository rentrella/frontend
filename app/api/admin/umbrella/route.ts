import { proxyBackend } from "../../_backend";

export const dynamic = "force-dynamic";

export async function GET() {
  return proxyBackend("/umbrella");
}
