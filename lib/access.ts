export const ACCESS_COOKIE = "lexi_portfolio_access";

export async function accessToken(password: string) {
  const bytes = new TextEncoder().encode(`lexi-portfolio:v1:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function hasPortfolioAccess(cookieValue?: string) {
  const password = process.env.PORTFOLIO_PASSWORD;
  if (!password || !cookieValue) return false;
  return cookieValue === await accessToken(password);
}
