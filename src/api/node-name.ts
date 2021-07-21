export class NodeName {

    static parse(qName: string | null): RegisteredName {
        if (qName == null || qName === "") {
            return new RegisteredName();
        }
        const parts = qName.split("_");
        return new RegisteredName(parts[0],parts.length > 1 ? parseInt(parts[1]) : 0)
    }

    static shorten(qName: string | null): string | null {
        if (!qName) {
            return qName;
        }
        const nodeName = NodeName.parse(qName);
        return nodeName.generation === 0 ? nodeName.name : qName
    }

}

export class RegisteredName {

    name: string | null;
    generation: number;

    constructor(name: string | null = null, generation: number | null = 0) {
        this.name = name;
        this.generation = generation ?? 0;
    }

    format(): string {
        return `${this.name}_${this.generation}`;
    }

}
