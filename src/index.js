import React from 'react';
import ReactDOM from 'react-dom';
import * as URI from 'uri-js';

import { Provider } from 'react-redux';
import store from "state/store";
import { initFromLocation } from "state/navigation/actions";
import { registerSpoilerElement } from 'ui/customelements/MoeraSpoilerElement'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-widgets/dist/css/react-widgets.css';
import initIconLibrary from "./icons";
import simpleNumberLocalizer from 'react-widgets-simple-number';
import dateFnsLocalizer from 'react-widgets-date-fns';
import App from "ui/App";

import * as serviceWorker from "./serviceWorker";

function buildInitAction() {
    let rootLocation = window.location.protocol + "//" + window.location.host;
    let path = window.location.pathname;
    let query = window.location.search;
    let hash = window.location.hash;

    const header = document.body.getAttribute("data-x-moera");
    if (header) {
        header
            .split(/\s*;\s*/)
            .filter(s => s.includes("="))
            .map(s => s.split("="))
            .map(([name, value]) => ([name.toLowerCase(), decodeURIComponent(value)]))
            .forEach(([name, value]) => {
                let components;
                switch(name) {
                    case "root":
                        components = URI.parse(value);
                        rootLocation += components.path || "";
                        break;

                    case "page":
                        components = URI.parse(value);
                        path = components.path || "";
                        query = components.query || "";
                        break;

                    default:
                        break;
                }
            });
    }

    return initFromLocation(rootLocation, path, query, hash);
}

if (document.contentType === "text/plain") {
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
    store.dispatch(buildInitAction());

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: http://bit.ly/CRA-PWA
    serviceWorker.unregister();
} else {
    document.body.innerText = `Pages with content type '${document.contentType}' are not supported anymore
                               for security reasons. Please turn to administrator to upgrade the node software
                               to version 0.9.0 or later.`
}
