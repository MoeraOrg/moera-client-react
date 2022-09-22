import i18n from 'i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { goToPeople } from "state/navigation/actions";
import { peopleGoToTab } from "state/people/actions";
import { LocationInfo } from "location/LocationInfo";
import { atOwner } from "util/misc";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    let actions: ClientAction[] = [];
    if (srcInfo.directories[0] !== "people") {
        actions.push(goToPeople());
    }
    const srcTab = srcInfo.directories.length > 1
        && (srcInfo.directories[1] === "subscriptions" || srcInfo.directories[1] === "subscribers")
        ? srcInfo.directories[1] : "";
    const dstTab = dstInfo.directories.length > 1 && dstInfo.directories[1] === "subscriptions"
        ? "subscriptions" : "subscribers";
    if (srcTab !== dstTab) {
        actions.push(peopleGoToTab(dstTab));
    }
    return actions;
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("people");
    if (state.people.tab === "subscribers") {
        info = info.sub("subscribers").withTitle(i18n.t("subscribers") + atOwner(state));
    } else if (state.people.tab === "subscriptions") {
        info = info.sub("subscriptions").withTitle(i18n.t("subscriptions") + atOwner(state));
    }
    return info;
}
