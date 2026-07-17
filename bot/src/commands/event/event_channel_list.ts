import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags ,PermissionFlagsBits} from "discord.js";
import { Command } from "../../types";
import { Bot } from "../../types";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("event-channel-list")
    .setDescription("remove an event channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const eventChannelsData = await bot.db.tables.event_channels.getAll();

    if (!eventChannelsData.length) {
      await interaction.editReply({ content : `❌ No events channels found !` });
      return;
    }

    const description = eventChannelsData.map((channel) => `<#${channel.data.channel_id}> with **${channel.data.xp_pourcentage}%** xp pourcentage`).join("\n");
    await interaction.editReply({ content : `Events channels :\n${description}` });
  },

}

export default command;



