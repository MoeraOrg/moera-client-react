/* eslint-disable no-restricted-globals */

import EventsBackend from "events/EventsBackend";
import { EventsBackendInstance, EventsWorkerMessage } from "events/message-types";

const backends = {
    home: new EventsBackend(true),
    node: new EventsBackend(),
    receiver: new EventsBackend()
};

function getBackend(instance: EventsBackendInstance): EventsBackend | undefined {
    let backend: EventsBackend | undefined = undefined;
    switch (instance) {
        case "home":
            backend = backends.home;
            break;
        case "node":
            backend = backends.node;
            break;
        case "receiver":
            backend = backends.receiver;
            break;
    }
    return backend;
}

self.onmessage = (e: MessageEvent) => {
    const message = e.data as EventsWorkerMessage;
    switch (message.type) {
        case "SET_CLIENT_ID": {
            const clientId = message.payload.clientId;
            backends.home.setClientId(clientId);
            backends.node.setClientId(clientId);
            backends.receiver.setClientId(clientId);
            break;
        }

        case "SETUP_CONNECTION": {
            let backend = getBackend(message.payload.backend);
            if (backend != null) {
                const {location, token, carte, prefix, sourceNode} = message.payload;
                backend.setup(location, token, carte, prefix, sourceNode);
            }
            break;
        }

        case "WAKE_UP":
            backends.home.wakeUp();
            break;
    }
}
