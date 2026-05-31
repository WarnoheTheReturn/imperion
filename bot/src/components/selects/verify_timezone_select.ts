import { StringSelectMenuBuilder, MessageFlags, StringSelectMenuInteraction } from "discord.js";
import type { StringSelectComponent } from "../../types/index";
import { verifySessions, checkVerifyComplete } from "../../store/verifySession";

const TimezoneSelect: StringSelectComponent = {
  customId: "verify_user_select",

  component: new StringSelectMenuBuilder()
            .setCustomId("verify_timezone_select")
            .setPlaceholder("Choisis ta timezone")
            .addOptions([
              { label: "🇫🇷 Europe/Paris (UTC+1/+2)", value: "Europe/Paris" }
            ]),

  execute: async (interaction : StringSelectMenuInteraction) => {
    const timezone = interaction.values[0];
    const session = verifySessions.get(interaction.user.id);
        if (!session) {
            await interaction.reply({ content: "❌ No session found", flags : MessageFlags.Ephemeral }); 
            return
        };
        if (!timezone) {
            await interaction.reply({ content: "❌ No timezone found", flags : MessageFlags.Ephemeral }); 
            return
        };
    
        session.timezone = timezone;
    
        await interaction.reply({
          content: `✅ Timezone save : ${timezone}`,
          flags : MessageFlags.Ephemeral
        });
    
        await checkVerifyComplete(interaction.user.id);
    
  },
};

export default TimezoneSelect;


