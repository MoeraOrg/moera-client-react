import { retry } from "redux-saga/effects";

const FETCH_TIMEOUT = 5000; // ms
const RETRY_DELAY = 1000; // ms
const RETRY_LIMIT = 3;

// Source: https://stackoverflow.com/a/57888548/5541719
export function fetchTimeout(url, ms, { signal, ...options } = {}) {
    const controller = new AbortController();
    const promise = fetch(url, { signal: controller.signal, ...options });
    if (signal) {
        signal.addEventListener("abort", () => controller.abort());
    }
    const timeout = setTimeout(() => controller.abort(), ms);
    return promise.finally(() => clearTimeout(timeout));
}

export function* retryFetch(url, options) {
    return yield retry(RETRY_LIMIT, RETRY_DELAY, fetchTimeout, url, FETCH_TIMEOUT, options);
}
