type RelNodeNameType = "current" | "home" | "search";

export interface RelNodeNameContext {
    ownerNameOrUrl: string;
    homeOwnerNameOrUrl: string;
    searchName: string;
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

    isSearchNode(): boolean {
        return this.type === "search";
    }

    absolute({ownerNameOrUrl, homeOwnerNameOrUrl, searchName}: RelNodeNameContext): string {
        if (this.isCurrentNode()) {
            return ownerNameOrUrl;
        } else if (this.isHomeNode()) {
            return homeOwnerNameOrUrl;
        } else {
            return searchName;
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
export const REL_SEARCH = new RelNodeName("search");

export function absoluteNodeName(nodeName: RelNodeName | string, context: RelNodeNameContext): string {
    return nodeName instanceof RelNodeName ? nodeName.absolute(context) : nodeName;
}
