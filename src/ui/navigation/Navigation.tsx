import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { restoreFar, restoreNear } from "state/navigation/actions";
import { cartesLoad } from "state/cartes/actions";
import { getInstantCount } from "state/feeds/selectors";
import { getNodeRootLocation } from "state/node/selectors";
import * as Browser from "ui/browser";
import { asyncReturn } from "util/async-calls";

export default function Navigation() {
    const rootLocation = useSelector(getNodeRootLocation);
    const title = useSelector((state: ClientState) => state.navigation.title);
    const canonicalUrl = useSelector((state: ClientState) => state.navigation.canonicalUrl);
    const noIndex = useSelector((state: ClientState) => state.navigation.noIndex);
    const count = useSelector(getInstantCount);
    const dispatch = useDispatch();

    const stack = useRef<string[]>([]);

    const popState = useCallback((event: PopStateEvent) => {
        stack.current.pop();

        const {name, rootLocation: root, path = null, query = null, hash = null} = Browser.parseDocumentLocation();
        if (root === rootLocation) {
            dispatch(restoreNear(path, query, hash));
        } else {
            dispatch(restoreFar(name ?? null, root ?? null, path, query, hash));
        }
        event.preventDefault();
    }, [dispatch, rootLocation]);

    const messageReceived = useCallback((event: MessageEvent) => {
        const data = event.data;
        if (data === null || typeof data !== "string") {
            return;
        }
        const message = JSON.parse(data) as AndroidMessage;

        // Only accept messages that we know are ours
        if (message.source !== "moera-android") {
            return;
        }

        switch (message.action) {
            case "back":
                window.overlays.mobileBack();
                return;

            case "call-return":
                asyncReturn(message.callId, message.value);
                return;

            case "network-changed":
                dispatch(cartesLoad());
                return;

            default:
                return;
        }
    }, [dispatch]);

    useEffect(() => {
        window.addEventListener("popstate", popState);
        if (Browser.isAndroidApp()) {
            window.addEventListener("message", messageReceived);
        }

        return () => {
            window.removeEventListener("popstate", popState);
            if (Browser.isAndroidApp()) {
                window.removeEventListener("message", messageReceived);
            }
        }
    }, [messageReceived, popState]);

    useEffect(() => {
        const counter = count > 0 ? `(${count}) ` : "";
        if (title) {
            document.title = counter + title + " | Moera";
        } else {
            document.title = counter + "Moera";
        }
    }, [count, title]);

    useEffect(() => {
        if (canonicalUrl != null) {
            const linkTag = document.createElement("link");
            linkTag.setAttribute("rel", "canonical");
            linkTag.href = canonicalUrl;
            document.head.appendChild(linkTag);
            return () => document.querySelector("link[rel=canonical]")?.remove();
        }
    }, [canonicalUrl]);

    useEffect(() => {
        let value = "notranslate";
        if (noIndex) {
            value = "noindex,follow," + value;
        }
        const robots = document.querySelector("meta[name=robots]")!;
        robots.setAttribute("content", value);
    }, [noIndex]);

    return null;
}
