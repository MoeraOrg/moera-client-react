export class NodeName {

    static parse(qName) {
        if (qName == null || qName === "") {
            return new RegisteredName(null, null);
        }
        const parts = qName.split("_");
        return new RegisteredName(parts[0],parts.length > 1 ? parseInt(parts[1]) : null)
    }

    static shorten(qName, latest) {
        if (!qName) {
            return null;
        }
        return latest ? NodeName.parse(qName).name : qName
    }

}

export class RegisteredName {

    constructor(name, generation) {
        this.name = name;
        this.generation = generation;
    }

    format() {
        return `${this.name}_${this.generation}`;
    }

}
