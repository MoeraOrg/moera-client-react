import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { navigationStackSet, goToLocation, initFromLocation } from "state/navigation/actions";
import { NavigationStackItem } from "state/navigation/state";
import { cartesLoad } from "state/cartes/actions";
import { getInstantCount } from "state/feeds/selectors";
import { getNodeRootLocation, getOwnerName } from "state/node/selectors";
import * as Browser from "ui/browser";
import { asyncReturn } from "util/async-calls";

export default function Navigation() {
    const nodeName = useSelector(getOwnerName);
    const rootLocation = useSelector(getNodeRootLocation);
    const location = useSelector((state: ClientState) => state.navigation.location);
    const title = useSelector((state: ClientState) => state.navigation.title);
    const backTitle = useSelector((state: ClientState) => state.navigation.backTitle);
    const canonicalUrl = useSelector((state: ClientState) => state.navigation.canonicalUrl);
    const noIndex = useSelector((state: ClientState) => state.navigation.noIndex);
    const create = useSelector((state: ClientState) => state.navigation.create);
    const locked = useSelector((state: ClientState) => state.navigation.locked);
    const count = useSelector(getInstantCount);
    const dispatch = useDispatch();

    const stack = useRef<NavigationStackItem[]>([]);

    const popState = useCallback((event: PopStateEvent) => {
        stack.current.pop();

        const {name, rootLocation: root, path = null, query = null, hash = null} = Browser.parseDocumentLocation();
        if (root === rootLocation) {
            dispatch(goToLocation(path, query, hash));
        } else {
            if (root != null) {
                dispatch(initFromLocation(name ?? null, root, path, query, hash));
            }
        }
        dispatch(navigationStackSet(stack.current));
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
        if (locked || !nodeName || rootLocation == null) {
            return;
        }

        const url = Browser.universalLocation(Browser.getRootLocation(), nodeName, rootLocation, location);
        if (
            (!create && stack.current.length === 0)
            || (create && stack.current[stack.current.length - 1]?.url === url)
        ) {
            return;
        }

        const data = {location: url};
        if (create) {
            stack.current.push({url, nodeName, location, backTitle});
            window.history.pushState(data, "", url);
        } else {
            if (stack.current.length > 0) {
                stack.current[stack.current.length - 1].url = url;
            }
            window.history.replaceState(data, "", url);
        }
        window.Android?.locationChanged(url, location);
        dispatch(navigationStackSet(stack.current));
    }, [dispatch, location, locked, nodeName, rootLocation, create, backTitle]);

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
