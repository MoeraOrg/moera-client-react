import { TFunction } from 'i18next';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { getOwnerName } from "state/node/selectors";
import { NameDisplayMode } from "ui/types";

export function mentionName(name: string | null | undefined, fullName?: string | null): string {
    if (!name) {
        return "";
    }
    return "@" + NodeName.shorten(name) + (fullName ? `[${fullName}]` : "");
}

export function formatFullName(nodeName: string | null | undefined, fullName: string | null | undefined,
                               mode: NameDisplayMode): string {
    const name = nodeName != null ? NodeName.shorten(nodeName) : null;
    switch (mode) {
        case "name":
            return name || "?";
        case "full-name":
            return fullName || name || "?";
        case "both":
            return fullName ? `${fullName} (${name || "?"})` : (name || "?");
        default:
            return "?";
    }
}

export function longGender(gender: any, t: TFunction): string {
    if (typeof gender === "string") {
        gender = gender.toLowerCase();
        return gender === "male" || gender === "female" ? t(gender) : gender;
    }
    return "";
}

export function shortGender(gender: string | null, t: TFunction): string | null {
    if (gender == null) {
        return null;
    }
    switch (gender.toLowerCase()) {
        case "male":
            return t("male-short");
        case "female":
            return t("female-short");
        default:
            return gender;
    }
}

export function atOwner(state: ClientState): string {
    const ownerName = getOwnerName(state);
    return ownerName ? " @ " + NodeName.shorten(ownerName) : "";
}
