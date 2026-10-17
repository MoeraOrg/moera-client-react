/* eslint-disable no-restricted-globals */

import EventsConnections from "events/EventsConnections";
import { EventsWorkerMessage } from "events/message-types";

const connections = new EventsConnections();

self.onmessage = (e: MessageEvent) => {
    const message = e.data as EventsWorkerMessage;
    switch (message.type) {
        case "SET_CLIENT_ID":
            connections.setClientId(message.payload.clientId);
            break;

        case "SETUP_CONNECTIONS":
            return connections.setup(message.payload.connections);

        case "WAKE_UP":
            connections.wakeUp();
            break;
    }
}
