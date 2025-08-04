import { TFunction } from 'i18next';

import { FriendGroupInfo, PrincipalValue } from "api";
import {
    MaterialSymbol,
    msBlock,
    msGroup,
    msGroups,
    msLock,
    msPersonBook,
    msPublic,
    msShieldPerson,
    msVerifiedUser,
    msVisibility
} from "ui/material-symbols";

export interface PrincipalDisplay {
    icon: MaterialSymbol,
    title: string
}

export function getPrincipalDisplay(
    principal: PrincipalValue | null | undefined,
    friendGroups: FriendGroupInfo[],
    t: TFunction
): PrincipalDisplay {
    const display: PrincipalDisplay = {
        icon: msPublic,
        title: t("principal-title.public")
    };
    switch (principal) {
        case null:
        case undefined:
            break;

        case "signed":
            display.icon = msVerifiedUser;
            display.title = t("principal-title.signed");
            break;

        case "subscribed":
            display.icon = msVisibility;
            display.title = t("principal-title.subscribed");
            break;

        case "private":
        case "owner":
            display.icon = msLock;
            display.title = t("principal-title.only-me");
            break;

        case "secret":
        case "senior":
            display.icon = msPersonBook;
            display.title = t("principal-title.author");
            break;

        case "enigma":
        case "major":
        case "admin":
            display.icon = msShieldPerson;
            display.title = t("principal-title.admin");
            break;

        case "none":
            display.icon = msBlock;
            display.title = t("principal-title.nobody");
            break;

        default:
            if (principal.startsWith("f:")) {
                const title = friendGroups.find(fg => fg.id === principal.substring(2))?.title;
                display.icon = title === "t:friends" ? msGroups : msGroup;
                display.title = getFriendGroupTitle(title, t) || t("friend-groups.friends");
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
