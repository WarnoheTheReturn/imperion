import {LogsEventData} from "../db/models/logs_event";
import { EventChannelsModel } from "../db/models/events_channel";
import { EventTypeData } from "../db/models/event_type";

export const activeEvents = new Map<string, LogsEventData>();
export const channelEvents = new Map<string, EventChannelsModel[] >();
type eventId = string;

export interface eventParticipantData {
    user_id: string;
    channel_id: string | null;
    xp_pourcentage: number | null;
    joined_at: Date | null;
    total_minute: number ;
    current_xp: number;
    
}


export const eventParticipants = new Map<eventId, eventParticipantData[] >();
export const eventTypes = new Map<number, EventTypeData >();