import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { dialogClosed, goToLocation, initFromLocation, swipeRefreshUpdate } from "state/navigation/actions";
import { getInstantCount } from "state/feeds/selectors";
import { getNodeRootLocation, getNodeRootPage } from "state/node/selectors";
import { closeMessageBox } from "state/messagebox/actions";
import { closeConfirmBox } from "state/confirmbox/actions";
import { Browser } from "ui/browser";

const forwardAction = (action: any) => action;

type Props = ConnectedProps<typeof connector>;

class Navigation extends React.PureComponent<Props> {

    #rootPage: string | null = null;
    #location: string | null = null;

    componentDidMount() {
        window.addEventListener("popstate", this.popState);
        if (Browser.isAndroidApp()) {
            window.addEventListener("message", this.messageReceived);
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        const {rootPage, location, title, update, locked, count, swipeRefreshUpdate} = this.props;

        if (!locked
            && (rootPage !== this.#rootPage || location !== this.#location)
            && rootPage != null && location != null) {

            const data = {location: rootPage + location};
            const url = Browser.passedLocation(rootPage + location);
            if (update) {
                window.history.pushState(data, "", url);
            } else {
                window.history.replaceState(data, "", url);
            }
            if (window.Android) {
                window.Android.locationChanged(url, location);
                swipeRefreshUpdate();
            }
            this.#rootPage = rootPage;
            this.#location = location;
        }
        if (title !== prevProps.title || count !== prevProps.count) {
            const counter = count > 0 ? `(${count}) ` : "";
            if (title) {
                document.title = counter + title + " | Moera";
            } else {
                document.title = counter + "Moera";
            }
        }
    }

    popState = (event: PopStateEvent) => {
        const {rootLocation, initFromLocation, goToLocation} = this.props;

        const {rootLocation: root, path = null, query = null, hash = null} = Browser.getDocumentPassedLocation();
        if (root === rootLocation) {
            goToLocation(path, query, hash);
        } else {
            if (root != null) {
                initFromLocation(null, root, path, query, hash);
            }
        }
        event.preventDefault();
    };

    messageReceived = (event: MessageEvent) => {
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
                this.back();
                return;

            default:
                return;
        }
    };

    back() {
        const {
            closeDialogAction, messageBoxShow, messageBoxOnClose, confirmBoxShow, confirmBoxOnNo, forwardAction,
            dialogClosed, closeMessageBox, closeConfirmBox
        } = this.props;

        if (window.closeLightDialog) {
            window.closeLightDialog();
        } else if (messageBoxShow) {
            closeMessageBox();
            this.executeOnClose(messageBoxOnClose);
        } else if (confirmBoxShow) {
            closeConfirmBox();
            this.executeOnClose(confirmBoxOnNo);
        } else if (closeDialogAction != null) {
            forwardAction(closeDialogAction);
            dialogClosed();
        } else {
            if (window.Android) {
                window.Android.back();
            }
        }
    }

    executeOnClose(onClose: any) {
        const {forwardAction} = this.props;

        if (onClose) {
            if (typeof(onClose) === "function") {
                onClose();
            } else {
                forwardAction(onClose);
            }
        }
    }

    render() {
        return null;
    }

}

const connector = connect(
    (state: ClientState) => ({
        rootLocation: getNodeRootLocation(state),
        rootPage: getNodeRootPage(state),
        location: state.navigation.location,
        title: state.navigation.title,
        update: state.navigation.update,
        locked: state.navigation.locked,
        count: getInstantCount(state),
        closeDialogAction: state.navigation.closeDialogAction,
        messageBoxShow: state.messageBox.show,
        messageBoxOnClose: state.messageBox.onClose,
        confirmBoxShow: state.confirmBox.show,
        confirmBoxOnNo: state.confirmBox.onNo
    }),
    {
        initFromLocation, goToLocation, forwardAction, dialogClosed, closeMessageBox, closeConfirmBox,
        swipeRefreshUpdate
    }
);

export default connector(Navigation);
