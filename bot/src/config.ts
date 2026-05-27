import * as dotenv from "dotenv";

dotenv.config();

function getEnvVar(name: string, allowEmpty?: boolean): string {
  const value = process.env[name];
  if (!value && !allowEmpty) {
    throw new Error(`❌ ERREUR: environment varible ${name} is missing in the file .env`);
  }
  return value || "";
}

let token: string;
if (process.env.NODE_ENV === "development") {
  token = getEnvVar("DISCORD_TOKEN");
} else {
  token = getEnvVar("DISCORD_TOKEN_PROD");
}

export const config = {
  discord: {
    token: token,
    clientId: getEnvVar("DISCORD_CLIENT_ID"),
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
  },
};
