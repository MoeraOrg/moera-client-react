export class LocationInfo {

    directories: string[];
    parameters: Partial<Record<string, string>>;
    hash: string;
    title: string | null;
    canonicalUrl: string | null;
    noIndexPage: boolean;
    error: boolean;

    constructor() {
        this.directories = [];
        this.parameters = {};
        this.hash = "";
        this.title = "";
        this.canonicalUrl = null;
        this.noIndexPage = false;
        this.error = false;
    }

    static fromUrl(path: string | null, query: string | null, hash: string | null): LocationInfo {
        return new LocationInfo().withPath(path).withQuery(query).withHash(hash);
    }

    clone(): LocationInfo {
        const info = new LocationInfo();
        info.directories = [...this.directories];
        info.parameters = {...this.parameters};
        info.hash = this.hash;
        info.title = this.title;
        info.canonicalUrl = this.canonicalUrl;
        info.noIndexPage = this.noIndexPage;
        info.error = this.error;
        return info;
    }

    sub(name: string): LocationInfo {
        const info = this.clone();
        info.directories.push(name);
        return info;
    }

    withPath(path: string | null): LocationInfo {
        const info = this.clone();
        if (path) {
            info.directories = path.split("/").filter(s => s !== "")
        }
        return info;
    }

    withNoQuery(): LocationInfo {
        const info = this.clone();
        info.parameters = {};
        return info;
    }

    withQuery(query: string | null): LocationInfo {
        const info = this.clone();
        if (query) {
            if (query.startsWith("?")) {
                query = query.substring(1);
            }
            query.split("&").forEach(param => {
                const [name, value] = param.split("=");
                info.parameters[name] = decodeURIComponent(value);
            });
        }
        return info;
    }

    withParameter(name: string, value: string): LocationInfo {
        const info = this.clone();
        info.parameters[name] = value;
        return info;
    }

    withHash(hash: string | null): LocationInfo {
        const info = this.clone();
        if (hash) {
            if (hash.startsWith("#")) {
                hash = hash.substring(1);
            }
            info.hash = hash;
        }
        return info;
    }

    withTitle(title: string | null): LocationInfo {
        const info = this.clone();
        info.title = title;
        return info;
    }

    withCanonicalUrl(canonicalUrl: string | null): LocationInfo {
        const info = this.clone();
        info.canonicalUrl = canonicalUrl;
        return info;
    }

    noIndex(): LocationInfo {
        const info = this.clone();
        info.noIndexPage = true;
        return info;
    }

    withError(): LocationInfo {
        const info = this.clone();
        info.error = true;
        return info;
    }

    toUrl(): string {
        const path = this.directories.map(dir => "/" + dir).join("");
        let query = "";
        for (let name in this.parameters) {
            if (this.parameters.hasOwnProperty(name)) {
                query += (query === "" ? "?" : "&") + name + "=" + encodeURIComponent(this.parameters[name]!);
            }
        }
        const hash = this.hash ? "#" + this.hash : "";
        return path + query + hash;
    }

}
