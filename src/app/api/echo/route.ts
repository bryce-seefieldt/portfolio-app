import { z } from "zod";
import { rateLimit } from "@/lib/security/ratelimit";
import { validateCsrf } from "@/lib/security/csrf";

const EchoSchema = z.object({
  message: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const throttle = rateLimit(`echo:${ip}`);

  if (!throttle.ok) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!validateCsrf(request)) {
    return Response.json({ error: "CSRF blocked" }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = EchoSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  return Response.json({ ok: true, echo: parsed.data.message });
}
