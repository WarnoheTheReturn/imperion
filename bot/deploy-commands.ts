import { REST, Routes } from "discord.js";
import * as fs from "fs";
import * as path from "path";
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
let guildId: string;
let clientId: string;
if (dev) {
  token = getEnvVar("DISCORD_TOKEN");
  clientId = getEnvVar("DISCORD_CLIENT_ID");
  guildId =   getEnvVar("DISCORD_GUILD_ID");
} else {
  token = getEnvVar("DISCORD_TOKEN_PROD");
  guildId = getEnvVar("DISCORD_GUILD_ID_PROD");
  clientId =  getEnvVar("DISCORD_CLIENT_ID_PROD");
}




if (!token || !guildId || !clientId) {
  throw new Error("Config file missing some values");
}

const commands = [];
const commandsPath = path.join(__dirname, "src", "commands");
const commandFiles = fs.readdirSync(commandsPath, { withFileTypes: true, recursive : true })
  .map(file => path.join(file.parentPath, file.name))
  .filter(file => file.endsWith(".ts"));


for (const file of commandFiles) {
  const command = require(file).default;
  if (command && command.data) {
    commands.push(command.data.toJSON());
  }
}


const rest = new REST({ version: "10" }).setToken(token);


(async () => {
  try {
    console.log(`⏳ Start of the deployment of ${commands.length} commands.`);

    const data: any = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(`✅ ${data.length} commands were loaded.`);
  } catch (error) {
    console.error("❌ Error deploying commands :", error);
  }
})();
