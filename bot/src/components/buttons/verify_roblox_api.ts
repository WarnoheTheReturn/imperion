import { ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";
import type { ButtonComponent } from "../../types/index";
import { Bot } from "../../types";
import { createToken, invalideuserRobloxToken } from "../../store/verifyToken";

const verifyRobloxApi : ButtonComponent = {
  customId: "verify_roblox_api",

  component:
    new ButtonBuilder()
    .setLabel("🔗 Roblox API")
    .setStyle(ButtonStyle.Link),

  build: (bot : Bot,userId) : ButtonBuilder => {
    invalideuserRobloxToken(userId)
    return verifyRobloxApi.component.setURL(`${bot.config.api.server}/api/auth/roblox?token=${createToken('roblox',userId)}`);},

  execute: async (interaction, bot) => { 
    await interaction.deferReply({ flags : MessageFlags.Ephemeral });
  },
};

export default verifyRobloxApi;


