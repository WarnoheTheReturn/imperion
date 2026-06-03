import { ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";
import type { ButtonComponent } from "../../types/index";
import { verifySessions, checkVerifyComplete } from "../../store/verifySession";

const verifyCheckRobloxApi: ButtonComponent = {
  customId: "verify_check_roblox_api",

  component:
    new ButtonBuilder()
        .setCustomId("verify_check_roblox_api")
        .setLabel("🔍 Check Roblox API")
        .setStyle(ButtonStyle.Primary),

  execute: async (interaction, bot) => { 
    const session = verifySessions.get(interaction.user.id);
        if (!session) {
            await interaction.reply({ content: "❌ No session found", flags : MessageFlags.Ephemeral }); 
            return
        };
    
        if (!session.robloxVerified) {
            interaction.reply({
                content: "❌ No Roblox account linked yet.",
                flags: MessageFlags.Ephemeral,
            });
            return
        };
        await interaction.reply({
          content: `✅ Roblox API verified with ${session.robloxId}`,
          flags : MessageFlags.Ephemeral
        });
    
        await checkVerifyComplete(interaction.user.id);
  },
};

export default verifyCheckRobloxApi;


