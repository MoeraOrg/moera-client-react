type RelNodeNameType = "current" | "home";

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

    absolute(ownerNameOrUrl: string, homeOwnerNameOrUrl: string): string {
        if (this.isCurrentNode()) {
            return ownerNameOrUrl;
        } else {
            return homeOwnerNameOrUrl;
        }
    }

}

export const REL_CURRENT = new RelNodeName("current");
export const REL_HOME = new RelNodeName("home");

export function absoluteNodeName(
    nodeName: RelNodeName | string,
    {ownerNameOrUrl, homeOwnerNameOrUrl}: {ownerNameOrUrl: string, homeOwnerNameOrUrl: string}
): string {
    return nodeName instanceof RelNodeName ? nodeName.absolute(ownerNameOrUrl, homeOwnerNameOrUrl) : nodeName;
}
