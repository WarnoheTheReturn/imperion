import { ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";
import type { ButtonComponent, Bot } from "../../types/index";

const verifyFactionQuestion: ButtonComponent = {
  customId: "verify_faction_question",

  component: new ButtonBuilder()
        .setCustomId("verify_faction_question")
        .setLabel("✏️ Answer here")
        .setStyle(ButtonStyle.Secondary),

  execute: async (interaction : ButtonInteraction, bot : Bot) => { 
    await interaction.showModal(bot.components.modals.verify_faction_question_modal.component);
  },
};

export default verifyFactionQuestion;