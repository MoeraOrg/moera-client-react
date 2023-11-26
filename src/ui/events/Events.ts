import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Client, IMessage, StompHeaders } from '@stomp/stompjs';
import * as URI from 'uri-js';
import { addMinutes, isBefore } from 'date-fns';

import { formatSchemaErrors } from "api";
import { ALLOWED_SELF_EVENTS, EVENT_SCHEMAS, eventAction, EventPacket, EventSource } from "api/events";
import { getHomeRootLocation } from "state/home/selectors";
import { Browser } from "ui/browser";
import { now } from "util/misc";

interface Props {
    location: string | null;
    token: string | null;
    carte: string | null;
    prefix: EventSource[] | EventSource;
    sourceNode: string | null;
    onWakeUp?: () => void;
}

export default function Events({location, token, carte, prefix, sourceNode, onWakeUp}: Props) {
    const homeRoot = useSelector(getHomeRootLocation);
    const dispatch = useDispatch();

    const stomp = useRef<Client | null>(null);
    const currentLocation = useRef<string | null>(null);
    const currentCarte = useRef<string | null>(null);
    const queueStartedAt = useRef<number | null>(null);
    const lastEvent = useRef<number | null>(null);
    const lastEventSentAt = useRef<number | null>(null);
    const lastWakeUp = useRef<Date>(new Date());
    const pingReceived = useRef<boolean>(true);

    const onMessage = useCallback((message: IMessage) => {
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
            pingReceived.current = true;
        } else if (ALLOWED_SELF_EVENTS.has(packet.event.type) || packet.cid !== Browser.clientId) {
            const event = {
                ...packet.event,
                sourceNode
            }
            if (Array.isArray(prefix)) {
                prefix.forEach(px => dispatch(eventAction(event, px)));
            } else {
                dispatch(eventAction(event, prefix));
            }
        }
        queueStartedAt.current = packet.queueStartedAt;
        lastEvent.current = packet.ordinal;
        lastEventSentAt.current = packet.sentAt ?? null;
    }, [dispatch, prefix, sourceNode]);

    const wakeUp = useCallback(() => {
        if (!navigator.onLine || lastEventSentAt.current == null || onWakeUp == null) {
            return;
        }

        const sleepTime = now() - lastEventSentAt.current; // we really were sleeping
        if (sleepTime > 10 * 60) { // 10 minutes
            if (isBefore(addMinutes(lastWakeUp.current, 10), new Date())) { // do not wake up too often
                lastWakeUp.current = new Date();
                onWakeUp();
            }
        }
    }, [onWakeUp]);

    const onConnect = useCallback(() => {
        if (stomp.current == null) {
            return;
        }

        wakeUp();

        const headers: StompHeaders = {};
        if (queueStartedAt.current != null) {
            headers.seen = `${queueStartedAt.current},${lastEvent.current}`;
        }
        stomp.current.subscribe("/user/queue", onMessage, headers);
    }, [wakeUp, onMessage]);

    const connect = useCallback(() => {
        if (location == null) {
            return;
        }
        const {host} = URI.parse(location);
        if (host == null) {
            return;
        }
        if (location !== currentLocation.current) {
            currentLocation.current = location;
            queueStartedAt.current = null;
            lastEvent.current = null;
            lastEventSentAt.current = null;
        }
        currentCarte.current = carte;
        pingReceived.current = true;

        const connectHeaders: StompHeaders = {
            host
        };
        if (token != null) {
            connectHeaders["token"] = token;
        } else if (carte != null) {
            connectHeaders["token"] = "carte:" + carte;
        }
        stomp.current = new Client({
            brokerURL: location,
            onConnect: onConnect,
            connectHeaders
        });
        stomp.current.activate();
    }, [carte, location, onConnect, token]);

    const disconnect = useCallback(() => {
        if (stomp.current != null) {
            stomp.current.deactivate();
            stomp.current = null;
        }
    }, []);

    useEffect(() => {
        console.log(`Changed data for ${prefix} (${sourceNode})`);
        disconnect();
        connect();
    }, [location, homeRoot, token, disconnect, connect]);

    useEffect(() => {
        if (currentCarte.current == null && carte != null) {
            console.log(`Set carte for ${prefix} (${sourceNode})`);
            disconnect();
            connect();
        }
    });

    const onVisibilityChange = useCallback(() => {
        if (document.visibilityState === "visible") {
            wakeUp();
        }
    }, [wakeUp]);

    useEffect(() => {
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => document.removeEventListener("visibilitychange", onVisibilityChange);
    }, [onVisibilityChange]);

    const onPingCheck = useCallback(() => {
        if (stomp.current == null) {
            return;
        }
        if (pingReceived.current) {
            pingReceived.current = false;
        } else {
            console.log(`Not received PING from ${prefix} (${sourceNode})`);
            disconnect();
            connect();
        }
    }, [connect, disconnect]);

    useEffect(() => {
        const intervalId = setInterval(onPingCheck, 65000);
        return () => clearInterval(intervalId);
    }, [onPingCheck]);

    return null;
}
