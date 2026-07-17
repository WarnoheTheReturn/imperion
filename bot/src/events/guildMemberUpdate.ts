import { Event, Bot } from "../types";
import {EventState} from "../types/index";
import {activeEvents, channelEvents, eventTypes,eventParticipants} from "../store/event"
import {Events, GuildMember} from "discord.js"

const event: Event = {
  name: Events.GuildMemberUpdate,
  once: false,
  async execute(oldMember: GuildMember, newMember: GuildMember, bot : Bot) {

    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id))
    const role = addedRoles.first()


    if (addedRoles.size === 0) {
        return;
    }

    const allGrade = await bot.db.tables.grades.getAll()
    const gradeData = allGrade.filter(grade =>  addedRoles.has(grade.data.role_id))
    if (gradeData.length === 0) {
        return;
    }
    const memberData = await bot.db.tables.users.getById(newMember.id)
    let description = ""
    if (!memberData) {
        description = `Member <@${newMember.id}> does not exist in database but has receve a grade role : <@&${gradeData[0]!.data.role_id}>`
    } else {
        description = `Member <@${newMember.id}> has not the same grade as before :\n - In Database : <@&${memberData.data.current_grade}>\n - With discord role <@&${gradeData[0]!.data.role_id}>`
    }
    await bot.log.logGradeChange(description);


  },
};

export default event;
