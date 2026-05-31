import { ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";
import type { ButtonComponent } from "../../types/index";
import { verifySessions, checkVerifyComplete } from "../../store/verifySession";
import { isInGroup, findJoinRequest , acceptJoinRequest } from "../../utils/roblox";

const verifyCheckGroup: ButtonComponent = {
  customId: "verify_check_group",

  component: new ButtonBuilder()
    .setCustomId("verify_check_group")
    .setLabel("✅ Check roblox group")
    .setStyle(ButtonStyle.Success),

  execute: async (interaction, bot) => { 
    const session = verifySessions.get(interaction.user.id);
    if (!session) {
        await interaction.reply({ content: "❌ No session found", flags : MessageFlags.Ephemeral }); 
        return
    };

    if (!session.robloxId) {
        interaction.reply({
            content: "❌ No Roblox account linked yet.",
            flags: MessageFlags.Ephemeral,
        });
        return
    };

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
        const inGroup = await isInGroup(session.robloxId, bot);
        if (inGroup) {
        session.groupVerified = true;
        interaction.editReply({
            content: "✅ Already in the group !",
            });
        await checkVerifyComplete(interaction.user.id);
        return
        }

        const pathJoinRequest = await findJoinRequest (session.robloxId, bot);
        if (pathJoinRequest) {
        await acceptJoinRequest(pathJoinRequest, bot);
        session.groupVerified = true;
        interaction.editReply({ 
            content: "✅ Join request accepted ! You are now in the group." 
            });
        await checkVerifyComplete(interaction.user.id);
        return
        }

        interaction.editReply({
        content: "❌ You have not requested to join the group yet. Please request first.",
        });
        
        return

    } catch (err) {
        console.error(err);
        interaction.editReply({ content: "❌ Roblox API error, try again." });
        return
    }

  },
};

export default verifyCheckGroup;