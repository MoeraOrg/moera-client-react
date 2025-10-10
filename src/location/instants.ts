import i18n from 'i18next';

import { LocationInfo } from "location/LocationInfo";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";
import { getNodeRootLocation } from "state/node/selectors";
import { goToInstants } from "state/navigation/actions";
import { tTitle } from "i18n";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    return [goToInstants()];
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("instants");
    info = info.withCanonicalUrl(getNodeRootLocation(state) + info.toUrl()).noIndex();
    return info.withTitle(tTitle(i18n.t("instants")));
}
