import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-widgets/styles.css';
import 'react-datepicker/dist/react-datepicker.min.css';

import "i18n";
import store from "state/store";
import { initFromLocation } from "state/navigation/actions";
import initIconLibrary from "./icons";
import { Browser } from "ui/browser";
import App from "ui/App";
import * as serviceWorker from "serviceWorker";

function sendInitAction(): void {
    const {rootLocation, path = null, query = null, hash = null} = Browser.getDocumentPassedLocation();
    if (rootLocation != null) {
        store.dispatch(initFromLocation(rootLocation, path, query, hash));
    }
}

Browser.init();
initIconLibrary();
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("app-root")
);
sendInitAction();

serviceWorker.unregister();
