import i18n from 'i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { goToPeople } from "state/navigation/actions";
import { peopleGoToTab } from "state/people/actions";
import { getPeopleTab } from "state/people/selectors";
import { getNodeFriendGroups, getNodeRootLocation } from "state/node/selectors";
import { LocationInfo } from "location/LocationInfo";
import { getPeopleTabTitle } from "ui/people/people-tabs";
import { atOwner } from "util/names";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    let actions: ClientAction[] = [];
    if (srcInfo.directories[0] !== "people") {
        actions.push(goToPeople());
    }
    const srcTab = srcInfo.directories.length > 1 ? srcInfo.directories[1] : "";
    const dstTab = dstInfo.directories.length > 1 ? dstInfo.directories[1] : "subscribers";
    if (srcTab !== dstTab) {
        actions.push(peopleGoToTab(dstTab));
    }
    return actions;
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("people").sub(getPeopleTab(state));
    info = info.withCanonicalUrl(getNodeRootLocation(state) + info.toUrl());
    return info
        .withTitle(getPeopleTabTitle(getPeopleTab(state), getNodeFriendGroups(state), i18n.t) + atOwner(state))
        .withBackTitle(i18n.t("back-people"));
}
