import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import "./bootstrap.scss";
import 'react-widgets/styles.css';
import 'react-datepicker/dist/react-datepicker.min.css';

import "i18n";
import { Storage } from "storage";
import store from "state/store";
import { goHomeLocation, goToRemoval, initFromLocation, initFromNodeLocation } from "state/navigation/actions";
import { storyReadingUpdate } from "state/stories/actions";
import * as Browser from "ui/browser";
import { OverlaysManager } from "ui/overlays/overlays";
import App from "ui/App";
import { REL_HOME } from "util/rel-node-name";
import * as serviceWorker from "sw/ServiceWorkerFrontend";

function sendInitAction(): void {
    const {name, rootLocation, path = null, query = null, hash = null} = Browser.parseDocumentLocation();
    if (rootLocation != null) {
        store.dispatch(initFromLocation(name ?? null, rootLocation, path, query, hash));
    } else if (name != null) {
        store.dispatch(initFromNodeLocation(name, path, query, hash, null));
    } else if (path?.startsWith("removal")) {
        store.dispatch(goToRemoval());
    } else if (path && path !== "/") {
        store.dispatch(goHomeLocation(path, query, hash));
    } else {
        store.dispatch(goHomeLocation("/news", null, null));
    }
    const readId = Browser.parameters.get("read");
    if (readId) {
        store.dispatch(storyReadingUpdate(REL_HOME, "instant", readId, true));
    }
}

window.overlays = new OverlaysManager();
window.Android?.setSwipeRefreshEnabled(false);

const rootElement = document.getElementById("app-root");
if (rootElement != null) {
    createRoot(rootElement).render(
        <Provider store={store}>
            <StrictMode>
                <App/>
            </StrictMode>
        </Provider>
    )
}
sendInitAction();
Storage.loadData();

serviceWorker.register();
