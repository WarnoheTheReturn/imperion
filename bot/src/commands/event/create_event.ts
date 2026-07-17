import { SlashCommandBuilder, ChatInputCommandInteraction,AutocompleteInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits, ChannelType } from "discord.js";
import { Command } from "../../types";
import { Bot } from "../../types";
import { EventTypeModel } from "../../db/models/event_type";
import { LogsEventModel ,LogsEventData} from "../../db/models/logs_event";
import {EventState} from "../../types/index";


const command: Command = {
  data: new SlashCommandBuilder()
    .setName("create_event")
    .setDescription("create an event")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) => option
        .setName("name")
        .setDescription("The name of the event")
        .setRequired(true)
    ) 
    .addStringOption((option) => option
        .setName("type")
        .setDescription("The type of the event")
        .setRequired(true)
        .setAutocomplete(true)
    ) as SlashCommandBuilder,

  autocomplete : async (interaction: AutocompleteInteraction, bot: Bot) => {
      const focusedValue = interaction.options.getFocused(); 
      const choices = await bot.db.tables.event_type.getAll();      
      const filtered = choices.filter((choice) => choice.data.name.toLowerCase().startsWith(focusedValue.toLowerCase()));
      await interaction.respond(
        filtered.map((choice) => ({ name: `${choice.data.name} (${choice.data.id})`, value: choice.data.id.toString() }))
      );
    },

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
  const sent = await interaction.deferReply();

  const eventName = interaction.options.getString("name", true);
  const typeId = interaction.options.getString("type", true);

  const eventType = await bot.db.tables.event_type.getById(typeId);
  if (!eventType) {
    await interaction.editReply({ content : `❌ Event type not found !` });
    return;
  }

  const allLogsEvent = await bot.db.tables.logs_event.getAll();

  const maxId = allLogsEvent.reduce((max, logEvent) => Math.max(max, logEvent.data.id), 0);

  const logEventId = maxId + 1;

  const logEventModel : LogsEventData = {
      id: logEventId,
      name: eventName,
      type_id: Number(typeId),
      host_id: interaction.user.id,
      start_time: null,
      end_time: null,
      created_at: new Date(),
      status: EventState.CREATED,
  };

  await bot.db.tables.logs_event.create(logEventModel);
  await interaction.editReply({ content : `✅ Event created !` });

  },
};

export default command;
