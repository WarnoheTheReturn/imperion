import { SlashCommandBuilder, ChatInputCommandInteraction,User, EmbedBuilder, MessageFlags , PermissionFlagsBits, InteractionContextType, Role } from "discord.js";
import { Command } from "../../types";
import { Bot } from "../../types";
import { UsersModel } from "../../db/models/users"

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("manage_user")
    .setDescription("manage a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) => option
        .setName("user")
        .setDescription("The user to manage")
        .setRequired(true)
    )
    .addNumberOption((option) => option
        .setName("roblox_id")
        .setDescription("The roblox id")
    )
    .addRoleOption((option) => option
        .setName("rank")
        .setDescription("The rank")
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const user = interaction.options.getUser("user") as User;
    const roblox_id = interaction.options.getNumber("roblox_id") as number;
    const rank = interaction.options.getRole("rank") as Role;

    if (!user && !rank) {
      await interaction.editReply({ content : `❌ Please provide either a user or a rank!` });
    }

    const userData : UsersModel | null = await bot.db.tables.users.getById(user.id);
    
    if (!userData) {
      await interaction.editReply({ content : `❌ ${user.globalName} is not enlisted !` });
      return;
    }

    if (roblox_id) {
      userData.data.roblox_id = roblox_id;
    } 
    if (rank) {
      const rankData = await bot.db.tables.grades.getById(rank.id);
      if (!rankData) {
        await interaction.editReply({ content : `❌ Rank not found !` });
        return;
      } 
      userData.data.current_grade = rankData.data.role_id;
    }



    await userData.save();
    
    await interaction.editReply({ content : `✅ ${user.globalName} updated !` });

  },
};

export default command;
