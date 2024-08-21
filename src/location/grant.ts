import i18n from 'i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { goToGrant } from "state/navigation/actions";
import { LocationInfo } from "location/LocationInfo";
import { NodeName, Scope, SCOPES } from "api";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    let actions = [];
    if (srcInfo.directories[0] !== "grant") {
        const scopes: Scope[] = dstInfo.parameters["scope"]
            ?.split(/[, ]+/)
            .filter((sc: string): sc is Scope => (SCOPES as string[]).includes(sc))
            ?? [];
        actions.push(goToGrant(
            NodeName.expand(dstInfo.parameters["client_id"] ?? null) ?? "",
            dstInfo.parameters["client_secret"] ?? "",
            scopes,
            dstInfo.parameters["redirect_uri"] ?? null
        ));
    }
    return actions;
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    return info.sub("grant").noIndex().withTitle(i18n.t("grant-access"));
}
