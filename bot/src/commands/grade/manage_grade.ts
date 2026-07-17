import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, User, Role , AutocompleteInteraction, Guild, GuildMember , PermissionFlagsBits} from "discord.js";
import { Command } from "../../types";
import { Bot } from "../../types";
import { GradesModel } from "../../db/models/grades";
import { fetchMember } from "../../utils/fetchMember";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("grade-manage-modify")
    .setDescription("modify a grade")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) => option
        .setName("grade")
        .setDescription("The grade to modify")
        .setRequired(true)
        .setAutocomplete(true) 
    )
    .addNumberOption((option) => option
      .setName("xp_amount")
      .setDescription("The xp amount")
      .setRequired(true)
    ) as SlashCommandBuilder,


    autocomplete: async (interaction: AutocompleteInteraction, client: Bot) => {
        const focusedValue = interaction.options.getFocused();
        const grades = await client.db.tables.grades.getAll();
        const gradeIds = new Set(grades.map((grade) => grade.data.role_id));
        const guild = client.guilds.cache.get(interaction.guildId ?? "");

       
        const gradeRoles = guild?.roles.cache
            .filter((role) => gradeIds.has(role.id))
            .map((role) => ({ id: role.id, name: role.name })) ?? [];

        if (gradeRoles.length === 0) {
            await interaction.respond([{ name: "No grades found", value: "no_grades" }]);
            return;
        }

        const filtered = gradeRoles
            .filter((role) => role.name.toLowerCase().startsWith(focusedValue.toLowerCase()))
            .slice(0, 25);

        await interaction.respond(
            filtered.map((role) => ({ name: role.name, value: role.id }))
        );
    },

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {

    const sent = await interaction.deferReply();
    const gradeId = interaction.options.getString("grade") as string
    const xpAmount = interaction.options.getNumber("xp_amount") as number;

    const gradeDb = await bot.db.tables.grades.getById(gradeId);
    if (!gradeDb) {
      await interaction.editReply({ content : `❌ Grade not found !` });
      return;
    }
    
    gradeDb.data.xp_requirements = xpAmount;
    await gradeDb.save();

    const embed = new EmbedBuilder()
      .setTitle("Grade Modified")
      .setColor("#1840da")
      .setDescription(`✅ Grade <@&${gradeDb.data.role_id}> modified !\nNew xp amount : ${xpAmount} xp`);
    await interaction.editReply({ embeds: [embed] });
    
  },
};

export default command;
