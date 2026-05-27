import { SlashCommandBuilder, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { Command, LogChannelType } from "../types";
import { Bot } from "../types";
import { LogsLogChannelRow } from "../db/models/logs_log_channel";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("log_channel")
    .setDescription("add a log channel to the database")
    .addStringOption((option) => option
        .setName("type")
        .setDescription("The type of log")
        .setRequired(true)
        .addChoices(
          ...Object.entries(LogChannelType).map(([name, value]) => ({ name, value }))
        )
    ) 
    .addChannelOption((option) => option
        .setName("channel")
        .setDescription("The channel to log")
        .setRequired(true)
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const channel_type = interaction.options.getString("type") as string;
    const channel = interaction.options.getChannel("channel") as TextChannel;

    const logChannelData : LogsLogChannelRow = {
      type: channel_type,
      channel_id: channel.id.toString(),
    };

    await bot.db.tables.logs_log_channel.create(logChannelData);

    await interaction.editReply({ content : `✅ Log channel added !` });
  },
};

export default command;
