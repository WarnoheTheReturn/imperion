import { Event, Bot } from "../types";
import {activeEvents, channelEvents,eventParticipants, eventParticipantData,eventTypes} from "../store/event"
import {EventTypeData} from "../db/models/event_type"
import {EventChannelsModel} from "../db/models/events_channel"
import {LogsEventData} from "../db/models/logs_event"

export function addXp(userId : string, allEventParticipants : eventParticipantData[], allEventChannels : EventChannelsModel[], eventType : EventTypeData, activeEvent : LogsEventData, joinedChannelId : string, leftChannelId : string, switchedTeam : boolean, activeEventKey : string) {
    let eventParticipationData = allEventParticipants.find(p => p.user_id === userId);
    const xpPerHour = eventType.xp_per_hour;
    const xpPourcentage = allEventChannels.find(c => c.data.channel_id === leftChannelId)?.data.xp_pourcentage || 0;
    const xpToAddToUser = parseFloat((  ((new Date().getTime() - (eventParticipationData?.joined_at ??  activeEvent.created_at).getTime()) / 1000 / 60 / 60) * xpPerHour * (xpPourcentage / 100)).toFixed(2));
    
    if (eventParticipationData) {
      eventParticipationData.current_xp += xpToAddToUser;
    if (switchedTeam) {
        eventParticipationData.channel_id = joinedChannelId;
        eventParticipationData.joined_at = new Date();
    } else {
        eventParticipationData.channel_id = null;
        eventParticipationData.joined_at = null;
    }
    
    eventParticipants.set(activeEventKey, allEventParticipants);
    } else {

    if (switchedTeam) {
        eventParticipationData = {
        user_id: userId,
        channel_id: joinedChannelId,
        xp_pourcentage: xpPourcentage,
        joined_at: new Date(),
        current_xp: xpToAddToUser
        }
    } else {
        eventParticipationData = {
        user_id: userId,
        channel_id: null,
        xp_pourcentage: null,
        joined_at: null,
        current_xp: xpToAddToUser
        }
    }
    }

    return xpToAddToUser;
}

const event: Event = {
  name: "voiceStateUpdate",
  once: false,
  async execute( oldState,  newState , bot : Bot) {
    const userId = newState.id;
    const joinedChannelId = newState.channelId;
    const leftChannelId = oldState.channelId;
    if (!userId) return;
    if (joinedChannelId === leftChannelId) return;

    const activeEventKey = activeEvents.keys().next().value
    console.log(activeEventKey)
    if (!activeEventKey) return;

    const activeEvent = activeEvents.get(activeEventKey);
    const allEventChannels = channelEvents.get(activeEventKey);
    if (!activeEvent || !allEventChannels ) return;

    const eventType = eventTypes.get(activeEvent.type_id);
    if (!eventType) return;

    const allEventParticipants = eventParticipants.get(activeEvent.type_id.toString());
    if (!allEventParticipants) return;  



    const joinedEvent  = newState.channelId && allEventChannels.map(c => c.data.channel_id).includes(newState.channelId);
    const leftEvent    = oldState.channelId && allEventChannels.map(c => c.data.channel_id).includes(oldState.channelId);
    const switchedTeam = joinedEvent && leftEvent;

    if (joinedEvent && !leftEvent) {
      let eventParticipationData = allEventParticipants.find(p => p.user_id === userId);
      if (!eventParticipationData) {
        const xpPourcentage = allEventChannels.find(c => c.data.channel_id === joinedChannelId)?.data.xp_pourcentage || 0;
        eventParticipationData = {
          user_id: userId,
          channel_id: joinedChannelId,
          xp_pourcentage: xpPourcentage,
          joined_at: new Date(),
          current_xp: 0
        }
        allEventParticipants.push(eventParticipationData);
      } else {
        eventParticipationData.channel_id = joinedChannelId;
        eventParticipationData.joined_at = new Date();
      
        eventParticipants.set(activeEventKey, allEventParticipants);
      }
      console.log(`${userId} joined event ${activeEventKey}`);
      return;
    };
    if ((!joinedEvent && leftEvent) || switchedTeam) {
      const xpToAddToUser = addXp(userId, allEventParticipants, allEventChannels, eventType, activeEvent, joinedChannelId, leftChannelId, switchedTeam, activeEventKey);
      if (switchedTeam) {
        console.log(`${userId} switched vocal from ${leftChannelId} to ${joinedChannelId} with ${xpToAddToUser} xp`);
      } else {
        console.log(`${userId} left event ${activeEventKey} with ${xpToAddToUser} xp`);
      }
      

      return;
    }

  },
};

export default event;
