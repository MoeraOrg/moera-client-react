import { retry } from 'typed-redux-saga/macro';
import { CallEffect } from "redux-saga/effects";

const FETCH_TIMEOUT = 10000; // ms
const UPDATE_TIMEOUT = 300000; // ms
const RETRY_DELAY = 1000; // ms
const RETRY_LIMIT = 3;

// Source: https://stackoverflow.com/a/57888548/5541719
export function fetchTimeout(url: string, ms: number, { signal, ...options }: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const promise = fetch(url, { signal: controller.signal, ...options });
    if (signal) {
        signal.addEventListener("abort", () => controller.abort());
    }
    const timeout = setTimeout(() => controller.abort(), ms);
    return promise.finally(() => clearTimeout(timeout));
}

export function* retryFetch(url: string, options: RequestInit): Generator<CallEffect<Response>, Response> {
    let limit;
    let timeout;
    if (options.method === "POST" || options.method === "PUT") {
        limit = 1;
        timeout = UPDATE_TIMEOUT;
    } else {
        limit = RETRY_LIMIT;
        timeout = FETCH_TIMEOUT;
    }
    return yield *retry(limit, RETRY_DELAY, fetchTimeout, url, timeout, options);
}
