import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits, ChannelType } from "discord.js";
import { Command } from "../types";
import { Bot } from "../types";
import { EventChannelsData } from "../db/models/events_channel";


const command: Command = {
  data: new SlashCommandBuilder()
    .setName("add_event_channel")
    .setDescription("add an event channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) => option
        .setName("channel")
        .setDescription("The channel to log")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildStageVoice , ChannelType.GuildVoice)
    )
    .addIntegerOption((option) => option
        .setName("xp_pourcentage")
        .setDescription("The xp pourcentage")
        .setRequired(true)
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const channel = interaction.options.getChannel("channel", true);
    const xp_pourcentage = interaction.options.getInteger("xp_pourcentage", true);

    const channelData  = await bot.db.tables.event_channels.getById(channel.id.toString());

    if (channelData ) {
      await interaction.editReply({ content : `❌ Log channel already exists !` });
      return;
    } 

    const logChannelData : EventChannelsData = {
      channel_id: channel.id.toString(),
      xp_pourcentage: xp_pourcentage,
    };

    await bot.db.tables.event_channels.create(logChannelData);
    await interaction.editReply({ content : `✅ Log channel added !` });

  },
};

export default command;
