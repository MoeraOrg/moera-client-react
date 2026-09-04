// Copied from moeralib

/** A service identified from a node source URI. */
export type NodeSourceUriService = "telegram";

/** A node source URI with an ordered set of percent-encoded parameters. */
export class NodeSourceUri {
    /** The value of this parameter is the contact e-mail address of the importing service that delivers content for
     * this node. */
    static readonly VIA_EMAIL = "via_email";

    private _uri = "";
    private _parameters: Record<string, string> = {};

    constructor(uri: string = "") {
        this.uri = uri;
    }

    /** Parse a serialized node source URI. */
    static parse(sourceUri: string): NodeSourceUri {
        const parts = sourceUri.split(";");
        const result = new NodeSourceUri(parts[0]);
        for (const part of parts.slice(1)) {
            const equals = part.indexOf("=");
            const name = decode(equals >= 0 ? part.substring(0, equals) : part);
            const value = decode(equals >= 0 ? part.substring(equals + 1) : "");
            result.setParameter(name, value);
        }
        return result;
    }

    /** URI part. */
    get uri(): string {
        return this._uri;
    }

    set uri(uri: string) {
        if (uri.includes(";")) {
            throw new TypeError("Node source URI must not contain a semicolon");
        }
        this._uri = uri;
    }

    /** Mutable live parameter object. */
    get parameters(): Record<string, string> {
        return this._parameters;
    }

    /** Replace all parameters with a copy of the supplied parameters. Empty names are ignored. */
    setParameters(parameters: Readonly<Record<string, string>>): void {
        const copied: Record<string, string> = {};
        Object.entries(parameters).forEach(([name, value]) => {
            if (name) {
                copied[name] = value;
            }
        });
        this._parameters = copied;
    }

    /** Return whether the named parameter exists. */
    hasParameter(name: string): boolean {
        return Object.prototype.hasOwnProperty.call(this._parameters, name);
    }

    /** Return a parameter value, or `undefined` if it does not exist. */
    getParameter(name: string): string | undefined {
        return this.hasParameter(name) ? this._parameters[name] : undefined;
    }

    /** Set a parameter. An empty name is ignored. */
    setParameter(name: string, value: string): void {
        if (name) {
            this._parameters[name] = value;
        }
    }

    /** Return the service identified by the URI, or `undefined` if it is not supported. */
    getService(): NodeSourceUriService | undefined {
        if (this._uri.startsWith("https://t.me/")) {
            return "telegram";
        }
        return undefined;
    }

    /** Serialize the URI and encoded parameters. */
    toString(): string {
        let result = this._uri;
        Object.entries(this._parameters).forEach(([name, value]) => {
            result += `;${encode(name)}=${encode(value)}`;
        });
        return result;
    }
}

function encode(value: string): string {
    return encodeURIComponent(value).replace(/[!'()*]/g, c =>
        `%${c.charCodeAt(0).toString(16).toUpperCase()}`
    );
}

function decode(value: string): string {
    let result = "";
    let position = 0;
    while (position < value.length) {
        if (isEscape(value, position)) {
            const bytes: number[] = [];
            while (isEscape(value, position)) {
                bytes.push(Number.parseInt(value.substring(position + 1, position + 3), 16));
                position += 3;
            }
            result += new TextDecoder("utf-8").decode(new Uint8Array(bytes));
        } else {
            result += value[position++];
        }
    }
    return result;
}

function isEscape(value: string, position: number): boolean {
    return position + 2 < value.length
        && value[position] === "%"
        && isHex(value[position + 1])
        && isHex(value[position + 2]);
}

function isHex(value: string): boolean {
    return /^[0-9a-f]$/i.test(value);
}
