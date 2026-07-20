import cron from 'node-cron';
import { EmbedBuilder , ChannelType, Role, MessageFlags , ContainerBuilder, TextDisplayBuilder, SeparatorBuilder,SeparatorSpacingSize} from 'discord.js'
import { Bot, LogChannelType } from '../types';


export const startWeeklyBulletin = async (bot : Bot) => {
    cron.schedule('00 12 * * 0', async () => {
        const channelData = await bot.db.tables.logs_log_channel.getById(LogChannelType.BULLETIN);
        if (!channelData) {
            return;
        }

        const channel = await bot.channels.cache.get(channelData.data.channel_id)
        if (!channel || channel.type !== ChannelType.GuildText) {
            console.log(`❌ Bulletin channel not found or is not a text channel`);
            return;
        }


        const allMemberData = await bot.db.tables.users.getAll();
        const guildId = bot.config.discord.guildId;
        const guild = bot.guilds.cache.get(guildId);
        if (!guild) {
            return;
        }
        
        let memberPromoted : {
            memberId : string;
            oldGradeId : string | null;
            newGradeId: string;
        }[] = [];

        for (const memberData of allMemberData) {
            if (!memberData.data.in_faction) {
              continue;
            }
            const member = guild.members.cache.get(memberData.data.id);
            if (!member) {
              continue;
            }

            const gradeData = await bot.db.tables.grades.getById(memberData.data.current_grade);
            let nextGrade;
            if (!gradeData) {
              nextGrade = await bot.db.tables.grades.nextGrade(-1);
            }
            else {
              nextGrade = await bot.db.tables.grades.nextGrade(gradeData.data.level);
            }

            if (!nextGrade) {
              continue;
            }
        
            if (memberData.data.xp >= nextGrade.xp_requirements && memberData.data.in_faction){
                
                if (gradeData) {
                  const role = guild.roles.cache.get(memberData.data.current_grade) as Role;
                  await member.roles.remove(role);
                }     
        
                const oldGrade = memberData.data.current_grade;
                memberData.data.current_grade = nextGrade.role_id;
                memberData.data.xp = 0;
                await memberData.save();
        
                const newRole = guild.roles.cache.get(nextGrade.role_id) as Role;
                await member.roles.add(newRole);
                
                await bot.log.logPromotion(member.id, oldGrade, nextGrade.role_id);

                memberPromoted.push({
                    memberId : member.id,
                    oldGradeId : oldGrade,
                    newGradeId : nextGrade.role_id

                })
            }
            else{
                continue;
            }
        
        }


        const promotionSummary = memberPromoted.length ? memberPromoted
            .map((memberPromoted, index) => {
                const oldRole = memberPromoted.oldGradeId
                    ? guild.roles.cache.get(memberPromoted.oldGradeId)
                    : null;

                const newRole = guild.roles.cache.get(
                    memberPromoted.newGradeId,
                );

                return `<@${memberPromoted.memberId}> :\nFrom ${oldRole ?? 'Unranked'} to ${newRole ?? 'Unknown rank'}`;
            }).join('\n\n')  : 'No promotion were recorded this week.';

        const bulletin = new ContainerBuilder()
            .setAccentColor(0x5865F2)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `# Weekly bulletin\nWeekly rank progression report\n-# Published at <t:${Math.floor(Date.now() / 1000)}:D>`,
                ),
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Large)
                    .setDivider(true),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `## Promotions\n\n${promotionSummary.slice(0, 3500)}`,
                ),
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Large)
                    .setDivider(true),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `-# ${memberPromoted.length} promotions recorded this week.`,
                )
            );

        await channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [bulletin],
        });

        console.log(`✅ Weekly bulletin sent to ${channel.name}`);


        },
        {
            timezone : 'Europe/Paris'
        }
    )

    console.log('📅 Weekly bulletin started')


}