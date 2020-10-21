import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-widgets/dist/css/react-widgets.css';
import simpleNumberLocalizer from 'react-widgets-simple-number';
import dateFnsLocalizer from 'react-widgets-date-fns';

import { Browser } from "api";
import store from "state/store";
import { initFromLocation } from "state/navigation/actions";
import { registerSpoilerElement } from 'ui/customelements/MoeraSpoilerElement'
import initIconLibrary from "./icons";
import App from "ui/App";

import * as serviceWorker from "./serviceWorker";

function buildInitAction(standalone) {
    const {rootLocation, path, query, hash} = !standalone ? Browser.getDocumentLocation() : Browser.getPassedLocation();
    return initFromLocation(standalone, rootLocation, path, query, hash);
}

const standalone = !document.body.dataset.comPassword;
if (standalone || document.contentType === "text/plain") {
    initIconLibrary();
    simpleNumberLocalizer();
    dateFnsLocalizer();
    registerSpoilerElement();
    ReactDOM.render(
        <Provider store={store}>
            <App/>
        </Provider>,
        document.getElementById("app-root")
    );
    store.dispatch(buildInitAction(standalone));

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: http://bit.ly/CRA-PWA
    serviceWorker.unregister();
} else {
    document.body.innerText = `Pages with content type '${document.contentType}' are not supported anymore
                               for security reasons. Please turn to administrator to upgrade the node software
                               to version 0.9.0 or later.`
}
