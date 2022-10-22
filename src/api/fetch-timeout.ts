import { retry } from 'typed-redux-saga';
import { CallEffect } from 'redux-saga/effects';

import { FetcherOptions } from "api/fetcher";

const FETCH_TIMEOUT = 10000; // ms
const UPDATE_TIMEOUT = 60000; // ms
const RETRY_DELAY = 1000; // ms
const RETRY_LIMIT = 3;
const LARGE_BODY_MIN = 65536;

// Source: https://stackoverflow.com/a/57888548/5541719
export function fetchTimeout(url: string, timeoutMs: number | null,
                             { signal, ...options }: FetcherOptions = {}): Promise<Response> {
    const controller = new AbortController();
    const promise = fetch(url, { signal: controller.signal, ...options });
    if (signal) {
        signal.addEventListener("abort", () => controller.abort());
    }
    if (timeoutMs != null) {
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        return promise.finally(() => clearTimeout(timeout));
    } else {
        return promise;
    }
}

export function* retryFetch(url: string, options: FetcherOptions): Generator<CallEffect<Response>, Response> {
    let limit: number;
    let timeoutMs: number | null;
    if (options.method === "POST" || options.method === "PUT") {
        limit = 1;
        timeoutMs = (
            options.body instanceof Blob || (typeof (options.body) === "string" && options.body.length > LARGE_BODY_MIN)
        ) ? UPDATE_TIMEOUT : null;
    } else {
        limit = RETRY_LIMIT;
        timeoutMs = FETCH_TIMEOUT;
    }
    return yield* retry(limit, RETRY_DELAY, fetchTimeout, url, timeoutMs, options);
}
