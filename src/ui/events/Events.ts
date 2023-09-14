import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Client, IMessage, StompHeaders } from '@stomp/stompjs';
import * as URI from 'uri-js';
import { addMinutes, isBefore } from 'date-fns';

import { formatSchemaErrors } from "api";
import { ALLOWED_SELF_EVENTS, EVENT_SCHEMAS, eventAction, EventPacket, EventSource } from "api/events";
import { ClientState } from "state/state";
import { getHomeRootLocation } from "state/home/selectors";
import { Browser } from "ui/browser";
import { now } from "util/misc";

type Props = {
    location: string | null;
    token: string | null;
    carte: string | null;
    prefix: EventSource[] | EventSource;
    sourceNode: string | null;
    onWakeUp?: () => void;
} & ConnectedProps<typeof connector>;

class Events extends React.PureComponent<Props> {

    #stomp: Client | null = null;
    #location: string | null = null;
    #queueStartedAt: number | null = null;
    #lastEvent: number | null = null;
    #lastEventSentAt: number | null = null;
    #lastWakeUp: Date = new Date();

    componentDidMount() {
        this._connect();
        document.addEventListener("visibilitychange", this.onVisibilityChange);
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.location !== this.props.location
            || prevProps.homeRoot !== this.props.homeRoot
            || prevProps.token !== this.props.token
            || (prevProps.carte == null && this.props.carte != null)
        ) {
            this._disconnect();
            this._connect();
        }
    }

    componentWillUnmount() {
        document.removeEventListener("visibilitychange", this.onVisibilityChange);
    }

    _connect() {
        const {location, token, carte} = this.props;

        if (location == null) {
            return;
        }
        const {host} = URI.parse(location);
        if (host == null) {
            return;
        }
        if (location !== this.#location) {
            this.#location = location;
            this.#queueStartedAt = null;
            this.#lastEvent = null;
            this.#lastEventSentAt = null;
        }

        const connectHeaders: StompHeaders = {
            host
        };
        if (token != null) {
            connectHeaders["token"] = token;
        } else if (carte != null) {
            connectHeaders["token"] = "carte:" + carte;
        }
        this.#stomp = new Client({
            brokerURL: location,
            onConnect: this.onConnect,
            connectHeaders
        });
        this.#stomp.activate();
    }

    _disconnect() {
        if (this.#stomp != null) {
            this.#stomp.deactivate();
            this.#stomp = null;
        }
    }

    _wakeUp() {
        const {onWakeUp} = this.props;

        if (!navigator.onLine || this.#lastEventSentAt == null || onWakeUp == null) {
            return;
        }

        const sleepTime = now() - this.#lastEventSentAt; // we really were sleeping
        if (sleepTime > 10 * 60) { // 10 minutes
            if (isBefore(addMinutes(this.#lastWakeUp, 10), new Date())) { // do not wake up too often
                this.#lastWakeUp = new Date();
                onWakeUp();
            }
        }
    }

    onConnect = () => {
        if (this.#stomp == null) {
            return;
        }

        this._wakeUp();

        const headers: StompHeaders = {};
        if (this.#queueStartedAt != null) {
            headers.seen = `${this.#queueStartedAt},${this.#lastEvent}`;
        }
        this.#stomp.subscribe("/user/queue", this.onMessage, headers);
    };

    onMessage = (message: IMessage) => {
        const {prefix, eventAction, sourceNode} = this.props;

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
        if (ALLOWED_SELF_EVENTS.has(packet.event.type) || packet.cid !== Browser.clientId) {
            const event = {
                ...packet.event,
                sourceNode
            }
            if (Array.isArray(prefix)) {
                prefix.forEach(px => eventAction(event, px));
            } else {
                eventAction(event, prefix);
            }
            this.#queueStartedAt = packet.queueStartedAt;
            this.#lastEvent = packet.ordinal;
            this.#lastEventSentAt = packet.sentAt ?? null;
        }
    };

    onVisibilityChange = () => {
        if (document.visibilityState === "visible") {
            this._wakeUp();
        }
    }

    render() {
        return null;
    }

}

const connector = connect(
    (state: ClientState) => ({
        homeRoot: getHomeRootLocation(state)
    }),
    { eventAction }
);

export default connector(Events);
