import { SlashCommandBuilder, ChatInputCommandInteraction,Role, GuildMember, EmbedBuilder, MessageFlags, User, PermissionFlagsBits } from "discord.js";
import { Command } from "../../types";
import { Bot } from "../../types";
import { UserData, UsersModel } from "../../db/models/users"
import { GradesModel } from "../../db/models/grades"

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("enlistment")
    .setDescription("add a member to the faction")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) => option
        .setName("user")
        .setDescription("The user to add")
        .setRequired(true)
    )
    .addNumberOption((option) => option
        .setName("roblox_id")
        .setDescription("The roblox id")
        .setRequired(true)
    )
    .addStringOption((option) => option
        .setName("ticket_link")
        .setDescription("The ticket link")
        .setRequired(true)
    )
    .addStringOption((option) => option
        .setName("recruiter")
        .setDescription("The recruiter")
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    await interaction.reply({ content : `❌ Deprecated` });



  },
};

export default command;
