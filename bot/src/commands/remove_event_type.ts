import { SlashCommandBuilder, ChatInputCommandInteraction, AutocompleteInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits, ChannelType } from "discord.js";
import { Command } from "../types";
import { Bot } from "../types";




const command: Command = {
  data: new SlashCommandBuilder()
    .setName("remove_event_type")
    .setDescription("remove an event type")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) => option
        .setName("name")
        .setDescription("The name of the event type")
        .setRequired(true)
        .setAutocomplete(true)
    ) as SlashCommandBuilder,

  autocomplete : async (interaction: AutocompleteInteraction, bot: Bot) => {
    const focusedValue = interaction.options.getFocused();
    const choices = await bot.db.tables.event_type.getAll();
    const filtered = choices.filter((choice) => choice.data.name.toLowerCase().startsWith(focusedValue.toLowerCase()));
    await interaction.respond(
      filtered.map((choice) => ({ name: choice.data.name, value: choice.data.id.toString() }))
    );
  },

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const eventTypeId  = interaction.options.getString("name", true);

    await bot.db.tables.event_type.delete(eventTypeId);
    await interaction.editReply({ content : `✅ Event type removed !` });

    
  },
};

export default command;
