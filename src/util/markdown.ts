import { NodeName } from "api";

export function mentionName(name: string | null | undefined, fullName?: string | null): string {
    if (!name) {
        return "";
    }
    return "@" + NodeName.shorten(name) + (fullName ? `[${fullName}]` : "");
}
