import { Embed, EmbedBuilder, TextChannel } from 'discord.js';
import { Database } from '../db/index';
import { Bot, LogChannelType } from '../types';


export class Logger {
  private client: Bot;
  private db: Database;

  constructor(client: Bot, db: Database) {
    this.client = client;
    this.db = db;
  }

  public info(message: string): void {
    console.log(`ℹ️ [INFO] ${message}`);
  }

  public warn(message: string): void {
    console.warn(`⚠️ [WARN] ${message}`);
  }

  public error(message: string, error?: any): void {
    console.error(`❌ [ERROR] ${message}`, error || "");
  }

  private async getLogChannel(type: string): Promise<TextChannel | null> {
    const logChannel = await this.db.tables.logs_log_channel.getById(type);
    if (!logChannel) {
      this.warn(`No log channel configured for type: ${type}`);
      return null;
    }
    
    const channel = this.client.channels.cache.get(logChannel.data.channel_id);
    if (!channel || !(channel instanceof TextChannel)) {
      this.warn(`Configured log channel with ID ${logChannel.data.channel_id} is not a valid text channel.`);
      await this.sendWarning(type);
      return null;
    }
    return channel as TextChannel;
  }

  private async sendWarning(type: string): Promise<void> {
    const guildId : string = this.client.config.discord.guildId;
    const logChannel = (await this.client.guilds.fetch(guildId)).systemChannel;
    if (!logChannel) {
      this.warn(`No system channel configured for type: ${type}`);
      return;
    }
    await logChannel.send(`⚠️log channel is not a valid text channel for type: ${type}`);
  }

  
    public async logPromotion(userId: string, previousGrade: string, updatedGrade: string): Promise<void> {
        const logChannel = await this.getLogChannel(LogChannelType.GRADES);
        if (!logChannel) return;
        const embed = new EmbedBuilder()
            .setTitle("Promotion Logged")
            .setDescription(`📈 User <@${userId}> was promoted from <@&${previousGrade}> to <@&${updatedGrade}>.`)
            .setColor("#");
        await logChannel.send({ embeds: [embed] });
        this.info(`Logged promotion for user ${userId} in channel ${logChannel.id}`);

  }

  public async logDemotion(userId: string, previousGrade: string, updatedGrade: string): Promise<void> {
    const logChannel = await this.getLogChannel(LogChannelType.GRADES);
    if (!logChannel) return;
    const embed = new EmbedBuilder()
        .setTitle("Demotion Logged")
        .setDescription(`📉 User <@${userId}> was demoted from <@&${previousGrade}> to <@&${updatedGrade}>.`)
        .setColor("#da1818");
    await logChannel.send({ embeds: [embed] });
    this.info(`Logged demotion for user ${userId} in channel ${logChannel.id}`);
  }

  public async logEnlistment(userId: string, robloxId: number, recruiterName: string | null, timezone: string, howFound: string): Promise<void> {
    const logChannel = await this.getLogChannel(LogChannelType.ENLISTMENT);
    if (!logChannel) return;
    const embed = new EmbedBuilder()
        .setTitle("Enlistment Logged")
        .setDescription(`📈 User <@${userId}> was enlisted.\nRoblox ID :  \`${robloxId}\`\n[Link](https://www.roblox.com/users/${robloxId}/profile) \
        \nRecruiter : ${recruiterName}\nTimezone : ${timezone}\nHow found : ${howFound} `)
        .setColor("#1840da");
    await logChannel.send({ embeds: [embed] });
    this.info(`Logged enlistment for user ${userId} in channel ${logChannel.id}`);
  }

  public async logDischarge(userId: string, robloxId: number): Promise<void> {
    const logChannel = await this.getLogChannel(LogChannelType.ENLISTMENT);
    if (!logChannel) return;
    const embed = new EmbedBuilder()
        .setTitle("Discharge Logged")
        .setDescription(`📉 User <@${userId}> was discharged.\nRoblox ID :  \`${robloxId}\`\n[Link](https://www.roblox.com/users/${robloxId}/profile) `)
        .setColor("#da1818");
    await logChannel.send({ embeds: [embed] });
    this.info(`Logged discharge for user ${userId} in channel ${logChannel.id}`);
  }

  
}