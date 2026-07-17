import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits, ChannelType , InteractionContextType   } from "discord.js";
import { Command } from "../../types";
import { Bot } from "../../types";
import { eventParticipantData, eventParticipants } from "../../store/event";
import { channel } from "node:diagnostics_channel";


const command: Command = {
  data: new SlashCommandBuilder()
    .setName("event-manage-current")
    .setDescription("remove an event channel")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const eventData = await bot.db.tables.logs_event.getAll();

    let isCurrentEvent = false

    for ( const event of eventData ) {
      if (event.data.start_time && !event.data.end_time) {
          const trackedMember = eventParticipants.get(event.data.id.toString());
          if (!trackedMember || !trackedMember.length) {
            await interaction.editReply({ content: `❌ No member are tracked for this event !` });
            return
          };

          const memberGroupedByChannel = new Map<string, eventParticipantData[]>();

          for (const member of trackedMember) {
            const channelId = member.channel_id ?? "null";
            const list = memberGroupedByChannel.get(channelId) ?? [];
            list.push(member)
            memberGroupedByChannel.set(channelId,list)
          }

          let description = ""
          for (const [channelId, list] of memberGroupedByChannel) {
            description += `Channel <#${channelId}> :\n`
            description += list.map(member => `<@${member.user_id}> (${member.current_xp} xp)`).join("\n")

          }

          const embed = new EmbedBuilder()
              .setTitle(`Event: ${event.data.name}`)
              .setDescription(description)
              .setColor('#031194')
              .setTimestamp(event.data.start_time);


          await interaction.editReply({ embeds: [embed] });
          isCurrentEvent = true
          break
          
      }
    }

    if (!isCurrentEvent) {
        await interaction.editReply({ content : `❌ No current event !` });
        return;    
    }
  },

}

export default command;

