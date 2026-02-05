import { generateCsrfToken } from "@/lib/security/csrf";

export async function GET() {
  const token = generateCsrfToken();

  return new Response(JSON.stringify({ csrf: token }), {
    headers: {
      "content-type": "application/json",
      "set-cookie": `csrf=${token}; Path=/; HttpOnly; SameSite=Strict`,
    },
  });
}
