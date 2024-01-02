import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-widgets/styles.css';
import 'react-datepicker/dist/react-datepicker.min.css';

import "i18n";
import { Storage } from "storage";
import store from "state/store";
import { initFromLocation } from "state/navigation/actions";
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
Storage.loadData();
sendInitAction();

serviceWorker.unregister();
