
import { Guild } from "discord.js";

export const fetchMember = async (guild: Guild, userId: string, retries = 3) => {
  const cached = guild.members.cache.get(userId);
  if (cached) return cached;

  for (let i = 0; i < retries; i++) {
    try {
      return await guild.members.fetch(userId);
    } catch (err: any) {
      if (err?.data?.retry_after) {
        const wait = err.data.retry_after * 1000;
        console.log(`⏳ Rate limited, retrying in ${wait}ms...`);
        await new Promise((r) => setTimeout(r, wait));
      } else {
        throw err;
      }
    }
  }

  throw new Error(`❌ Could not fetch member ${userId} after ${retries} retries`);
};

