import { SlashCommandBuilder, ChatInputCommandInteraction,AutocompleteInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits, ChannelType, Events } from "discord.js";
import { Command } from "../../types";
import { Bot } from "../../types";
import { EventState } from "../../types/index";
import {activeEvents, channelEvents, eventTypes,eventParticipants} from "../../store/event"
import { fetchMember } from "../../utils/fetchMember";
import { joinEvent } from "../../events/voiceStateUpdate";


const command: Command = {
  data: new SlashCommandBuilder()
    .setName("event-manage-start")
    .setDescription("start an event")
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
        filtered
          .filter(event => event.data.status == EventState.CREATED)
          .map((choice) => ({ name: `${choice.data.name} (${choice.data.id})`, value: choice.data.id.toString() }))
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

  if (logEvent.data.status == EventState.STARTED) {
    await interaction.editReply({ content : `❌ Event already started !` });
    return;
  }
  else if (logEvent.data.status == EventState.ENDED) {
    await interaction.editReply({ content : `❌ Event already ended !` });
    return;
  }

  const activeEventKey = activeEvents.keys().next().value
  if (activeEventKey) {
      await interaction.editReply({ content : `❌ There is already an active event !` });
      return;
  };

  
  const eventType = await bot.db.tables.event_type.getById(logEvent.data.type_id);
  if (!eventType) {
    await interaction.editReply({ content : `❌ Event type not found !` });
    return;
  }


  const allEventChannels = await bot.db.tables.event_channels.getAll();
  logEvent.data.status = EventState.STARTED;
  logEvent.data.start_time = new Date();
  await logEvent.save();

  activeEvents.set(eventId, logEvent.data);
  channelEvents.set(eventId, allEventChannels);
  eventTypes.set(logEvent.data.type_id, eventType.data);
  eventParticipants.set(eventId, []);

  for (const channelData of allEventChannels) {
    const channel  = await bot.channels.cache.get(channelData.data.channel_id);

    if (!channel || channel.type !== ChannelType.GuildStageVoice && channel.type !== ChannelType.GuildVoice) {
      await interaction.editReply({ content : `❌ Channel <#${channelData.data.channel_id}> not found !` });
      return;
    };

    for (const [id,member] of channel.members) {
      await joinEvent(eventId, channelData,member.id);
    }
  }

  
      

  await interaction.editReply({ content : `✅ Event started !` });

  },
};

export default command;
