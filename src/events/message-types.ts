import { EventSource } from "api/events";

export type EventsBackendInstance = "home" | "node" | "receiver";

export interface EventsSetClientIdMessage {
    type: "SET_CLIENT_ID";
    payload: {
        clientId: string;
    }
}

export const eventsSetClientIdMessage = (clientId: string): EventsSetClientIdMessage => ({
    type: "SET_CLIENT_ID", payload: {clientId}
});

export interface EventsSetupConnectionMessage {
    type: "SETUP_CONNECTION";
    payload: {
        backend: EventsBackendInstance;
        location: string | null;
        token: string | null;
        carte: string | null;
        prefix: EventSource[] | EventSource;
        sourceNode: string | null;
    }
}

export const eventsSetupConnectionMessage = (
    backend: EventsBackendInstance, location: string | null, token: string | null, carte: string | null,
    prefix: EventSource[] | EventSource, sourceNode: string | null
): EventsSetupConnectionMessage => ({
    type: "SETUP_CONNECTION", payload: {backend, location, token, carte, prefix, sourceNode}
});

export interface EventsWakeUpMessage {
    type: "WAKE_UP";
}

export const eventsWakeUpMessage = (): EventsWakeUpMessage => ({
    type: "WAKE_UP"
});

export type EventsWorkerMessage =
    EventsSetClientIdMessage
    | EventsSetupConnectionMessage
    | EventsWakeUpMessage;
