import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { dialogClosed, goToLocation, initFromLocation } from "state/navigation/actions";
import { cartesLoad } from "state/cartes/actions";
import { getInstantCount } from "state/feeds/selectors";
import { getNodeRootLocation, getOwnerName } from "state/node/selectors";
import { closeMessageBox } from "state/messagebox/actions";
import { closeConfirmBox } from "state/confirmbox/actions";
import * as Browser from "ui/browser";
import { asyncReturn } from "util/async-calls";

export default function Navigation() {
    const nodeName = useSelector(getOwnerName);
    const rootLocation = useSelector(getNodeRootLocation);
    const location = useSelector((state: ClientState) => state.navigation.location);
    const title = useSelector((state: ClientState) => state.navigation.title);
    const update = useSelector((state: ClientState) => state.navigation.update);
    const locked = useSelector((state: ClientState) => state.navigation.locked);
    const count = useSelector(getInstantCount);
    const closeDialogAction = useSelector((state: ClientState) => state.navigation.closeDialogAction);
    const messageBoxShow = useSelector((state: ClientState) => state.messageBox.show);
    const messageBoxOnClose = useSelector((state: ClientState) => state.messageBox.onClose);
    const confirmBoxShow = useSelector((state: ClientState) => state.confirmBox.show);
    const confirmBoxOnNo = useSelector((state: ClientState) => state.confirmBox.onNo);
    const dispatch = useDispatch();

    const currentNodeName = useRef<string | null>(null);
    const currentRootLocation = useRef<string | null>(null);
    const currentLocation = useRef<string | null>(null);

    const popState = useCallback((event: PopStateEvent) => {
        const {name, rootLocation: root, path = null, query = null, hash = null} = Browser.parseDocumentLocation();
        if (root === rootLocation) {
            dispatch(goToLocation(path, query, hash));
        } else {
            if (root != null) {
                dispatch(initFromLocation(name ?? null, root, path, query, hash));
            }
        }
        event.preventDefault();
    }, [dispatch, rootLocation]);

    const executeOnClose = useCallback((onClose: any) => {
        if (onClose) {
            if (typeof(onClose) === "function") {
                onClose();
            } else {
                dispatch(onClose);
            }
        }
    }, [dispatch]);

    const back = useCallback(() => {
        if (window.closeLightDialog) {
            window.closeLightDialog();
        } else if (messageBoxShow) {
            dispatch(closeMessageBox());
            executeOnClose(messageBoxOnClose);
        } else if (confirmBoxShow) {
            dispatch(closeConfirmBox());
            executeOnClose(confirmBoxOnNo);
        } else if (closeDialogAction != null) {
            dispatch(closeDialogAction);
            dispatch(dialogClosed());
        } else {
            window.Android?.back();
        }
    }, [closeDialogAction, confirmBoxOnNo, confirmBoxShow, dispatch, executeOnClose, messageBoxOnClose, messageBoxShow]);

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
                back();
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
    }, [back, dispatch]);

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
        if (!locked
            && (nodeName !== currentNodeName.current
                || rootLocation !== currentRootLocation.current
                || location !== currentLocation.current)
            && nodeName && rootLocation != null && location != null
        ) {
            const url = Browser.universalLocation(Browser.getRootLocation(), nodeName, rootLocation, location);
            const data = {location: url};
            if (update) {
                window.history.pushState(data, "", url);
            } else {
                window.history.replaceState(data, "", url);
            }
            window.Android?.locationChanged(url, location);
            currentRootLocation.current = rootLocation;
            currentLocation.current = location;
        }
    }, [dispatch, location, locked, nodeName, rootLocation, update]);

    useEffect(() => {
        const counter = count > 0 ? `(${count}) ` : "";
        if (title) {
            document.title = counter + title + " | Moera";
        } else {
            document.title = counter + "Moera";
        }
    }, [count, title]);

    return null;
}
