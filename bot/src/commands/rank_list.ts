import { SlashCommandBuilder, ChatInputCommandInteraction,User,GuildMember,Role, EmbedBuilder, MessageFlags , PermissionFlagsBits } from "discord.js";
import { Command } from "../types";
import { Bot } from "../types";


const command: Command = {
  data: new SlashCommandBuilder()
    .setName("rank_list")
    .setDescription("List all ranks")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();



    const gradesDatas = await bot.db.tables.grades.getAll();
    if (gradesDatas.length === 0) {
      await interaction.editReply({ content : `❌ No grade found !` });
      return;
    };
    let count = 0;
    const embed = new EmbedBuilder()
      .setTitle("Rank List")
      .setColor("#1840da");
    for (const gradeData of gradesDatas) {
      if (count >= 24) {
        break;
      }
      const role = interaction.guild?.roles.cache.get(gradeData.data.role_id) as Role;
      embed.addFields({ name: role.name, value: `<@&${role.id}> : Level: ${gradeData.data.level} | XP Requirements: ${gradeData.data.xp_requirements}` });
      count++;
    }
    embed.setFooter({ text: `Total ${gradesDatas.length} ranks (only 24 shown)` });
    await interaction.editReply({ embeds: [embed] });

  },
};

export default command;
