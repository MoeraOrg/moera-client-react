import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { PrincipalValue } from "api/node/api-types";

interface PrincipalDisplay {
    icon: IconProp,
    title: string
}

export function getPrincipalDisplay(principal: PrincipalValue | null | undefined): PrincipalDisplay {
    const display: PrincipalDisplay = {
        icon: "globe",
        title: "principal-title.public"
    };
    switch (principal) {
        case "signed":
            display.icon = "shield-halved";
            display.title = "principal-title.signed";
            break;

        case "private":
        case "owner":
            display.icon = "lock";
            display.title = "principal-title.only-me";
            break;

        case "secret":
        case "senior":
            display.icon = "user-secret";
            display.title = "principal-title.author";
            break;

        case "enigma":
        case "major":
        case "admin":
            display.icon = "hat-cowboy";
            display.title = "principal-title.admin";
            break;

        case "none":
            display.icon = "ban";
            display.title = "principal-title.nobody";
    }
    return display;
}
