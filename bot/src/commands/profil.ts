import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, User } from "discord.js";
import { Command } from "../types";
import { Bot } from "../types";
import { UsersModel } from "../db/models/users"
import { GradesModel } from "../db/models/grades"

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("profil")
    .setDescription("view a member's profile")
    .addUserOption((option) => option
        .setName("user")
        .setDescription("The user to view")
        .setRequired(true)
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const user = interaction.options.getUser("user") as User;
    const userData : UsersModel | null = await bot.db.tables.users.getById(user.id);
    if (!userData) {
      await interaction.editReply({ content : `❌ ${user.globalName} is not enlisted !` });
      return;
    }

    
    let xp_requirements = "?";
    let next_grade_id = "?";
    const gradeData : GradesModel | null = await bot.db.tables.grades.getById(userData.data.current_grade);
    if (gradeData) {
        const nextGrade = await bot.db.tables.grades.nextGrade(gradeData.data.level);
        xp_requirements = (nextGrade?.xp_requirements)?.toString() || "?";
        next_grade_id = nextGrade?.role_id || "?";
    }

    let description = `Grade : <@&${userData.data.current_grade}>
    XP : ${userData.data.xp}/${xp_requirements} (Next grade : <@&${next_grade_id}>)
    Roblox Profil : https://www.roblox.com/users/${userData.data.roblox_id}/profile
    Enlistment date : ${userData.data.enlistment_date.getDate()}/${userData.data.enlistment_date.getMonth() + 1}/${userData.data.enlistment_date.getFullYear()}`;
    
    if (userData.data.is_inactivity) {
        description += `\n\nInactivity : Until ${userData.data.inactivity_duration}`;
    }
    if (userData.data.rank_lock_grade_id !== null) {
        description += `Rank lock : Until <@&${userData.data.rank_lock_grade_id}>`;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${user.globalName}'s profile`)
      .setThumbnail(user.displayAvatarURL({ size: 1024, extension: 'png' }))
      .setDescription(description)
      .setColor('#00aeff');

    if (userData.data.black_listed) {
        embed.setColor('#FF0000')
        .setTitle(`${user.globalName}'s profile (blacklisted)`);
    }
    if (!userData.data.in_faction) {
        embed.setColor('#252525')
        .setTitle(`${user.globalName}'s profile (not in the faction)`);
    }
    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
