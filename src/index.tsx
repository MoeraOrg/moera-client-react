import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import "./bootstrap.scss";
import 'react-widgets/styles.css';
import 'react-datepicker/dist/react-datepicker.min.css';

import "i18n";
import initStore from "state/store";
import { dispatch } from "state/store-sagas";
import { boot } from "state/navigation/actions";
import { OverlaysManager } from "ui/overlays/overlays";
import App from "ui/App";
import * as serviceWorker from "sw/ServiceWorkerFrontend";

window.overlays = new OverlaysManager();
window.Android?.setSwipeRefreshEnabled(false);
initStore();

const rootElement = document.getElementById("app-root");
if (rootElement != null) {
    createRoot(rootElement).render(
        <Provider store={window.store}>
            <StrictMode>
                <App/>
            </StrictMode>
        </Provider>
    )
}
dispatch(boot());

serviceWorker.register();
