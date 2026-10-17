import { Client, IMessage, StompHeaders } from '@stomp/stompjs';
import * as URI from 'uri-js';
import { addMinutes, isBefore } from 'date-fns';

import { formatSchemaErrors } from "api/error";
import { eventAction, EventSource } from "api/events";
import { EVENT_VALIDATORS } from "api/events/api-validators";
import { ALLOWED_SELF_EVENTS } from "api/events/self-events";
import { ActionWithoutPayload } from "state/action-types";
import { wakeUp } from "state/navigation/actions";
import { now } from "util/misc";

export default class EventsBackend {

    private clientId: string = "";
    private stomp: Client | null = null;
    private location: string | null = null;
    private token: string | null = null;
    private carte: string | null = null;
    private prefix: EventSource[] = [];
    private sourceNode: string | null = null;
    private queueStartedAt: number | null = null;
    private lastEvent: number | null = null;
    private lastEventSentAt: number | null = null;
    private lastWakeUp: Date = new Date();
    private pingReceived: boolean = true;
    private readonly pingTimer: ReturnType<typeof setInterval>;
    private restarting: Promise<void> = Promise.resolve();
    private connectionGeneration: number = 0;

    public constructor() {
        this.pingTimer = setInterval(this.onPingCheck, 65000);
    }

    public setClientId(clientId: string) {
        this.clientId = clientId;
    }

    private dispatch(action: ActionWithoutPayload<any>) {
        delete (action as any).causedBy;
        postMessage(action);
    }

    private onMessage = (message: IMessage) => {
        const packet = JSON.parse(message.body);
        const packetSchema = EVENT_VALIDATORS["EVENT_PACKET"];
        if (packetSchema == null) {
            console.error("Undefined schema for EventPacket");
            return;
        }
        if (!packetSchema(packet)) {
            console.error("Incorrect event packet received", formatSchemaErrors(packetSchema.errors));
            return;
        }
        const eventSchema = EVENT_VALIDATORS[packet.event.type];
        if (eventSchema == null) {
            console.error("Unknown event type: " + packet.event.type);
            return;
        }
        if (!eventSchema(packet.event)) {
            console.error("Incorrect event received", formatSchemaErrors(eventSchema.errors), message.body);
            return;
        }
        if (packet.event.type === "PING") {
            this.pingReceived = true;
        } else if (ALLOWED_SELF_EVENTS.has(packet.event.type) || packet.cid !== this.clientId) {
            const event = {
                ...packet.event,
                sourceNode: this.sourceNode
            }
            this.prefix.forEach(prefix => this.dispatch(eventAction(event, prefix)));
        }
        this.queueStartedAt = packet.queueStartedAt;
        this.lastEvent = packet.ordinal;
        this.lastEventSentAt = packet.sentAt ?? null;
    };

    private onConnect(stomp: Client) {
        if (this.stomp !== stomp) {
            return;
        }

        this.wakeUp();

        const headers: StompHeaders = {};
        if (this.queueStartedAt != null) {
            headers.seen = `${this.queueStartedAt},${this.lastEvent}`;
        }
        stomp.subscribe("/user/queue", message => {
            if (this.stomp === stomp) {
                this.onMessage(message);
            }
        }, headers);
    }

    private connect() {
        const {location, token, carte} = this;
        if (location == null) {
            return;
        }
        const {host} = URI.parse(location);
        if (host == null) {
            return;
        }
        this.pingReceived = true;

        const connectHeaders: StompHeaders = {
            host
        };
        if (token != null) {
            connectHeaders["token"] = token;
        } else if (carte != null) {
            connectHeaders["token"] = "carte:" + carte;
        }
        const stomp = new Client({
            brokerURL: location,
            onConnect: () => this.onConnect(stomp),
            connectHeaders
        });
        this.stomp = stomp;
        stomp.activate();
    }

    private restart(): Promise<void> {
        const generation = ++this.connectionGeneration;
        const stomp = this.stomp;
        this.stomp = null;
        this.restarting = this.restarting.then(async () => {
            if (stomp != null) {
                // A lost DISCONNECT receipt must not prevent closing the old socket.
                const timeout = setTimeout(() => stomp.forceDisconnect(), 5000);
                try {
                    await stomp.deactivate();
                } finally {
                    clearTimeout(timeout);
                }
            }
            if (generation === this.connectionGeneration) {
                this.connect();
            }
        });
        return this.restarting;
    }

    public setup(
        location: string | null,
        token: string | null,
        carte: string | null,
        prefix: EventSource[] | EventSource,
        sourceNode: string | null
    ): Promise<void> {
        const connectionChanged = this.location !== location
            || (location != null && this.stomp == null)
            || this.token !== token
            || (this.token == null && (this.carte == null) !== (carte == null));
        if (location !== this.location && (sourceNode == null || sourceNode !== this.sourceNode)) {
            this.queueStartedAt = null;
            this.lastEvent = null;
            this.lastEventSentAt = null;
        }
        this.location = location;
        this.token = token;
        this.carte = carte;
        this.prefix = Array.isArray(prefix) ? prefix : [prefix];
        this.sourceNode = sourceNode;
        if (connectionChanged) {
            return this.restart();
        }
        return this.restarting;
    }

    public dispose(): Promise<void> {
        clearInterval(this.pingTimer);
        return this.setup(null, null, null, [], null);
    }

    public wakeUp() {
        if (!navigator.onLine || this.lastEventSentAt == null || !this.prefix.includes("HOME")) {
            return;
        }

        const sleepTime = now() - this.lastEventSentAt; // we really were sleeping
        if (sleepTime > 10 * 60) { // 10 minutes
            if (isBefore(addMinutes(this.lastWakeUp, 10), new Date())) { // do not wake up too often
                this.lastWakeUp = new Date();
                this.dispatch(wakeUp());
            }
        }
    }

    private onPingCheck = () => {
        if (this.stomp == null) {
            return;
        }
        if (this.pingReceived) {
            this.pingReceived = false;
        } else {
            void this.restart();
        }
    }

}
