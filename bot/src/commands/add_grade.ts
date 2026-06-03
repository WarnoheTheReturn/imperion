import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, User, Role, PermissionFlagsBits} from "discord.js";
import { Command } from "../types";
import { Bot } from "../types";
import { GradesData } from "../db/models/grades";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("add_grade")
    .setDescription("add a grade to the database")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((option) => option
        .setName("grade")
        .setDescription("The grade to add")
        .setRequired(true)
    )
    .addNumberOption((option) => option
        .setName("xp_amount")
        .setDescription("The xp amount")
        .setRequired(true)
    )
    .addNumberOption((option) => option
      .setName("level") 
      .setDescription("The grade level in the hierarchy")
      .setRequired(true)
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const grade = interaction.options.getRole("grade") as Role;
    const xp_requirements = interaction.options.getNumber("xp_amount") as number;
    const level = interaction.options.getNumber("level") as number;

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
