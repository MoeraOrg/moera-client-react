import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { PrincipalValue } from "api/node/api-types";

interface PrincipalDisplay {
    icon: IconProp,
    title: string
}

export function getPrincipalDisplay(principal: PrincipalValue | null | undefined): PrincipalDisplay {
    const display: PrincipalDisplay = {
        icon: "globe",
        title: "Public"
    };
    switch (principal) {
        case "signed":
            display.icon = "shield-halved";
            display.title = "Signed";
            break;

        case "private":
        case "owner":
        case "admin":
            display.icon = "lock";
            display.title = "Only me";
            break;

        case "none":
            display.icon = "ban";
            display.title = "Nobody";
    }
    return display;
}
