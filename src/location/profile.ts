import i18n from 'i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { getNodeRootLocation } from "state/node/selectors";
import { goToProfile } from "state/navigation/actions";
import { LocationInfo } from "location/LocationInfo";
import { atOwner } from "util/names";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    return [goToProfile()];
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("profile");
    info = info.withCanonicalUrl(getNodeRootLocation(state) + info.toUrl());
    return info.withTitle(i18n.t("profile") + atOwner(state)).withBackTitle(i18n.t("back-profile"));
}
