import { ButtonInteraction, ModalSubmitInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";

export interface VerifyAnswers {
  recruitedBy?:    string;
  // timezone?:       string;
  howFound?:       string;
  robloxVerified?: boolean;
  robloxId?:       number;
  groupVerified?:  boolean;
}


export const verifySessions = new Map<string, VerifyAnswers>();


export const checkVerifyComplete = async (
  userId: string,
//   interaction: ButtonInteraction | ModalSubmitInteraction | StringSelectMenuInteraction | UserSelectMenuInteraction
): Promise<boolean> => {
  const session = verifySessions.get(userId);
  if (!session) return false;

  const allDone =
    session.recruitedBy &&
    // session.timezone &&
    session.howFound &&
    session.robloxVerified &&
    session.groupVerified;

  if (!allDone) return false;

  return true;
};

export const waitForVerify = async (
  userId: string,
  timeout: number
): Promise<VerifyAnswers> => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(
      async () => {
        const session = verifySessions.get(userId);
        if (!session) {
            clearInterval(interval);
            reject(new Error("Session expired"));
            return;
        }
        if (await checkVerifyComplete(userId)) {
            verifySessions.delete(userId);
            clearInterval(interval);
            resolve(session);
            return;
        }
       }, 1000);


    setTimeout(() => {
      clearInterval(interval);
      reject(new Error("Timeout"));
    }, timeout);
  });
};