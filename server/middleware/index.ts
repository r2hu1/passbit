import { defineEventHandler, getHeader, createError } from "h3";
import { verifyEncryptedToken } from "~/utils/auth";

export default defineEventHandler((event) => {
  const authHeader = getHeader(event, "authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authorization token required",
    });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const decoded = verifyEncryptedToken(token);

  if (!decoded) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired token",
    });
  }

  event.context.user = decoded;
});
