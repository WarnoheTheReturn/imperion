import { Event, Bot } from "../types";
import {EventState} from "../types/index";
import {activeEvents, channelEvents, eventTypes,eventParticipants} from "../store/event"
import {Events,ChannelType,ActivityType} from "discord.js"
import { joinEvent } from "./voiceStateUpdate";
import { getBotVersion } from '../utils/version';

async function reloadEvent(client : Bot) : Promise<void> {
  const allEvent = await client.db.tables.logs_event.getAll();
  const allEventChannels = await client.db.tables.event_channels.getAll();


  for (const event of allEvent) {
      if (event.data.status === EventState.STARTED) {
        activeEvents.set(event.data.id.toString(), event.data);
        channelEvents.set(event.data.id.toString(), allEventChannels);
        eventParticipants.set(event.data.id.toString(), []);
        const eventType =  await client.db.tables.event_type.getById(event.data.type_id.toString());
        if (eventType) {
          eventTypes.set(eventType.data.id, eventType.data);
        }
        for (const channelData of allEventChannels) {
            const channel  = await client.channels.cache.get(channelData.data.channel_id);
        
            if (!channel || channel.type !== ChannelType.GuildStageVoice && channel.type !== ChannelType.GuildVoice) {
              await client.log.logEventChannelNotFound(`Channel <#${channelData.data.channel_id}> not found !`);
              return;
            };
        
            for (const [id,member] of channel.members) {
              await joinEvent(event.data.id.toString(),channelData,member.id)
            }
        }
        
        console.info(`✅ Event ${event.data.name} restarted`);
      }
    }

}

const event: Event = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Bot) {
    await client.guilds.cache.first()?.members.fetch();
    await client.guilds.cache.first()?.channels.fetch();
    await client.guilds.cache.first()?.roles.fetch();
    const testConnection = await client.db.testConnection()
    if (!testConnection) {
      console.error("❌ Database connection failed");
      process.exit(1);
    }
    await reloadEvent(client);
    
    const version = getBotVersion()
    client.user?.setPresence({ 
      status: 'online', 
      activities: [
        { 
          type: ActivityType.Playing,
          name: `v${version}`, 
        } 
      ]
    });

    console.log(`✅ Bot connected as ${client.user?.tag}`);
  },
};

export default event;
