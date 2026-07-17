import {Collection } from "discord.js";
import { Bot, Command } from "../types";
import * as path from "path";
import * as fs from "fs";

export async function loadCommands(client: Bot): Promise<void> {
  const commands = new Collection<string, Command>();
  const commandsPath = path.join(__dirname, "..", "commands");

  if (!fs.existsSync(commandsPath)) {
    console.log("⚠️ Command folder does not exist");
    fs.mkdirSync(commandsPath);
    return;
  }

  const dirents = fs.readdirSync(commandsPath, { withFileTypes: true, recursive: true });

  const files = dirents
    .filter(dirent => dirent.isFile() && (dirent.name.endsWith(".ts") || dirent.name.endsWith(".js")) && !dirent.name.endsWith('.d.ts'))
    .map(dirent => path.join(dirent.parentPath,dirent.name));




  if (files.length === 0) {
    console.log("⚠️ No commands were found");
    client.commands = commands; 
    return;
  }



  for (const filePath of files) {
    // const filePath = path.join(commandsPath, file);
    const fileName = path.basename(filePath);
    try {
      


      const command: Command = require(filePath).default;
      
        
      if (command && command.data && typeof command.execute === "function") {
        commands.set(command.data.name, command);
        console.log(`✅ Command loaded : ${command.data.name}`);
      } else {
        console.log(`❌ Command ${fileName} is not in the correct format.`);
      }
    } catch (error) {
      console.log(`❌ Unable to load the command ${fileName} :`, error);
    }
  }

  client.commands = commands;
  console.log(`ℹ️  ${commands.size} commands loaded !`);
}
