import { Client, IMessage, StompHeaders } from '@stomp/stompjs';
import * as URI from 'uri-js';
import { addMinutes, isBefore } from 'date-fns';

import { formatSchemaErrors } from "api/error";
import { ALLOWED_SELF_EVENTS, EVENT_SCHEMAS, eventAction, EventPacket, EventSource } from "api/events";
import { ActionWithoutPayload } from "state/action-types";
import { wakeUp } from "state/navigation/actions";
import { now } from "util/misc";

export default class EventsBackend {

    private clientId: string = '';
    private stomp: Client | null = null;
    private location: string | null = null;
    private token: string | null = null;
    private carte: string | null = null;
    private prefix: EventSource[] | EventSource = "HOME";
    private sourceNode: string | null = null;
    private queueStartedAt: number | null = null;
    private lastEvent: number | null = null;
    private lastEventSentAt: number | null = null;
    private lastWakeUp: Date = new Date();
    private pingReceived: boolean = true;
    private readonly wakingUp: boolean = false;

    public constructor(wakingUp: boolean = false) {
        this.wakingUp = wakingUp;
        setInterval(this.onPingCheck, 65000);
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
        if (!EventPacket(packet)) {
            console.error("Incorrect event packet received", formatSchemaErrors(EventPacket.errors));
            return;
        }
        const eventSchema = EVENT_SCHEMAS[packet.event.type];
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
            if (Array.isArray(this.prefix)) {
                this.prefix.forEach(px => this.dispatch(eventAction(event, px)));
            } else {
                this.dispatch(eventAction(event, this.prefix));
            }
        }
        this.queueStartedAt = packet.queueStartedAt;
        this.lastEvent = packet.ordinal;
        this.lastEventSentAt = packet.sentAt ?? null;
    };

    private onConnect = () => {
        if (this.stomp == null) {
            return;
        }

        this.wakeUp();

        const headers: StompHeaders = {};
        if (this.queueStartedAt != null) {
            headers.seen = `${this.queueStartedAt},${this.lastEvent}`;
        }
        this.stomp.subscribe("/user/queue", this.onMessage, headers);
    };

    private connect(
        location: string | null, token: string | null, carte: string | null, prefix: EventSource[] | EventSource,
        sourceNode: string | null
    ) {
        if (location == null) {
            return;
        }
        const {host} = URI.parse(location);
        if (host == null) {
            return;
        }
        if (location !== this.location) {
            this.location = location;
            this.queueStartedAt = null;
            this.lastEvent = null;
            this.lastEventSentAt = null;
        }
        this.token = token;
        this.carte = carte;
        this.prefix = prefix;
        this.sourceNode = sourceNode;
        this.pingReceived = true;

        const connectHeaders: StompHeaders = {
            host
        };
        if (token != null) {
            connectHeaders["token"] = token;
        } else if (carte != null) {
            connectHeaders["token"] = "carte:" + carte;
        }
        this.stomp = new Client({
            brokerURL: location,
            onConnect: this.onConnect,
            connectHeaders
        });
        this.stomp.activate();
    }

    private disconnect() {
        if (this.stomp != null) {
            this.stomp.deactivate();
            this.stomp = null;
        }
    }

    private reconnect() {
        this.connect(this.location, this.token, this.carte, this.prefix, this.sourceNode);
    }

    public setup(
        location: string | null, token: string | null, carte: string | null, prefix: EventSource[] | EventSource,
        sourceNode: string | null
    ) {
        const connectionChanged = this.location !== location
            || this.token !== token
            || (this.token == null && this.carte == null && carte != null);
        if (connectionChanged) {
            this.disconnect();
            this.connect(location, token, carte, prefix, sourceNode);
        } else {
            this.prefix = prefix;
            this.sourceNode = sourceNode;
        }
    }

    public wakeUp() {
        if (!navigator.onLine || this.lastEventSentAt == null || this.wakingUp == null) {
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
            this.disconnect();
            this.reconnect();
        }
    }

}
