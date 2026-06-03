
import { ButtonComponent, ModalComponent, StringSelectComponent, UserSelectComponent ,Bot} from "../types/index";
import { ButtonInteraction, UserSelectMenuInteraction, StringSelectMenuInteraction } from "discord.js";
import { AnySelectMenuInteraction } from "discord.js";
import { ModalSubmitInteraction } from "discord.js";

import  verifyCheckGroup  from "./buttons/verify_check_group";
import  verifyFactionQuestion  from "./buttons/verify_faction_question";
import  verifyCheckRobloxApi  from "./buttons/verify_check_roblox_api";
import  verifyRobloxApi  from "./buttons/verify_roblox_api";
import  verifyGroup  from "./buttons/verify_group";

import  UserSelect  from "./selects/verify_user_select"
import  TimezoneSelect  from "./selects/verify_timezone_select"

import   verifyQuestionModal  from "./modals/verify_question_modal";




export type ButtonCustomId =
  | "verify_check_group"
  | "verify_faction_question"
  | "verify_check_roblox_api"
  | "verify_roblox_api"
  | "verify_group";

export type UserSelectCustomId   = "verify_user_select";
export type StringSelectCustomId = "verify_timezone_select";

export type ModalCustomId =
  | "verify_faction_question_modal";



export class ComponentStore {
  public buttons: Record<ButtonCustomId, ButtonComponent>;
  public userSelects:   Record<UserSelectCustomId, UserSelectComponent>;   
  public stringSelects: Record<StringSelectCustomId, StringSelectComponent>; 
  public modals:  Record<ModalCustomId, ModalComponent >;

  constructor() {
    this.buttons = {
        verify_check_group:   verifyCheckGroup,
        verify_faction_question : verifyFactionQuestion,
        verify_check_roblox_api : verifyCheckRobloxApi,
        verify_roblox_api : verifyRobloxApi,
        verify_group : verifyGroup
    }
    this.userSelects = {
        verify_user_select: UserSelect
    }
    this.stringSelects = {
        verify_timezone_select: TimezoneSelect
    }
    this.modals = {
        verify_faction_question_modal: verifyQuestionModal
    }

    }

    public handleButton(interaction: ButtonInteraction, bot : Bot) {
        const c = this.buttons[interaction.customId as ButtonCustomId];
        return c?.execute(interaction, bot);
    }

    public handleUserSelect(interaction: UserSelectMenuInteraction , bot : Bot) {
        const c = this.userSelects[interaction.customId as UserSelectCustomId];
        return c?.execute(interaction, bot);
    }

    public handleStringSelect(interaction: StringSelectMenuInteraction, bot : Bot) {
        const c = this.stringSelects[interaction.customId as StringSelectCustomId];
        return c?.execute(interaction, bot);
    }

    public handleModal(interaction: ModalSubmitInteraction, bot : Bot) {
        const c = this.modals[interaction.customId as ModalCustomId];
        return c?.execute(interaction, bot);
    }


}

