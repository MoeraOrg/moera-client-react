import { EventSource } from "api/events";

export interface EventsSetClientIdMessage {
    type: "SET_CLIENT_ID";
    payload: {
        clientId: string;
    }
}

export const eventsSetClientIdMessage = (clientId: string): EventsSetClientIdMessage => ({
    type: "SET_CLIENT_ID", payload: {clientId}
});

export interface EventsConnection {
    location: string | null;
    token: string | null;
    carte: string | null;
    prefix: EventSource[] | EventSource;
    sourceNode: string | null;
}

export interface EventsSetupConnectionsMessage {
    type: "SETUP_CONNECTIONS";
    payload: {
        connections: EventsConnection[];
    }
}

export const eventsSetupConnectionsMessage = (connections: EventsConnection[]): EventsSetupConnectionsMessage => ({
    type: "SETUP_CONNECTIONS", payload: {connections}
});

export interface EventsWakeUpMessage {
    type: "WAKE_UP";
}

export const eventsWakeUpMessage = (): EventsWakeUpMessage => ({
    type: "WAKE_UP"
});

export type EventsWorkerMessage =
    EventsSetClientIdMessage
    | EventsSetupConnectionsMessage
    | EventsWakeUpMessage;
