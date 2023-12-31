import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
    faBan,
    faEye,
    faGlobe,
    faHatCowboy,
    faLock,
    faShieldHalved,
    faUserGroup,
    faUsers,
    faUserSecret
} from '@fortawesome/free-solid-svg-icons';
import { TFunction } from 'i18next';

import { FriendGroupInfo, PrincipalValue } from "api";

export interface PrincipalDisplay {
    icon: IconProp,
    title: string
}

export function getPrincipalDisplay(principal: PrincipalValue | null | undefined, friendGroups: FriendGroupInfo[],
                                    t: TFunction): PrincipalDisplay {
    const display: PrincipalDisplay = {
        icon: faGlobe,
        title: t("principal-title.public")
    };
    switch (principal) {
        case null:
        case undefined:
            break;

        case "signed":
            display.icon = faShieldHalved;
            display.title = t("principal-title.signed");
            break;

        case "subscribed":
            display.icon = faEye;
            display.title = t("principal-title.subscribed");
            break;

        case "private":
        case "owner":
            display.icon = faLock;
            display.title = t("principal-title.only-me");
            break;

        case "secret":
        case "senior":
            display.icon = faUserSecret;
            display.title = t("principal-title.author");
            break;

        case "enigma":
        case "major":
        case "admin":
            display.icon = faHatCowboy;
            display.title = t("principal-title.admin");
            break;

        case "none":
            display.icon = faBan;
            display.title = t("principal-title.nobody");
            break;

        default:
            if (principal.startsWith("f:")) {
                const title = friendGroups.find(fg => fg.id === principal.substring(2))?.title;
                display.icon = title === "t:friends" ? faUsers : faUserGroup;
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
