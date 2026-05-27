import { client } from "./client";
import { loadCommands } from "./handlers/commandHandler";
import { loadEvents } from "./handlers/eventHandler";
import { config } from './config';
import { createServer } from "./api/server";




async function bootstrap() {
  try {
      console.log("Démarrage...");

      await loadCommands(client);
      await loadEvents(client);
      
      const app = createServer(client);

      await client.login(config.discord.token);
      
      app.listen(config.api.port, () => {
          console.log(`✅ Serveur web en ligne sur le port ${config.api.port}`);
      });

  } catch (error) {
      console.error("❌ Erreur critique lors du démarrage :", error);
      process.exit(1); 
  }
}

bootstrap();