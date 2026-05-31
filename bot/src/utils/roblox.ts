import { Bot } from "../types/index";
export const isInGroup = async (robloxUserId: number,bot : Bot): Promise<boolean> => {
  const filter = encodeURIComponent(`user=='users/${robloxUserId}'`);
  const res = await fetch(
    `https://apis.roblox.com/cloud/v2/groups/${bot.config.api.robloxGroupeID}/memberships?maxPageSize=1&filter=${filter}`,
    {
      headers: { "x-api-key": bot.config.api.robloxGroup },
    }
  );

  if (!res.ok) throw new Error(`isInGroup error : : ${res.status}`);

  const data = await res.json();
  return (data.groupMemberships?.length ?? 0) > 0;
};

export const findJoinRequest = async (robloxUserId: number, bot : Bot): Promise<string | null> => {
  let pageToken: string | undefined;

  do {
    const url = new URL(`https://apis.roblox.com/cloud/v2/groups/${bot.config.api.robloxGroupeID}/join-requests`);
    url.searchParams.set("maxPageSize", "100");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString(), {
      headers: { "x-api-key": bot.config.api.robloxGroup },
    });

    if (!res.ok) throw new Error(`findJoinRequest error : ${res.status}`);

    const data = await res.json();

    const found = data.groupJoinRequests?.find(
      (r: any) => r.user === `users/${robloxUserId}`
    );

    if (found) return found.path;
    
    pageToken = data.nextPageToken;
  } while (pageToken);

  return null;
};
export const acceptJoinRequest = async (joinRequestPath: string, bot : Bot): Promise<void> => {
  const res = await fetch(
    `https://apis.roblox.com/cloud/v2/${joinRequestPath}:accept`,
    {
      method: "POST",
      headers: {
        "x-api-key": bot.config.api.robloxGroup,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  if (!res.ok) throw new Error(`acceptJoinRequest error : ${res.status}`);
};

export const robloxProfilPictureURL = async (robloxUserId: number): Promise<string | null> => {
  const thumbRes = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxUserId}&size=150x150&format=Png`
        );
  const thumbData = await thumbRes.json();
  const avatarUrl = thumbData.data?.[0]?.imageUrl ?? null;

  return avatarUrl;
}