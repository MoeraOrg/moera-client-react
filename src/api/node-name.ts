export class NodeName {

    static parse(qName: string): RegisteredName<string>;
    static parse(qName: null): RegisteredName<null>;
    static parse(qName: string | null): RegisteredName;
    static parse(qName: string | null): RegisteredName {
        if (qName == null || qName === "") {
            return new RegisteredName(null);
        }
        const parts = qName.split("_");
        return new RegisteredName(parts[0],parts.length > 1 ? parseInt(parts[1]) : 0)
    }

    static shorten(qName: string): string;
    static shorten(qName: null): null;
    static shorten(qName: string | null): string | null;
    static shorten(qName: string | null): string | null {
        if (!qName) {
            return qName;
        }
        const nodeName = NodeName.parse(qName);
        return nodeName.generation === 0 ? nodeName.name : qName
    }

}

export class RegisteredName<NT extends string | null = string | null> {

    name: NT;
    generation: number;

    constructor(name: NT, generation: number | null = 0) {
        this.name = name;
        this.generation = generation ?? 0;
    }

    format(): string {
        return `${this.name}_${this.generation}`;
    }

}

export type NodeNameScheme = "registered" | "http";

export function getNodeNameScheme(nodeName: string): NodeNameScheme {
    if (nodeName.startsWith("http:") || nodeName.startsWith("https:")) {
        return "http";
    }
    return "registered";
}
