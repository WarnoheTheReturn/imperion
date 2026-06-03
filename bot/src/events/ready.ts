import { Event, Bot } from "../types";
import {EventState} from "../types/index";
import {activeEvents, channelEvents, eventTypes,eventParticipants} from "../store/event"

const event: Event = {
  name: "clientReady",
  once: true,
  async execute(client: Bot) {
    await client.guilds.cache.first()?.members.fetch();

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
      }
    }

    console.log(`✅ Bot connected as ${client.user?.tag}`);
  },
};

export default event;
