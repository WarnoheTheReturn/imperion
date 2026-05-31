import { ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";
import type { ButtonComponent } from "../../types/index";

const verifyGroup: ButtonComponent = {
  customId: "verify_group",

  component: new ButtonBuilder()
            .setLabel("👥 Roblox groupe")
            .setStyle(ButtonStyle.Link)
            .setURL("https://www.roblox.com/communities/35286700"),

  execute: async (interaction, bot) => { 
    await interaction.deferReply({ flags : MessageFlags.Ephemeral });
  },
};

export default verifyGroup;

