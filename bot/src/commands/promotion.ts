import { SlashCommandBuilder, ChatInputCommandInteraction,User,GuildMember,Role, EmbedBuilder, MessageFlags } from "discord.js";
import { Command } from "../types";
import { Bot } from "../types";


const command: Command = {
  data: new SlashCommandBuilder()
    .setName("promotion")
    .setDescription("promote a member")
    .addUserOption((option) => option
        .setName("user")
        .setDescription("The username of the user you want to promote")
        .setRequired(true)
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const user = interaction.options.getUser("user") as User;


    const userData = await bot.db.tables.users.getById(user.id);
    if (!userData) {
      await interaction.editReply({ content : `❌ ${user.globalName} is not enlisted !` });
      return;
    }

    if (!userData.data.in_faction) {
      await interaction.editReply({ content : `❌ ${user.globalName} is not enlisted in the faction !` });
      return;
    }

    const member = interaction.guild?.members.cache.get(user.id) as GuildMember;
    const gradeData = await bot.db.tables.grades.getById(userData.data.current_grade);

    if (!gradeData) {
      await interaction.editReply({ content : `❌ Grade not found !` });
      return;
    }
    const nextGrade = await bot.db.tables.grades.nextGrade(gradeData.data.level);

    if (!nextGrade) {
      await interaction.editReply({ content : `❌ ${user.globalName} is already at the maximum grade !` });
      return;
    }

    if (userData.data.xp >= nextGrade.xp_requirements){

        const role = interaction.guild?.roles.cache.get(userData.data.current_grade) as Role;
        await member.roles.remove(role);
        const newRole = interaction.guild?.roles.cache.get(nextGrade.role_id) as Role;
        await member.roles.add(newRole);

        const oldGrade = userData.data.current_grade;
        userData.data.current_grade = nextGrade.role_id;
        userData.data.xp = 0;
        await userData.save();
        await bot.log.logPromotion(user.id, oldGrade, nextGrade.role_id);
        await interaction.editReply({ content : `✅ ${user.globalName} promoted !` });

        
    }
    else{
        await interaction.editReply({ content : `❌ ${user.globalName} doesn't have enough xp !` });
    }

  },
};

export default command;
