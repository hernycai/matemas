const buckets = new Map();

/**
 * Rate limit simple en memoria (por IP + email) para login.
 * En serverless multi-instancia es best-effort; suficiente para MVP.
 */
export const rateLimitLogin = (req, res, next) => {
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 10;
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const key = `${ip}:${email}`;
  const now = Date.now();

  let entry = buckets.get(key);
  if (!entry || now - entry.start > windowMs) {
    entry = { start: now, count: 0 };
  }

  entry.count += 1;
  buckets.set(key, entry);

  if (entry.count > maxAttempts) {
    const retryAfter = Math.ceil((entry.start + windowMs - now) / 1000);
    res.setHeader("Retry-After", String(Math.max(retryAfter, 1)));
    return res.status(429).json({
      status: "error",
      statusCode: 429,
      message: "Demasiados intentos de inicio de sesión. Probá más tarde.",
      errors: ["Rate limit excedido"],
    });
  }

  return next();
};
