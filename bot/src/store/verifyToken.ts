import crypto from "crypto";


export type OAuthProvider = 'discord' | 'roblox';

type VerifyToken = {
  provider: OAuthProvider;
  userId?: string;
  expiresAt: number;
}

export const verifyTokens = new Map<string, VerifyToken>();

export const invalideuserRobloxToken = (discordUserId: string) => {
  for (const [token, entry] of verifyTokens) {
      if (
          entry.provider === 'roblox' &&
          entry.userId === discordUserId
      ) {
          verifyTokens.delete(token);
      }
  }
};

export const createToken = (provider : OAuthProvider, userId?: string ): string => {
  const token = crypto.randomBytes(32).toString("hex"); 

  verifyTokens.set(token, {
    provider : provider,
    userId : userId ?? "",
    expiresAt : Date.now() + 10 * 60 * 1000,
  });

  return token;
};

export const getToken = (provider : OAuthProvider, state: string): VerifyToken | null => {
  const token = verifyTokens.get(state);

  if (!token || token.provider !== provider) return null;

  if (Date.now() > token.expiresAt) {
    verifyTokens.delete(state);
    return null;
  }

  return token;
};


export const consumeToken = (provider : OAuthProvider, state: string): VerifyToken | null => {
  const token = getToken(provider,state)

  if (token) {
    verifyTokens.delete(state);
  }

  return token;
};

setInterval(() => {
    const now = Date.now();

    for (const [token, entry] of verifyTokens) {
        if (entry.expiresAt <= now) {
            verifyTokens.delete(token);
        }
    }
}, 60 * 1000).unref();