import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-widgets/styles.css';

import store from "state/store";
import { initFromLocation, initStorage } from "state/navigation/actions";
import { registerSpoilerElement } from 'ui/customelements/MoeraSpoilerElement'
import initIconLibrary from "./icons";
import { Browser } from "ui/browser";
import App from "ui/App";
import * as serviceWorker from "serviceWorker";

function sendInitAction(standalone) {
    store.dispatch(initStorage(standalone));
    const {rootLocation, path, query, hash} = !standalone
        ? Browser.getDocumentLocation()
        : Browser.getDocumentPassedLocation();
    if (rootLocation != null) {
        store.dispatch(initFromLocation(rootLocation, path, query, hash));
    }
}

const standalone = document.body.dataset.comPassword == null && document.body.dataset.comInitialized == null;
if (standalone || document.contentType === "text/plain") {
    serviceWorker.register();

    Browser.init();
    initIconLibrary();
    registerSpoilerElement();
    ReactDOM.render(
        <Provider store={store}>
            <App/>
        </Provider>,
        document.getElementById("app-root")
    );
    sendInitAction(standalone);
} else {
    document.body.innerText = `Pages with content type '${document.contentType}' are not supported anymore
                               for security reasons. Please turn to administrator to upgrade the node software
                               to version 0.9.0 or later.`
}
