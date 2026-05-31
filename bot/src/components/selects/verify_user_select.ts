import { UserSelectMenuBuilder, MessageFlags, UserSelectMenuInteraction } from "discord.js";
import type { UserSelectComponent } from "../../types/index";
import { verifySessions, checkVerifyComplete } from "../../store/verifySession";

const UserSelect: UserSelectComponent = {
  customId: "verify_user_select",

  component: new UserSelectMenuBuilder()
    .setCustomId("verify_user_select")
    .setPlaceholder("Sélectionne un utilisateur")
    .setMinValues(1)
    .setMaxValues(1),

  execute: async (interaction : UserSelectMenuInteraction ) => {
    const userId = interaction.values[0];
    const session = verifySessions.get(interaction.user.id);
            if (!session) {
                await interaction.reply({ content: "❌ No session found", flags : MessageFlags.Ephemeral }); 
                return
            };
            if (!userId) {
                await interaction.reply({ content: "❌ No user found", flags : MessageFlags.Ephemeral }); 
                return
            };
        
            session.recruitedBy = userId;
        
            await interaction.reply({
              content: `✅ Recruited by save : <@${userId}>`,
              flags : MessageFlags.Ephemeral
            });
        
            await checkVerifyComplete(interaction.user.id);
  },
        
            
    
  }

export default UserSelect;