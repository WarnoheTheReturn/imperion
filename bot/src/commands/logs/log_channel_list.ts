import { SlashCommandBuilder, ChatInputCommandInteraction, TextChannel,EmbedBuilder , PermissionFlagsBits } from "discord.js";
import { Command, LogChannelType } from "../../types";
import { Bot } from "../../types";
import { LogsLogChannelRow } from "../../db/models/logs_log_channel";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("log-channel-list")
    .setDescription("list all log channels")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const logChannelsDatas = await bot.db.tables.logs_log_channel.getAll();
    const embed = new EmbedBuilder()
      .setTitle("Log Channels")
      .setColor("#1840da");
        for (const logChannelData of logChannelsDatas) {
        const channel = interaction.guild?.channels.cache.get(logChannelData.data.channel_id) as TextChannel;
        embed.addFields({ name: logChannelData.data.type, value: `<#${channel.id}>` });
        }
    await interaction.editReply({ embeds: [embed] });

  },
};

export default command;
