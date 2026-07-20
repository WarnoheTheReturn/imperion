import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, InteractionContextType, PermissionFlagsBits } from "discord.js";
import { Command } from "../../types";
import { Bot } from "../../types";
import { fetchMember } from "../../utils/fetchMember";
import { parseDate } from "../../utils/parseDate";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("sanction-rank-lock")
    .setDescription("rank lock a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addUserOption( user => user
        .setName("user")
        .setDescription("The user to rank lock")
        .setRequired(true)
      )
      .addRoleOption( role => role
        .setName("rank")
        .setDescription("the rank")
        .setRequired(true)
      )
      .addStringOption( reason => reason
        .setName("reason")
        .setDescription("The reason")
        .setRequired(true)
      )
      .addStringOption( duration => duration
        .setName("duration")
        .setDescription("The duration, DD/MM/YYYY HH:MM")
        .setRequired(true)

       ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();
    const user = await interaction.options.getUser("user",true);
    const reason = interaction.options.getString("reason", true);
    const duration = interaction.options.getString("duration", true);
    const rank = interaction.options.getRole("rank", true);




    const member = await fetchMember(interaction.guild!, user.id);
    const memberRole = member.roles.highest;
    const admin = await fetchMember(interaction.guild!,interaction.user.id)
    const adminRole = admin.roles.highest;
    const durationDate = parseDate(duration)
    const now = new Date();
    const memberData = await bot.db.tables.users.getById(user.id)
    const rankData = await bot.db.tables.grades.getById(rank.id)



    if (memberRole.position >= adminRole.position) {
        await interaction.editReply({ content : `❌ You cannot rank lock a user with higher role than yourself.` });
        return;
    } else if (member === admin) {
        await interaction.editReply({ content : `❌ You cannot rank lock your own account.` });
        return;
    } else if (!durationDate) {
        await interaction.editReply({ content : `❌ Invalid date format, please use : DD/MM/YYYY HH:MM.` });
        return;
    } else if (now > durationDate) {
        await interaction.editReply({ content : `❌ Invalid date, please use a future date.` });
        return;
    } else if (!memberData || !memberData.data.in_faction) {
        await interaction.editReply({ content : `❌ The user is not in the faction.` });
        return;
    } else if (!rankData) {
        await interaction.editReply({ content : `❌ The role selected is not a rank.` });
        return;
    }

    memberData.data.rank_lock_grade_id = rankData.data.role_id; 
    memberData.save()



    await bot.log.logRankLock(member.id,rankData.data.role_id,durationDate,interaction.user.id,reason)
    await interaction.editReply({ content : `✅ Member is now rank locked` });
  },
};

export default command;
