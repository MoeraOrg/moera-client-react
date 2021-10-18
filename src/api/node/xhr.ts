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

export type RequestOptions = RequestInit & {
    onProgress?: ProgressHandler;
}

export function xhrFetch(url: string, options: RequestOptions): Promise<Response> {
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
                Object.getOwnPropertyNames(headers).forEach(name => xhr.setRequestHeader(name, headers[name]))
            }
        }
        xhr.send(options.body);
    });
}
