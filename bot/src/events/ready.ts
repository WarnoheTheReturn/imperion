import { Event, Bot } from "../types";

const event: Event = {
  name: "clientReady",
  once: true,
  async execute(client: Bot) {
    await client.guilds.cache.first()?.members.fetch();
    console.log(`✅ Bot connected as ${client.user?.tag}`);
  },
};

export default event;
