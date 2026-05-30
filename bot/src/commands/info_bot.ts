import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { Command } from "../types";
import { Bot } from "../types";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("info_bot")
    .setDescription("info about the bot") as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();
    if (!bot.user) return;

    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;
    const version = require("../../package.json").version; 

    const embed = new EmbedBuilder()
    .setTitle("🤖 Informations")
    .setColor("#1840da")
    .setThumbnail(bot.user?.displayAvatarURL()) 
    .addFields(
        { name: "🏠 Guilds",   value: bot.guilds.cache.size.toString(),                              inline: true },
        { name: "👥 Users", value: bot.users.cache.size.toString(),                             inline: true },
        { name: "⚡ Commands",   value: bot.commands.size.toString(),                                 inline: true },
        { name: "⏱️ Uptime",      value: uptimeStr,                                                    inline: true },
        { name: "🧠 Memory",     value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
        { name: "🔖 Version",     value: `v${version}`,                                               inline: true },
        { name: "✍️ Author",      value: `<@${"1401153828195139757"}>`,                               inline: true },
        { name: "🌐 Website",    value: `[imperion.onrender.com](https://imperion.onrender.com/)`,   inline: true },
    )
    .setTimestamp();
        
        await interaction.editReply({ embeds: [embed]}  );
    },
};

export default command;
