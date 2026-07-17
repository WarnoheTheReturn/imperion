import { SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  Client, 
  Collection, 
  AutocompleteInteraction,
  ButtonBuilder,
  ButtonInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  UserSelectMenuBuilder,
  UserSelectMenuInteraction, 
  AnySelectMenuInteraction
} from "discord.js";
import {Database} from '../db/index';
import { Logger } from "../logs/index";
import { config } from "../config";
import { ComponentStore } from "../components/index";

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



export class LogChannelType {
  static readonly GENERAL = "general"
  static readonly GRADES = "grades"
  static readonly ENLISTMENT = "enlistment";
  static readonly EVENT = "event";


}

export class EventState {
  static readonly CREATED = "created";
  static readonly STARTED = "started";
  static readonly ENDED = "ended";
}

interface BaseComponent<TBuilder, TInteraction> {
  customId: string;
  component: TBuilder;
  build?: (...args: any) => TBuilder;
  execute: (interaction: TInteraction, client: Bot) => Promise<void>;
}



export type ButtonComponent = BaseComponent<
  ButtonBuilder,
  ButtonInteraction
>;

export type UserSelectComponent = BaseComponent<
  UserSelectMenuBuilder,
  UserSelectMenuInteraction
>;

export type StringSelectComponent = BaseComponent<
  StringSelectMenuBuilder,
  StringSelectMenuInteraction
>;

export type ModalComponent = BaseComponent<
  ModalBuilder,
  ModalSubmitInteraction
>;


// export type AnyComponent =
//   | ButtonComponent
//   | UserSelectComponent
//   | StringSelectComponent
//   | ModalComponent;


export class Bot extends Client {
  public commands : Collection<string, Command> = new Collection();
  public db: Database = new Database();
  public log : Logger = new Logger(this, this.db);
  public config : typeof config = config;
  public components : ComponentStore = new ComponentStore();
}