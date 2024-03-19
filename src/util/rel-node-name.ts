type RelNodeNameType = "current" | "home";

export interface RelNodeNameContext {
    ownerNameOrUrl: string,
    homeOwnerNameOrUrl: string
}

export class RelNodeName {

    private readonly type: RelNodeNameType;

    constructor(type: RelNodeNameType) {
        this.type = type;
    }

    isCurrentNode(): boolean {
        return this.type === "current";
    }

    isHomeNode(): boolean {
        return this.type === "home";
    }

    absolute({ownerNameOrUrl, homeOwnerNameOrUrl}: RelNodeNameContext): string {
        if (this.isCurrentNode()) {
            return ownerNameOrUrl;
        } else {
            return homeOwnerNameOrUrl;
        }
    }

    valueOf(): string {
        return this.type;
    }

    toString(): string {
        return `RelNodeName.${this.type.toUpperCase()}`;
    }

}

export const REL_CURRENT = new RelNodeName("current");
export const REL_HOME = new RelNodeName("home");

export function absoluteNodeName(nodeName: RelNodeName | string, context: RelNodeNameContext): string {
    return nodeName instanceof RelNodeName ? nodeName.absolute(context) : nodeName;
}
