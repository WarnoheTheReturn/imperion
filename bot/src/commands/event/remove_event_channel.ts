import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits, ChannelType , InteractionContextType } from "discord.js";
import { Command } from "../../types";
import { Bot } from "../../types";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("event-channel-remove")
    .setDescription("remove an event channel")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) => option
        .setName("channel")
        .setDescription("The channel to remove")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
  const sent = await interaction.deferReply();
  const channel = interaction.options.getChannel("channel", true);

  const channelData  = await bot.db.tables.event_channels.getById(channel.id.toString());
  if (!channelData ) {
    await interaction.editReply({ content : `❌ Log channel not found !` });
    return;
  } 

  await bot.db.tables.event_channels.delete(channel.id.toString());
  await interaction.editReply({ content : `✅ Log channel removed !` });
  
  },
};

export default command;
