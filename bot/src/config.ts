import * as dotenv from "dotenv";

dotenv.config();

function getEnvVar(name: string, allowEmpty?: boolean): string {
  const value = process.env[name];
  if (!value && !allowEmpty) {
    throw new Error(`❌ ERREUR: environment varible ${name} is missing in the file .env`);
  }
  return value || "";
}

const dev = process.env.NODE_ENV === "dev";
let token: string;
let secretKey: string;
let redirectUri: string;
let authorizeUrl: string;
let clientId: string;

if (dev) {
  authorizeUrl = getEnvVar("AUTHORIZE_URL");
  token = getEnvVar("DISCORD_TOKEN");
  secretKey = getEnvVar("DISCORD_SECRET_KEY");
  redirectUri = getEnvVar("REDIRECT_URI");
  clientId = getEnvVar("DISCORD_CLIENT_ID");
} else {
  authorizeUrl = getEnvVar("AUTHORIZE_URL_PROD");
  token = getEnvVar("DISCORD_TOKEN_PROD");
  secretKey = getEnvVar("DISCORD_SECRET_KEY_PROD");
  redirectUri = getEnvVar("REDIRECT_URI_PROD");
  clientId = getEnvVar("DISCORD_CLIENT_ID_PROD");
}

export const config = {
  discord: {
    token: token,
    clientId: clientId,
    clientSecret: secretKey,
    guildId: getEnvVar("DISCORD_GUILD_ID"),
  },
  db: {
    host: getEnvVar("DB_HOST"),
    port: parseInt(getEnvVar("DB_PORT"), 10),
    user: getEnvVar("DB_USER"),
    password: getEnvVar("DB_PASSWORD", true), 
    name: getEnvVar("DB_NAME"),
  },
  api: {
    port: parseInt(getEnvVar("PORT"), 10),
    redirectUri: redirectUri,
    authorizeUrl: authorizeUrl,
  },
};

console.log("Configuration loaded successfully");
console.log("Discord Client ID:", config.discord.clientId);
console.log("API Redirect URI:", config.api.redirectUri);
console.log("API Authorize URL:", config.api.authorizeUrl);