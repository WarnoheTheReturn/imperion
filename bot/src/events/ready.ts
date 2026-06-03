import { Event, Bot } from "../types";

const event: Event = {
  name: "clientReady",
  once: true,
  async execute(client: Bot) {
    console.log(`✅ Bot connected as ${client.user?.tag}`);
  },
};

export default event;
