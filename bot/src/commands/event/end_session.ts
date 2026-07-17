import { SlashCommandBuilder, ChatInputCommandInteraction,AutocompleteInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits, ChannelType, InteractionContextType ,Events} from "discord.js";
import { Command, LogChannelType } from "../../types";
import { Bot } from "../../types";
import { EventState } from "../../types/index";
import {activeEvents, channelEvents, eventTypes,eventParticipants} from "../../store/event"
// import { addXp } from "../../events/voiceStateUpdate";
import { LogsEventParticipantsData } from "../../db/models/logs_event_participants";
import {fetchMember} from "../../utils/fetchMember";
import sleep from "../../utils/sleep"
import {leaveEvent} from "../../events/voiceStateUpdate"



const command: Command = {
  data: new SlashCommandBuilder()
    .setName("event-manage-end")
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
        filtered
          .filter(event => event.data.status == EventState.STARTED)
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

  if (logEvent.data.status == EventState.ENDED) {
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
  let description = `Time : ${new Date().getTime() - (logEvent.data.start_time!).getTime() }\n `;
  let memberNotInDB = []

  const allEventChannel = await bot.db.tables.event_channels.getAll()

  for (const participant of allEventParticipants) {
    const userId = participant.user_id;
    const joinedChannelId = participant.channel_id || "";
    const channelData = allEventChannel.find(c => c.data.channel_id === joinedChannelId);
    if (!channelData) {
      await interaction.editReply({ content : `❌ Channel not found for user ${userId}` });
      return;
    }
    

    const allLogsEventParticipant = await bot.db.tables.logs_event_participants.getAll();
    const memberData = await bot.db.tables.users.getById(userId);


    const participantData : LogsEventParticipantsData = {
      id : allLogsEventParticipant.length,
      user_id : userId,
      event_id : Number(eventId),
      duration_minutes : participant.total_minute,
      xp : participant.current_xp,
      bonus_xp : 0
    };
    await bot.db.tables.logs_event_participants.create(participantData);

    try {
      await leaveEvent(eventId,channelData ,userId );
    }
    catch(err) {
      console.log(err);
      memberNotInDB.push([userId,participant.current_xp])
      continue;
    }

    if (!memberData) {
      memberNotInDB.push([userId,participant.current_xp])
    } else {
      memberData.data.xp += participant.current_xp;
      description += `<@${userId}> (${participant.current_xp} xp)\n`;

    }
    
  }

  description += `\nMembers not in database (Need to be verify to be in the database with xp) :\n`;
  for (const member of memberNotInDB) {
    description += `<@${member[0]}> (${member[1]} xp)\n`;
  }

  

  const embed = new EmbedBuilder()
    .setTitle(`${eventType.name} ended`)
    .setDescription(description)
    .setColor("#123456")


  await bot.log.logEvent(logEvent.data.id ,description);

  await interaction.editReply({ embeds : [embed] });
  },
};

export default command;