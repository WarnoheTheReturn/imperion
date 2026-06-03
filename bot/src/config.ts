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
let dbHost: string;
let dbPort: number;
let dbUser: string;
let dbPassword: string;
let dbName: string;

if (dev) {
  authorizeUrl = getEnvVar("AUTHORIZE_URL");
  token = getEnvVar("DISCORD_TOKEN");
  secretKey = getEnvVar("DISCORD_SECRET_KEY");
  redirectUri = getEnvVar("REDIRECT_URI");
  clientId = getEnvVar("DISCORD_CLIENT_ID");
  dbHost = getEnvVar("DB_HOST");
  dbPort = parseInt(getEnvVar("DB_PORT"), 10);
  dbUser = getEnvVar("DB_USER");
  dbPassword = getEnvVar("DB_PASSWORD", true);
  dbName = getEnvVar("DB_NAME");
} else {
  authorizeUrl = getEnvVar("AUTHORIZE_URL_PROD");
  token = getEnvVar("DISCORD_TOKEN_PROD");
  secretKey = getEnvVar("DISCORD_SECRET_KEY_PROD");
  redirectUri = getEnvVar("REDIRECT_URI_PROD");
  clientId = getEnvVar("DISCORD_CLIENT_ID_PROD");
  dbHost = getEnvVar("DB_HOST_PROD");
  dbPort = parseInt(getEnvVar("DB_PORT_PROD"), 10);
  dbUser = getEnvVar("DB_USER_PROD");
  dbPassword = getEnvVar("DB_PASSWORD_PROD", true);
  dbName = getEnvVar("DB_NAME_PROD");
}

export const config = {
  discord: {
    token: token,
    clientId: clientId,
    clientSecret: secretKey,
    guildId: getEnvVar("DISCORD_GUILD_ID"),
  },
  db: {
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword, 
    name: dbName,
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