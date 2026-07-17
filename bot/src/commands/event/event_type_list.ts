import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags,PermissionFlagsBits, ChannelType , InteractionContextType   } from "discord.js";
import { Command } from "../../types";
import { Bot } from "../../types";


const command: Command = {
  data: new SlashCommandBuilder()
    .setName("event-type-list")
    .setDescription("remove an event channel")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {

    const sent = await interaction.deferReply();

    const eventChannelsData = await bot.db.tables.event_type.getAll();

    if (!eventChannelsData.length) {
      await interaction.editReply({ content : `❌ No events types found !` });
      return;
    }

    const description = eventChannelsData.map((type) => `${type.data.name} with **${type.data.xp_per_hour}** xp per hour`).join("\n");
    await interaction.editReply({ content : `Events types :\n${description}` });
  }
}

export default command;
