import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits, ChannelType } from "discord.js";
import { Command } from "../types";
import { Bot } from "../types";
import { EventTypeData } from "../db/models/event_type";




const command: Command = {
  data: new SlashCommandBuilder()
    .setName("add_event_type")
    .setDescription("add an event type")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) => option
        .setName("name")
        .setDescription("The name of the event type")
        .setRequired(true)
    )
    .addNumberOption((option) => option
        .setName("xp_per_hour")
        .setDescription("The xp per hour")
        .setRequired(true)
    )
    .addNumberOption((option) => option
        .setName("bonus_xp")
        .setDescription("The bonus xp")
        .setRequired(true)
    )
    .addNumberOption((option) => option
        .setName("min_minutes")
        .setDescription("The min minutes")
        .setRequired(true)
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const name = interaction.options.getString("name", true);
    const xp_per_hour = interaction.options.getNumber("xp_per_hour", true);
    const bonus_xp = interaction.options.getNumber("bonus_xp", true);
    const min_minutes = interaction.options.getNumber("min_minutes", true);

    const allEventTypeData  = await bot.db.tables.event_type.getAll();
    const eventTypeData = allEventTypeData.find((eventType) => eventType.data.name === name);

    if (eventTypeData ) {
      await interaction.editReply({ content : `❌ Event type already exists !` });
      return;
    } 
    
    const maxId = allEventTypeData.reduce((max, eventType) => Math.max(max, eventType.data.id), 0);

    const eventType : EventTypeData = {
      id : maxId + 1,
      name: name,
      xp_per_hour: xp_per_hour,
      bonus_xp: bonus_xp,
      min_minutes: min_minutes,
    }

    await bot.db.tables.event_type.create(eventType);
    await interaction.editReply({ content : `✅ Event type added !` });

    
  },
};

export default command;
