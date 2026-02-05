export function generateCsrfToken() {
  return crypto.randomUUID();
}

export function validateCsrf(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/csrf=([^;]+)/);
  const csrfCookie = match?.[1];
  const csrfHeader = request.headers.get("x-csrf") ?? "";

  return Boolean(csrfCookie && csrfHeader && csrfCookie === csrfHeader);
}
