import pLimit from 'p-limit';

import { delay } from "util/misc";

class XhrResponse implements Response {

    readonly body: ReadableStream<Uint8Array> | null = null;
    readonly bodyUsed: boolean = false;
    readonly headers: Headers = new Headers();
    readonly ok: boolean;
    readonly redirected: boolean = false;
    readonly status: number;
    readonly statusText: string;
    readonly trailer: Promise<Headers> = Promise.resolve(new Headers());
    readonly type: ResponseType = "basic";
    readonly url: string;
    readonly xhr: XMLHttpRequest;
    readonly responseJSON: any;
    readonly responseJSONException: any = null;

    constructor(xhr: XMLHttpRequest, url: string) {
        xhr.getAllResponseHeaders().trim().split(/[\r\n]+/).forEach(line => {
            const parts = line.split(": ", 2);
            this.headers.set(parts[0], parts[1]);
        });
        this.ok = xhr.status >= 200 && xhr.status <= 299;
        this.status = xhr.status;
        this.statusText = xhr.statusText;
        this.url = url;
        this.xhr = xhr;
        try {
            this.responseJSON = JSON.parse(xhr.responseText);
        } catch (e) {
            this.responseJSONException = e;
        }
    }

    arrayBuffer(): Promise<ArrayBuffer> {
        return Promise.resolve(new ArrayBuffer(0));
    }

    blob(): Promise<Blob> {
        return Promise.resolve(new Blob());
    }

    bytes(): Promise<Uint8Array> {
        return Promise.resolve(new Uint8Array());
    }

    clone(): Response {
        return new XhrResponse(this.xhr, this.url);
    }

    formData(): Promise<FormData> {
        return Promise.resolve(new FormData());
    }

    json(): Promise<any> {
        if (this.responseJSONException == null) {
            return Promise.resolve(this.responseJSON);
        } else {
            return Promise.reject(this.responseJSONException);
        }
    }

    text(): Promise<string> {
        return Promise.resolve(this.xhr.responseText);
    }

}

export type ProgressHandler = (loaded: number, total: number) => void;

export interface FetcherOptions {
    method?: string;
    headers?: HeadersInit;
    body?: string | Blob | null;
    onProgress?: ProgressHandler;
}

function xhrFetch(url: string, options: FetcherOptions): Promise<Response> {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open(options.method ?? "GET", url, true);
        xhr.onload = function () {
            resolve(new XhrResponse(this, url));
        };
        xhr.onerror = () => reject("Upload failed");
        if (options.onProgress != null) {
            xhr.upload.onprogress = function (event) {
                if (options.onProgress != null && event.lengthComputable) {
                    options.onProgress(event.loaded, event.total)
                }
            };
        }
        if (options.headers != null) {
            if (options.headers instanceof Headers) {
                options.headers.forEach((value, name) => xhr.setRequestHeader(name, value));
            } else if (Array.isArray(options.headers)) {
                options.headers.forEach(header => xhr.setRequestHeader(header[0], header[1]));
            } else {
                const headers = options.headers;
                Object.keys(headers).forEach(name => xhr.setRequestHeader(name, headers[name]))
            }
        }
        xhr.send(options.body);
    });
}

const FETCH_TIMEOUT = 10000; // ms
const UPDATE_TIMEOUT = 60000; // ms
const RETRY_DELAY = 1000; // ms
const RETRY_LIMIT = 3;
const LARGE_BODY_MIN = 65536;
const parallelLimit = pLimit(50);

async function retryFetch(url: string, options: FetcherOptions): Promise<Response> {
    let limit: number;
    let signal: AbortSignal | null;
    if (options.method === "POST" || options.method === "PUT") {
        limit = 1;
        const largeBody = options.body instanceof Blob
            || (typeof (options.body) === "string" && options.body.length > LARGE_BODY_MIN);
        signal = AbortSignal.timeout(largeBody ? UPDATE_TIMEOUT : FETCH_TIMEOUT);
    } else {
        limit = RETRY_LIMIT;
        signal = AbortSignal.timeout(FETCH_TIMEOUT);
    }

    let exception: any;
    for (let i = 0; i < limit; i++) {
        try {
            return await fetch(url, {signal, ...options});
        } catch (e) {
            exception = e;
        }
        await delay(RETRY_DELAY);
    }

    throw exception;
}

export async function fetcher(url: string, options: FetcherOptions): Promise<Response> {
    return options.onProgress != null ? xhrFetch(url, options) : parallelLimit(() => retryFetch(url, options));
}
