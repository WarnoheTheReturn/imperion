import { SlashCommandBuilder, ChatInputCommandInteraction,AutocompleteInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits, ChannelType } from "discord.js";
import { Command } from "../types";
import { Bot } from "../types";
import { EventState } from "../types/index";
import {activeEvents, channelEvents, eventTypes,eventParticipants} from "../store/event"
import { addXp } from "../events/voiceStateUpdate";


const command: Command = {
  data: new SlashCommandBuilder()
    .setName("end_event")
    .setDescription("end an event")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) => option
        .setName("name")
        .setDescription("The name of the event")
        .setRequired(true)
        .setAutocomplete(true)
    ) as SlashCommandBuilder,

  autocomplete : async (interaction: AutocompleteInteraction, bot: Bot) => {
      const focusedValue = interaction.options.getFocused(); 
      const choices = await bot.db.tables.logs_event.getAll();
      const filtered = choices.filter((choice) => choice.data.name.toLowerCase().startsWith(focusedValue.toLowerCase()));
      await interaction.respond(
        filtered.map((choice) => ({ name: `${choice.data.name} (${choice.data.id})`, value: choice.data.id.toString() }))
      );
    },
  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const eventId = interaction.options.getString("name", true);

    const logEvent = await bot.db.tables.logs_event.getById(eventId);
    if (!logEvent) {
      await interaction.editReply({ content : `❌ Event not found !` });
      return;
    }

    if (logEvent.data.status !== EventState.ENDED) {
      await interaction.editReply({ content : `❌ Event already ended !` });
      return;
    }

    

    logEvent.data.status = EventState.ENDED;
    logEvent.data.end_time = new Date();
    await logEvent.save();

    

    const allEventParticipants = eventParticipants.get(eventId.toString());
    const allEventChannels = channelEvents.get(eventId.toString());
    const eventType = eventTypes.get(logEvent.data.type_id);
    const activeEvent = activeEvents.get(eventId.toString());

    
    const leftChannelId = "";
    const switchedTeam = false;
    const activeEventKey = eventId.toString();
    if (!allEventParticipants || !allEventChannels || !eventType || !activeEvent) return;


    for (const participant of allEventParticipants) {
      const userId = participant.user_id;
      const joinedChannelId = participant.channel_id || "";
      await addXp(userId, allEventParticipants, allEventChannels, eventType, activeEvent, joinedChannelId, leftChannelId, switchedTeam, activeEventKey);
    }
    
    

    

    




    await interaction.editReply({ content : `✅ Event started !` });

  },
};

export default command;
