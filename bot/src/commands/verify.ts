import { SlashCommandBuilder,
    ButtonInteraction,
    ModalSubmitInteraction, 
    ChatInputCommandInteraction, 
    EmbedBuilder, 
    MessageFlags , 
    UserSelectMenuBuilder , 
    ActionRowBuilder , 
    StringSelectMenuBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    TextDisplayBuilder, 
    ContainerBuilder, 
    SeparatorBuilder,
    GuildMember,
    Role ,
    Guild,

} from "discord.js";
import { Command } from "../types";
import { Bot } from "../types";
import { verifySessions , waitForVerify} from "../store/verifySession";
import { UsersModel, UserData } from "../db/models/users";
import { GradesModel } from "../db/models/grades";
import {fetchMember} from "../utils/fetchMember";



const command: Command = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Lance la vérification") as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {


    const sent = await interaction.deferReply();



    const grades = await bot.db.tables.grades.getAll(); // switch with SELECT * FROM grades LIMIT 1 ORDER BY level ASC; for testing
    const gradeSorted = grades.sort((a, b) => a.data.level - b.data.level);
    if (grades.length === 0) {
      await interaction.editReply({ content : `❌ No grade found !` });
      return;
    };
    const lowerestGrade = gradeSorted[0] as GradesModel;
    const verifiedGrade = gradeSorted[1] as GradesModel;

    const member = await fetchMember(interaction.guild as Guild, interaction.user.id);
    const lowerestGradeRole = interaction.guild?.roles.cache.get(lowerestGrade.data.role_id) as Role;
    if (!member.roles.cache.has(lowerestGradeRole.id)) {
      await interaction.editReply({ content : `❌ ${interaction.user.globalName} as not the lowest rank !` });
      return;
    }

    const userData : UsersModel | null = await bot.db.tables.users.getById(interaction.user.id);
    if (userData && userData.data.in_faction) {
      await interaction.editReply({ content : `❌ ${interaction.user.globalName} is already verified !` });
      return;
    }
    else if (userData && userData.data.black_listed) {
      await interaction.editReply({ content : `❌ ${interaction.user.globalName} is blacklisted !` });
      return;
    }
    
    

    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## 🛡️ Verify account")
      )
      .addSeparatorComponents(new SeparatorBuilder())




      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("**1.** Who as recruted you ?")
      )
      .addActionRowComponents(
        new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
          bot.components.userSelects.verify_user_select.component 
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())




      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("**2.** In which timezone are you located ?")
      )
      .addActionRowComponents(
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          bot.components.stringSelects.verify_timezone_select.component
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())



      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("**3.** How did you find our faction ?")
      )
      .addActionRowComponents(
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          bot.components.buttons.verify_faction_question.component,
          
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("**4.** Join the Roblox group and verify your roblox account.")
          
      ).addActionRowComponents(
        new ActionRowBuilder<ButtonBuilder>().addComponents(
            bot.components.buttons.verify_roblox_api.build!(bot,interaction.user.id),
            bot.components.buttons.verify_check_roblox_api.component,
            
        )
          
      ).addActionRowComponents(
        new ActionRowBuilder<ButtonBuilder>().addComponents(
            bot.components.buttons.verify_group.component,
            bot.components.buttons.verify_check_group.component
            
        )
      )

    verifySessions.set(interaction.user.id, {});
    
    await interaction.editReply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });


    // WAIT 
    const wait = 1000 * 60 * 5;
    const session = await waitForVerify(interaction.user.id, wait);
    if (!session) {
      await interaction.editReply({ content: "❌ No session found" }); 
      return
    };


    const verifiedGradeRole = interaction.guild?.roles.cache.get(verifiedGrade.data.role_id) as Role;
    await member.roles.add(verifiedGradeRole);
    await member.roles.remove(lowerestGradeRole);

    if (userData && !userData.data.in_faction) {
      userData.data.in_faction = true;
      userData.data.current_grade = verifiedGrade.data.role_id;
      userData.data.enlistment_date = new Date();
      userData.data.roblox_id = session.robloxId!;
      userData.data.timezone = session.timezone!;
      userData.data.how_found = session.howFound!;
      userData.data.recruiter_id = session.recruitedBy ?? null;
      
      await userData.save();
    }
    else {
      const memberData : UserData = {
        id: interaction.user.id,
        xp: 0,
        current_grade: verifiedGrade.data.role_id,
        black_listed: false,
        in_faction: true,
        in_tww_faction: false,
        rank_lock_grade_id: null,
        is_inactivity: false,
        inactivity_duration: null,
          
        roblox_id: session.robloxId!,
        timezone : session.timezone!,
        how_found : session.howFound!,
        recruiter_id: session.recruitedBy ?? null,
        enlistment_date: new Date()
      };
      await bot.db.tables.users.create(memberData);
    }
    await bot.log.logEnlistment(interaction.user.id, session.robloxId!, session.recruitedBy ?? null, session.timezone!, session.howFound!);
    await interaction.editReply({
        components: [
            new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                .setContent(`🎉 **Verification complete !**\nWelcome <@${interaction.user.id}> !`)
            )
        ],
        flags: MessageFlags.IsComponentsV2,
    });

    
    

  },
};



export default command;
