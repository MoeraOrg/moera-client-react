import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { dialogClosed, goToLocation, initFromLocation, swipeRefreshUpdate } from "state/navigation/actions";
import { getInstantCount } from "state/feeds/selectors";
import { getNodeRootLocation, getNodeRootPage } from "state/node/selectors";
import { closeMessageBox } from "state/messagebox/actions";
import { closeConfirmBox } from "state/confirmbox/actions";
import { Browser } from "ui/browser";

export default function Navigation() {
    const rootLocation = useSelector(getNodeRootLocation);
    const rootPage = useSelector(getNodeRootPage);
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

    const currentRootPage = useRef<string | null>(null);
    const currentLocation = useRef<string | null>(null);

    const popState = useCallback((event: PopStateEvent) => {
        const {rootLocation: root, path = null, query = null, hash = null} = Browser.getDocumentPassedLocation();
        if (root === rootLocation) {
            dispatch(goToLocation(path, query, hash));
        } else {
            if (root != null) {
                dispatch(initFromLocation(null, root, path, query, hash));
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
            if (window.Android) {
                window.Android.back();
            }
        }
    }, [closeDialogAction, confirmBoxOnNo, confirmBoxShow, dispatch, executeOnClose, messageBoxOnClose, messageBoxShow]);

    const messageReceived = useCallback((event: MessageEvent) => {
        let message = event.data;
        if (message === null || typeof message !== "string") {
            return;
        }
        message = JSON.parse(message);

        // Only accept messages that we know are ours
        if (message.source !== "moera-android") {
            return;
        }

        switch (message.action) {
            case "back":
                back();
                return;

            default:
                return;
        }
    }, [back]);

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
            && (rootPage !== currentRootPage.current || location !== currentLocation.current)
            && rootPage != null && location != null
        ) {
            const data = {location: rootPage + location};
            const url = Browser.passedLocation(rootPage + location);
            if (update) {
                window.history.pushState(data, "", url);
            } else {
                window.history.replaceState(data, "", url);
            }
            if (window.Android) {
                window.Android.locationChanged(url, location);
                dispatch(swipeRefreshUpdate());
            }
            currentRootPage.current = rootPage;
            currentLocation.current = location;
        }
    }, [dispatch, location, locked, rootPage, update]);

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
