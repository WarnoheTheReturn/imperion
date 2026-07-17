import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags ,PermissionFlagsBits, Embed, InteractionContextType } from "discord.js";
import { Command } from "../../types";
import { Bot } from "../../types";
import { EventState } from "../../types/index";
import { LogsEventData, LogsEventModel } from "../../db/models/logs_event";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("event-manage-list")
    .setDescription("remove an event channel")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const eventChannelsData = await bot.db.tables.logs_event.getAll();

    if (!eventChannelsData.length) {
      await interaction.editReply({ content : `❌ No events found !` });
      return;
    }

    const eventGroupedByStatus = new Map<EventState, LogsEventModel[]>();

    for (const eventChannelData of eventChannelsData) {
      const status = eventChannelData.data.status;
      const list = eventGroupedByStatus.get(status) ?? [];
      list.push(eventChannelData);
      eventGroupedByStatus.set(status, list);
    }

    let description = "";
    for (const [status, list] of eventGroupedByStatus) {
      description += `**${status}** (Total: ${list.length}) :\n`
      description += list.map(event => `- ${event.data.name} (${event.data.id})`).join(`\n`)
      description += "\n\n"

    }

    const embed = new EmbedBuilder()
      .setTitle("**Event Statuses** :")
      .setDescription(description)
      .setColor("#123456");




    await interaction.editReply({ embeds: [embed] });



  },

}

export default command;