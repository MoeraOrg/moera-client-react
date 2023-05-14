import i18n from 'i18next';

import { LocationInfo } from "location/LocationInfo";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";
import { goToComplains } from "state/navigation/actions";
import { atOwner } from "util/misc";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    return [goToComplains()];
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    return info.sub("complains").withTitle(i18n.t("complains") + atOwner(state));
}
