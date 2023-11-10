import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-widgets/styles.css';
import 'react-datepicker/dist/react-datepicker.min.css';

import "i18n";
import { Storage } from "storage";
import store from "state/store";
import { initFromLocation } from "state/navigation/actions";
import initIconLibrary from "./icons";
import { Browser } from "ui/browser";
import App from "ui/App";
import * as serviceWorker from "serviceWorker";

function sendInitAction(): void {
    const {rootLocation, path = null, query = null, hash = null} = Browser.getDocumentPassedLocation();
    if (rootLocation != null) {
        store.dispatch(initFromLocation(null, rootLocation, path, query, hash));
    }
}

Browser.init();
initIconLibrary();
const rootElement = document.getElementById("app-root");
if (rootElement != null) {
    createRoot(rootElement).render(
        <Provider store={store}>
            <App/>
        </Provider>
    )
}
sendInitAction();
Storage.loadData();

serviceWorker.unregister();
