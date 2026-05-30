import { SlashCommandBuilder, ChatInputCommandInteraction, Client, Collection, AutocompleteInteraction } from "discord.js";
import {Database} from '../db/index';
import { Logger } from "../logs/index";
import { config } from "../config";

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction, client: Bot) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction, client: Bot) => Promise<void>;
}

export interface Event {
  name: string;
  once?: boolean;
  execute: (...args: any[]) => Promise<void>;
}

export class Bot extends Client {
  public commands : Collection<string, Command> = new Collection();
  public db: Database = new Database();
  public log : Logger = new Logger(this, this.db);
  public config : typeof config = config;
}

export class LogChannelType {
  static readonly GRADES = "grades"
  static readonly ENLISTMENT = "enlistment";

}