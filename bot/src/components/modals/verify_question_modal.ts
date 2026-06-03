import {  ModalSubmitInteraction,ActionRowBuilder, TextInputBuilder, TextInputStyle ,MessageFlags} from "discord.js";
import type { ModalComponent } from "../../types/index";
import { ModalBuilder } from "discord.js";
import { verifySessions, checkVerifyComplete } from "../../store/verifySession";

const buildModal = () : ModalBuilder => {
  const input = new TextInputBuilder()
    .setCustomId("verify_question_input")
    .setLabel("How did you find our faction ?")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  return new ModalBuilder()
    .setCustomId("verify_faction_question_modal")
    .setTitle("How did you find us ?")
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(input)
    );
};


const verifyCheckGroup: ModalComponent  = {
  customId: "verify_faction_question_modal",
  component: buildModal(),

  execute: async (interaction: ModalSubmitInteraction) => {
    const answer = interaction.fields.getTextInputValue("verify_question_input");
    const session = verifySessions.get(interaction.user.id);
        if (!session) {
            await interaction.reply({ content: "❌ No session found", flags : MessageFlags.Ephemeral }); 
            return
        };


        session.howFound = answer;

        await interaction.reply({
            content: `✅ Response saved : ${answer}`,
            flags : MessageFlags.Ephemeral
        });

        await checkVerifyComplete(interaction.user.id);
  },
};

export default verifyCheckGroup;