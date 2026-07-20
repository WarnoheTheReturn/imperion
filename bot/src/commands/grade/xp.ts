import { SlashCommandBuilder, ChatInputCommandInteraction, User,EmbedBuilder, MessageFlags , PermissionFlagsBits, InteractionContextType } from "discord.js";
import { Command , xpType} from "../../types";
import { Bot } from "../../types";
import { UsersModel } from "../../db/models/users"

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("xp")
    .setDescription("xp command")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) => option
        .setName("user")
        .setDescription("The username of the user that you’d like to view / edit.")
        .setRequired(true)
    )
    .addStringOption((option) => option
        .setName("action")
        .setDescription("The action")
        .setRequired(true)
        .addChoices(
            { name: "Add XP", value: "add" },
            { name: "Remove XP", value: "remove" },
            { name: "Set XP", value: "set" }
        )
    ) 
    .addNumberOption((option) => option
        .setName("amount")
        .setDescription("Amount of xp")
        .setRequired(true)
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const user = interaction.options.getUser("user") as User;
    const action = interaction.options.getString("action") as xpType;
    const amount = interaction.options.getNumber("amount") as number;

    const userData : UsersModel | null = await bot.db.tables.users.getById(user.id);
    if (!userData) {
      await interaction.editReply({ content : `❌ ${user.globalName} is not enlisted !` });
      return;
    }

    const previous_xp = userData.data.xp;

    if (action === "add") {
      userData.data.xp += amount;
    }
    else if (action === "remove") {
      userData.data.xp -= amount;
    }
    else if (action === "set") {
      userData.data.xp = amount;
    }
    await userData.save();

    const description = `<@${user.id}> ${action === "add" ? "was added by +" : action === "remove" ? "was removed by -" : "was set to "}${amount} XP`;


    await bot.log.logXp(action,description);

    
    await interaction.editReply({ content : `✅ ${user.globalName} updated from ${previous_xp} to ${userData.data.xp} !` });
    
  },
};

export default command;
