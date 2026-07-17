import { Event, Bot } from "../types";
import {activeEvents, channelEvents,eventParticipants, eventParticipantData,eventTypes} from "../store/event"
import {EventTypeData} from "../db/models/event_type"
import {EventChannelsModel} from "../db/models/events_channel"
import {LogsEventData} from "../db/models/logs_event"
import {Events,VoiceState} from "discord.js"

const event: Event = {
  name: Events.VoiceStateUpdate,
  once: false,
  async execute( oldState : VoiceState , newState : VoiceState , bot : Bot) {
    const userId = newState.id;
    const joinedChannelId = newState.channelId;
    const leftChannelId = oldState.channelId;
    if (!userId) return;
    if (joinedChannelId === leftChannelId) return;

    const eventId = activeEvents.keys().next().value
    if (!eventId) return;

   
    const allEventChannels = channelEvents.get(eventId);
    if ( !allEventChannels ) return;

    const joinedEvent  = newState.channelId && allEventChannels.map(c => c.data.channel_id).includes(newState.channelId);
    const leftEvent    = oldState.channelId && allEventChannels.map(c => c.data.channel_id).includes(oldState.channelId);
    const switchedTeam = joinedEvent && leftEvent;

    if (joinedEvent && !leftEvent) {
      const joinedChannelData = allEventChannels.find(c => c.data.channel_id === newState.channelId)!;
      await joinEvent(eventId,joinedChannelData,userId)
    };
    if ((!joinedEvent && leftEvent) ) {
      // const xpToAddToUser = addXp(userId, allEventParticipants, allEventChannels, eventType, activeEvent, joinedChannelId, leftChannelId, switchedTeam, activeEventKey);
      const leavedChannelData = allEventChannels.find(c => c.data.channel_id === oldState.channelId)!;
      await leaveEvent(eventId,leavedChannelData, userId)

    }
    if (switchedTeam) {
      const leavedChannelData = allEventChannels.find(c => c.data.channel_id === oldState.channelId)!;
      await switchChannelEvent(eventId, leavedChannelData ,userId, newState.channelId!)
    }

  },
};




export async function joinEvent(eventId : string, joinedEventChannelData : EventChannelsModel  , userId : string) {

  const allEventParticipants = eventParticipants.get(eventId.toString());
  if (!allEventParticipants) return;
  let eventParticipationData = allEventParticipants.find(p => p.user_id === userId);
  if (!eventParticipationData) {
    const xpPourcentage = joinedEventChannelData.data.xp_pourcentage || 0;
    eventParticipationData = {
      user_id: userId,
      channel_id: joinedEventChannelData.data.channel_id,
      xp_pourcentage: xpPourcentage,
      joined_at: new Date(),
      total_minute: 0,
      current_xp: 0
    }
    console.log(`new data for user ${userId}`);

    allEventParticipants.push(eventParticipationData);
  } else {
    eventParticipationData.channel_id = joinedEventChannelData.data.channel_id;
    eventParticipationData.joined_at = new Date();
  
    eventParticipants.set(eventId, allEventParticipants);
  }
  console.log(`${userId} joined event ${eventId}`);
  return;
}



async function leaveORswitchEvent(eventId : string ,leavedEventChannelData : EventChannelsModel, userId : string,switchedTeam : boolean,joinedChannelId : string ) {
  const allEventParticipants = eventParticipants.get(eventId.toString());
  if (!allEventParticipants) return;
  const activeEvent = activeEvents.get(eventId);
  if (!activeEvent) return;
  const eventType = eventTypes.get(activeEvent.type_id);
  if (!eventType) return;

  let eventParticipationData = allEventParticipants.find(p => p.user_id === userId);
  const xpPerHour = eventType.xp_per_hour;
  const xpPourcentage = leavedEventChannelData.data.xp_pourcentage || 0;
  const xpToAddToUser = parseFloat((  ((new Date().getTime() - (eventParticipationData?.joined_at ??  activeEvent.created_at).getTime()) / 1000 / 60 / 60) * xpPerHour * (xpPourcentage / 100)).toFixed(2));
  const totalMinute = parseFloat(   ((new Date().getTime() - (eventParticipationData?.joined_at ?? activeEvent.created_at).getTime()) / 1000 / 60).toFixed(2) )

  if (eventParticipationData) {
    eventParticipationData.current_xp += xpToAddToUser;
    eventParticipationData.total_minute +=  totalMinute

    if (switchedTeam) {
      eventParticipationData.channel_id = joinedChannelId;
      eventParticipationData.joined_at = new Date();
    } else {
      eventParticipationData.channel_id = null;
      eventParticipationData.joined_at = null;
    }
  
    eventParticipants.set(eventId, allEventParticipants);
  } else {
    console.warn(`Data missing for user ${userId} in event ${eventId}`)
    if (switchedTeam) {
        eventParticipationData = {
        user_id: userId,
        channel_id: joinedChannelId,
        xp_pourcentage: xpPourcentage,
        joined_at: new Date(),
        total_minute: 0,
        current_xp: xpToAddToUser
        }
    } else {
        eventParticipationData = {
        user_id: userId,
        channel_id: null,
        xp_pourcentage: null,
        joined_at: null,
        total_minute: 0,
        current_xp: xpToAddToUser
      }
    }
    allEventParticipants.push(eventParticipationData);
    eventParticipants.set(eventId, allEventParticipants);
  }

  if (switchedTeam) {
    console.log(`${userId} switched vocal from ${leavedEventChannelData.data.channel_id} to ${joinedChannelId} with ${xpToAddToUser} xp`);
  } else {
    console.log(`${userId} left event ${eventId} with ${xpToAddToUser} xp`);
  }

  return;
}

export async function leaveEvent(eventId : string ,leavedEventChannelData : EventChannelsModel, userId : string) {
  await leaveORswitchEvent(eventId,leavedEventChannelData,userId,false,"" )

}
async function switchChannelEvent(eventId : string ,leavedEventChannelData : EventChannelsModel, userId : string,joinedChannelId : string ) {
  await leaveORswitchEvent(eventId,leavedEventChannelData,userId,true,joinedChannelId )
}

export default event;
