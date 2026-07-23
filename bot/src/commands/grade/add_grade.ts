import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, User, Role, PermissionFlagsBits, ChannelType , InteractionContextType } from "discord.js";
import { Command } from "../../types";
import { Bot } from "../../types";
import { GradesData } from "../../db/models/grades";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("add-rank")
    .setDescription("Add a rank to the database.")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((option) => option
        .setName("rank")
        .setDescription("The rank to add.")
        .setRequired(true)
    )
    .addNumberOption((option) => option
        .setName("xp")
        .setDescription("The amount of xp you want to set the rank at.")
        .setRequired(true)
    )
    .addNumberOption((option) => option
      .setName("position") 
      .setDescription("The rank's position in the hierarchy.")
      .setRequired(true)
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const grade = interaction.options.getRole("rank") as Role;
    const xp_requirements = interaction.options.getNumber("xp") as number;
    const level = interaction.options.getNumber("position") as number;

    const gradesDatas = await bot.db.tables.grades.getAll(); // switch en SELECT * FROM grades WHERE level = {level}
    let currentGradeData 

    for (let i = 0; i < gradesDatas.length; i++) {
      if (gradesDatas[i]?.data.level === level) {
        currentGradeData = gradesDatas[i];
        break;
      }
    }
    if (currentGradeData) {
      await interaction.editReply({ content : `❌ Level ${level} already exists !` });
      return;
    }


    const gradeData : GradesData = {
      role_id: grade.id,
      xp_requirements: xp_requirements,
      level: level
    }

    await bot.db.tables.grades.create(gradeData);

    await interaction.editReply({ content : `✅ ${grade.name} added !` });


    
  },
};

export default command;
