export default class LocationInfo {

    constructor() {
        this.directories = [];
        this.parameters = {};
        this.hash = "";
        this.title = "";
    }

    static fromUrl(path, query, hash) {
        return new LocationInfo().withPath(path).withQuery(query).withHash(hash);
    }

    clone() {
        let info = new LocationInfo();
        info.directories = [...this.directories];
        info.parameters = {...this.parameters};
        info.hash = this.hash;
        info.title = this.title;
        return info;
    }

    sub(name) {
        let info = this.clone();
        info.directories.push(name);
        return info;
    }

    withPath(path) {
        let info = this.clone();
        if (path) {
            info.directories = path.split("/").filter(s => s !== "")
        }
        return info;
    }

    withNoQuery() {
        let info = this.clone();
        info.parameters = {};
        return info;
    }

    withQuery(query) {
        let info = this.clone();
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

    withParameter(name, value) {
        let info = this.clone();
        info.parameters[name] = value;
        return info;
    }

    withHash(hash) {
        let info = this.clone();
        if (hash) {
            if (hash.startsWith("#")) {
                hash = hash.substring(1);
            }
            info.hash = hash;
        }
        return info;
    }

    withTitle(title) {
        let info = this.clone();
        info.title = title;
        return info;
    }

    hasTitle() {
        return this.title != null && this.title !== "";
    }

    toUrl() {
        const path = this.directories.map(dir => "/" + dir).join("");
        let query = "";
        for (let name in this.parameters) {
            if (this.parameters.hasOwnProperty(name)) {
                query += (query === "" ? "?" : "&") + name + "=" + encodeURIComponent(this.parameters[name]);
            }
        }
        const hash = this.hash ? "#" + this.hash : "";
        return path + query + hash;
    }

}
