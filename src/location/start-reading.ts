import i18n from 'i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { goToStartReading } from "state/navigation/actions";
import { LocationInfo } from "location/LocationInfo";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    let actions = [];
    if (srcInfo.directories[0] !== "start-reading") {
        actions.push(goToStartReading());
    }
    return actions;
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    return info.sub("start-reading").noIndex().withTitle(i18n.t("most-active-blogs"));
}
