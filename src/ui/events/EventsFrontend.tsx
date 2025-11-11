import { useCallback, useEffect, useRef } from 'react';
import { Action } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import { EventSource } from "api/events";
import { eventsSetClientIdMessage, eventsSetupConnectionMessage, eventsWakeUpMessage } from "events/message-types";
import { ClientState } from "state/state";
import { getHomeOwnerName, getHomeToken } from "state/home/selectors";
import { getNodeToken, getOwnerName, getToken } from "state/node/selectors";
import { getCurrentAllCarte } from "state/cartes/selectors";
import { getReceiverNodeName, getReceiverNodeUri } from "state/receiver/selectors";
import * as Browser from "ui/browser";
import { nodeUrlToEvents, nodeUrlToLocation } from "util/url";

const NODE_OR_RECEIVER: EventSource[] = ["NODE" as const, "RECEIVER" as const];

export default function EventsFrontend() {
    const eventWorker = useRef<Worker>();
    const dispatch = useDispatch();

    const onMessage = useCallback((event: MessageEvent) => dispatch(event.data as Action), [dispatch]);

    useEffect(() => {
        if (eventWorker.current == null) {
            eventWorker.current = new Worker(new URL('../../events/index.ts', import.meta.url));
            eventWorker.current.addEventListener("message", onMessage);
        }
        return () => {
            eventWorker.current?.removeEventListener("message", onMessage);
            eventWorker.current?.terminate();
            eventWorker.current = undefined;
        };
    }, [onMessage]);

    const homeEvents = useSelector((state: ClientState) => state.home.root.events);
    const nodeEvents = useSelector((state: ClientState) => state.node.root.events);
    const receiverNodeUri = useSelector(getReceiverNodeUri);
    const receiverEvents = nodeUrlToEvents(receiverNodeUri);
    const homeToken = useSelector(getHomeToken);
    const nodeToken = useSelector(getNodeToken);
    const receiverToken = useSelector((state: ClientState) => getToken(state, nodeUrlToLocation(receiverNodeUri)));
    const carte = useSelector(getCurrentAllCarte);
    const homeNode = useSelector(getHomeOwnerName);
    const nodeNode = useSelector(getOwnerName);
    const receiverNode = useSelector(getReceiverNodeName);
    const nodePrefix = receiverNode == null ? NODE_OR_RECEIVER : "NODE" as const;

    useEffect(() => {
        eventWorker.current?.postMessage(eventsSetClientIdMessage(Browser.clientId));
    }, []);

    useEffect(() => {
        eventWorker.current?.postMessage(
            eventsSetupConnectionMessage("home", homeEvents, homeToken, null, "HOME", homeNode)
        );
    }, [homeEvents, homeToken, homeNode]);

    useEffect(() => {
        eventWorker.current?.postMessage(
            eventsSetupConnectionMessage("node", nodeEvents, nodeToken, carte, nodePrefix, nodeNode)
        );
    }, [carte, nodeEvents, nodeNode, nodePrefix, nodeToken]);

    useEffect(() => {
        eventWorker.current?.postMessage(
            eventsSetupConnectionMessage("receiver", receiverEvents, receiverToken, carte, "RECEIVER", receiverNode)
        );
    }, [carte, receiverEvents, receiverNode, receiverToken]);

    const onVisibilityChange = useCallback(() => {
        if (document.visibilityState === "visible") {
            eventWorker.current?.postMessage(eventsWakeUpMessage());
        }
    }, []);

    useEffect(() => {
        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => document.removeEventListener("visibilitychange", onVisibilityChange);
    }, [onVisibilityChange]);

    return null;
}
