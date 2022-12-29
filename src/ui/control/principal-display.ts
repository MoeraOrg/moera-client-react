import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { FriendGroupInfo, PrincipalValue } from "api/node/api-types";
import { TFunction } from "react-i18next";

export interface PrincipalDisplay {
    icon: IconProp,
    title: string
}

export function getPrincipalDisplay(principal: PrincipalValue | null | undefined, friendGroups: FriendGroupInfo[],
                                    t: TFunction): PrincipalDisplay {
    const display: PrincipalDisplay = {
        icon: "globe",
        title: t("principal-title.public")
    };
    switch (principal) {
        case null:
        case undefined:
            break;

        case "signed":
            display.icon = "shield-halved";
            display.title = t("principal-title.signed");
            break;

        case "subscribed":
            display.icon = "eye";
            display.title = t("principal-title.subscribed");
            break;

        case "private":
        case "owner":
            display.icon = "lock";
            display.title = t("principal-title.only-me");
            break;

        case "secret":
        case "senior":
            display.icon = "user-secret";
            display.title = t("principal-title.author");
            break;

        case "enigma":
        case "major":
        case "admin":
            display.icon = "hat-cowboy";
            display.title = t("principal-title.admin");
            break;

        case "none":
            display.icon = "ban";
            display.title = t("principal-title.nobody");
            break;

        default:
            if (principal.startsWith("f:")) {
                const title = friendGroups.find(fg => fg.id === principal.substring(2))?.title;
                display.icon = title === "t:friends" ? "users" : "user-group";
                display.title = getFriendGroupTitle(title, t);
            }
    }
    return display;
}

export function getFriendGroupTitle(title: string | null | undefined, t: TFunction): string {
    if (title == null) {
        return "";
    }
    if (title.startsWith("t:")) {
        return t("friend-groups." + title.substring(2));
    }
    return title;
}
