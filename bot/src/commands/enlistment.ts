import { SlashCommandBuilder, ChatInputCommandInteraction,Role, GuildMember, EmbedBuilder, MessageFlags, User, PermissionFlagsBits } from "discord.js";
import { Command } from "../types";
import { Bot } from "../types";
import { UserData, UsersModel } from "../db/models/users"
import { GradesModel } from "../db/models/grades"

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("enlistment")
    .setDescription("add a member to the faction")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) => option
        .setName("user")
        .setDescription("The user to add")
        .setRequired(true)
    )
    .addNumberOption((option) => option
        .setName("roblox_id")
        .setDescription("The roblox id")
        .setRequired(true)
    )
    .addStringOption((option) => option
        .setName("ticket_link")
        .setDescription("The ticket link")
        .setRequired(true)
    )
    .addStringOption((option) => option
        .setName("recruiter")
        .setDescription("The recruiter")
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const user = interaction.options.getUser("user") as User;
    const roblox_id = interaction.options.getNumber("roblox_id") as number; // check valid id list
    const ticket_link = interaction.options.getString("ticket_link") as string; // check valid url
    const recruiter = interaction.options.getUser("recruiter");

    const grades = await bot.db.tables.grades.getAll(); // switch with SELECT * FROM grades LIMIT 1 ORDER BY level ASC; for testing
    const gradeSorted = grades.sort((a, b) => a.data.level - b.data.level);
    if (grades.length === 0) {
      await interaction.editReply({ content : `❌ No grade found !` });
      return;
    };
    const lowerestGrade = gradeSorted[0] as GradesModel;



    const userData : UsersModel | null = await bot.db.tables.users.getById(user.id);
    if (userData && userData.data.in_faction) {
      await interaction.editReply({ content : `❌ ${user.globalName} is already enlisted !` });
      return;
    }
    else if (userData && userData.data.black_listed) {
      await interaction.editReply({ content : `❌ ${user.globalName} is blacklisted !` });
      return;
    }
    
    const role = interaction.guild?.roles.cache.get(lowerestGrade.data.role_id) as Role;
    const member = interaction.guild?.members.cache.get(user.id) as GuildMember;
    await member.roles.add(role);

    if (userData && !userData.data.in_faction) {
      userData.data.in_faction = true;
      userData.data.current_grade = lowerestGrade.data.role_id;
      userData.data.enlistment_date = new Date();
      userData.data.roblox_id = roblox_id;
      userData.data.ticket_link = ticket_link;
      userData.data.recruiter_id = recruiter ? recruiter.id : null;
      
      await userData.save();
    }
    else {
      const memberData : UserData = {
        id: user.id,
        xp: 0,
        current_grade: lowerestGrade.data.role_id,
        black_listed: false,
        in_faction: true,
        in_tww_faction: false,
        rank_lock_grade_id: null,
        is_inactivity: false,
        inactivity_duration: null,
          
        roblox_id: roblox_id,
        ticket_link: ticket_link,
        recruiter_id: recruiter ? recruiter.id : null,
        enlistment_date: new Date()
      };
      await bot.db.tables.users.create(memberData);
    }
    await bot.log.logEnlistment(user.id, roblox_id, recruiter ? recruiter.globalName : null);
    await interaction.editReply({ content : `✅ ${user.globalName} enlisted !` });

  },
};

export default command;
