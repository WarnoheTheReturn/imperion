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
let redirectUriDiscord: string;
let redirectUriRoblox: string;
let authorizeUrl: string;
let clientId: string;
let dbHost: string;
let dbPort: number;
let dbUser: string;
let dbPassword: string;
let dbName: string;
let robloxAPIID: string;
let robloxAPISecret: string;
let website: string;
let server: string;

if (dev) {
  authorizeUrl = getEnvVar("AUTHORIZE_URL");
  token = getEnvVar("DISCORD_TOKEN");
  secretKey = getEnvVar("DISCORD_SECRET_KEY");
  redirectUriDiscord = getEnvVar("REDIRECT_URI_DISCORD");
  redirectUriRoblox = getEnvVar("REDIRECT_URI_ROBLOX");
  clientId = getEnvVar("DISCORD_CLIENT_ID");
  dbHost = getEnvVar("DB_HOST");
  dbPort = parseInt(getEnvVar("DB_PORT"), 10);
  dbUser = getEnvVar("DB_USER");
  dbPassword = getEnvVar("DB_PASSWORD", true);
  dbName = getEnvVar("DB_NAME");
  robloxAPIID = getEnvVar("ROBLOX_API_ID");
  robloxAPISecret = getEnvVar("ROBLOX_API_SECRET");
  website = getEnvVar("WEBSITE");
  server = getEnvVar("SERVER");
} else {
  authorizeUrl = getEnvVar("AUTHORIZE_URL_PROD");
  token = getEnvVar("DISCORD_TOKEN_PROD");
  secretKey = getEnvVar("DISCORD_SECRET_KEY_PROD");
  redirectUriDiscord = getEnvVar("REDIRECT_URI_DISCORD_PROD");
  redirectUriRoblox = getEnvVar("REDIRECT_URI_ROBLOX_PROD");
  clientId = getEnvVar("DISCORD_CLIENT_ID_PROD");
  dbHost = getEnvVar("DB_HOST_PROD");
  dbPort = parseInt(getEnvVar("DB_PORT_PROD"), 10);
  dbUser = getEnvVar("DB_USER_PROD");
  dbPassword = getEnvVar("DB_PASSWORD_PROD", true);
  dbName = getEnvVar("DB_NAME_PROD");
  robloxAPIID = getEnvVar("ROBLOX_API_ID");  ///
  robloxAPISecret = getEnvVar("ROBLOX_API_SECRET"); ///
  website = getEnvVar("WEBSITE_PROD");
  server = getEnvVar("SERVER_PROD");
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
    redirectUriDiscord: redirectUriDiscord,
    redirectUriRoblox: redirectUriRoblox,
    authorizeUrl: authorizeUrl,
    robloxGroup : getEnvVar("ROBLOX_GROUPE_API"),
    robloxGroupeID : getEnvVar("ROBLOX_GROUPE_ID"),
    robloxAPIID : robloxAPIID,
    robloxAPISecret : robloxAPISecret,
    website : website,
    server : server
  },
};
