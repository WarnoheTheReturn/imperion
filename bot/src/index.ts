import { client } from "./client";
import { loadCommands } from "./handlers/commandHandler";
import { loadEvents } from "./handlers/eventHandler";
import { config } from './config';
import { createServer } from "./api/server";
import { setTimeout as sleep } from "node:timers/promises";




async function bootstrap() {
  const maxAttempts = 5;
  const delay = 10_000
  console.log("Démarrage...");

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
        await loadCommands(client);
        await loadEvents(client);
        break;
    }
    catch (error) {
        console.error(`❌ Erreur lors de la chargement des commandes ou des événements. Réessaye (${attempt}/${maxAttempts})...`);
        if (attempt === maxAttempts) process.exit(1);
        await sleep(delay);
    }

  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
        await client.login(config.discord.token);
        break;
    } catch (error) {
      console.error(
        `❌ Connexion impossible (tentative ${attempt}/${maxAttempts}). ` +
        `Nouvel essai dans ${delay / 1_000}s.`,
        error
      );
      if (attempt === maxAttempts) process.exit(1);
      await sleep(delay);
        
    }
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
        const app = createServer(client);
        app.listen(config.api.port, () => {
            console.log(`✅ Serveur web en ligne sur le port ${config.api.port}`);
        });
        break;
    }
    catch (error) {
        console.error(`❌ Erreur lors de l'initialisation du serveur web. Réessaye (${attempt}/${maxAttempts}`);
        if (attempt === maxAttempts) process.exit(1);
        await sleep(delay);
    }

  }
}

bootstrap();