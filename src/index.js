import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from "./store";

import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./App";

import * as serviceWorker from "./serviceWorker";

fetch("http://moera.please.start.com/"); // Call the browser extension to inject communication code
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("app-root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
