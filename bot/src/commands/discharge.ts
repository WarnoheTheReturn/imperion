import { SlashCommandBuilder, ChatInputCommandInteraction,User, Role, GuildMember, EmbedBuilder, MessageFlags, Guild , PermissionFlagsBits } from "discord.js";
import { Command } from "../types";
import { Bot } from "../types";
import { UserData, UsersModel } from "../db/models/users"

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("discharge")
    .setDescription("discharge a member from the faction")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) => option
        .setName("user")
        .setDescription("The user to discharge")
        .setRequired(true)
    )
    .addStringOption((option) => option
        .setName("reason")
        .setDescription("The reason for the discharge")
        .setRequired(true)
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const user = interaction.options.getUser("user") as User;
    const reason = interaction.options.getString("reason") as string;

    const userData : UsersModel| null = await bot.db.tables.users.getById(user.id);
    if (!userData) {
      await interaction.editReply({ content : `❌ ${user.globalName} is not enlisted !` });
      return;
    }
    if (!userData.data.in_faction) {
      await interaction.editReply({ content : `❌ ${user.globalName} is not enlisted in the faction !` });
      return;
    }

    userData.data.in_faction = false;
    await userData.save();

    const member = interaction.guild?.members.cache.get(user.id) as GuildMember;
    if (userData.data.current_grade) {
      const role = interaction.guild?.roles.cache.get(userData.data.current_grade) as Role;
      await member.roles.remove(role);
    }

    await bot.log.logDischarge(user.id, userData.data.roblox_id);
    

    await interaction.editReply({ content : `✅ ${user.globalName} discharged !` });


    
  },
};

export default command;
