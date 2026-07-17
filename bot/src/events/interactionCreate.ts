import { Events, 
  BaseInteraction, 
  ChatInputCommandInteraction ,
  AutocompleteInteraction,
  MessageFlags
} from 'discord.js';


import { Event, Command, Bot } from '../types';

const event: Event = {
  name: Events.InteractionCreate, 
  once: false,
  

  async execute(interaction: BaseInteraction, client: Bot) {

    if (interaction.isButton()) {
      return client.components.handleButton(interaction, client);
    } 
     else if (interaction.isUserSelectMenu()) {
      return client.components.handleUserSelect(interaction, client);
    }  
     else if (interaction.isStringSelectMenu()) {
      return client.components.handleStringSelect(interaction, client);
    }
     else if (interaction.isModalSubmit()) {
      return client.components.handleModal(interaction, client);
    }

      
    

    const commandInteraction = interaction as ChatInputCommandInteraction;

    const command: Command | undefined = client.commands.get(commandInteraction.commandName);

    if (!command) {
      console.error(`⚠️ Command /${commandInteraction.commandName} was not found.`);
      return;
    };
    
    if (command && interaction.isAutocomplete() && command.autocomplete ) {
      const autocompleteInteraction = interaction as AutocompleteInteraction;

      try {
        await command.autocomplete(autocompleteInteraction, client);
      } catch (error) {
        console.error(`❌ Autocomplete error /${autocompleteInteraction.commandName} :`, error);
      }
      
    }
    
    else if (interaction.isChatInputCommand()) {

      try {
        await command.execute(commandInteraction, client);
        const group = interaction.options.getSubcommandGroup(false)
        const sub = interaction.options.getSubcommand(false)
        const commandPath = [
          interaction.commandName,
          group,
          sub,
        ].filter(Boolean).join(' ');
        console.log(`ℹ️ /${commandPath} executed by ${interaction.user.globalName}`)
      } catch (error) {
        console.error(`❌ Erreur with the execution of the command /${commandInteraction.commandName} :`, error);
        
        if (commandInteraction.replied || commandInteraction.deferred) {
          await commandInteraction.followUp({ content: ' Erreur with the execution of the command  !', flags:   MessageFlags.Ephemeral });
        } else {
          await commandInteraction.reply({ content: ' Erreur with the execution of the command  !', flags:   MessageFlags.Ephemeral });
        }
      }
    };

    
  },
};

export default event;
