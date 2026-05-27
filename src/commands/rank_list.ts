import { SlashCommandBuilder, ChatInputCommandInteraction,User,GuildMember,Role, EmbedBuilder, MessageFlags } from "discord.js";
import { Command } from "../types";
import { Bot } from "../types";


const command: Command = {
  data: new SlashCommandBuilder()
    .setName("rank_list")
    .setDescription("List all ranks") as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();



    const gradesDatas = await bot.db.tables.grades.getAll();
    if (gradesDatas.length === 0) {
      await interaction.editReply({ content : `❌ No grade found !` });
      return;
    };
    const embed = new EmbedBuilder()
      .setTitle("Rank List")
      .setColor("#1840da");
    for (const gradeData of gradesDatas) {
      const role = interaction.guild?.roles.cache.get(gradeData.data.role_id) as Role;
      embed.addFields({ name: role.name, value: `<@&${role.id}> : Level: ${gradeData.data.level} | XP Requirements: ${gradeData.data.xp_requirements}` });
    }
    await interaction.editReply({ embeds: [embed] });

  },
};

export default command;
