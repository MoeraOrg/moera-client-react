import React from 'react';
import ReactDOM from 'react-dom';
import * as URI from 'uri-js';

import { Provider } from 'react-redux';
import store from "state/store";
import { initFromLocation } from "state/navigation/actions";

import 'bootstrap/dist/css/bootstrap.min.css';
import App from "ui/App";

import * as serviceWorker from "./serviceWorker";

function buildInitAction() {
    let rootLocation = window.location.protocol + "//" + window.location.host;
    let path = window.location.pathname;
    let query = window.location.search;

    const body = document.getElementsByTagName("body")[0];
    const header = body.getAttribute("data-x-moera");
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
                        rootLocation += components.path;
                        break;

                    case "page":
                        components = URI.parse(value);
                        path = components.path;
                        query = components.query;
                        break;

                    default:
                        break;
                }
            });
    }

    return initFromLocation(rootLocation, path, query);
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("app-root")
);
store.dispatch(buildInitAction());

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
