import crypto from "crypto";

export const verifyTokens = new Map<string, { userId: string; expiresAt: number }>();

export const createToken = (discordUserId: string): string => {
  const token = crypto.randomBytes(32).toString("hex"); 
  verifyTokens.set(token, {
    userId:    discordUserId,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });
  return token;
};

export const consumeToken = (token: string): string | null => {
  const entry = verifyTokens.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    verifyTokens.delete(token);
    return null;
  }
  verifyTokens.delete(token); 
  return entry.userId;
};