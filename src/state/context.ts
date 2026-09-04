import { AvatarImage } from "api";
import { ClientState } from "state/state";
import { ActionContext } from "state/action-types";
import { select } from "state/store-sagas";
import { getOwnerFullName, getOwnerName, getOwnerNameOrUrl, getOwnerSourceUri } from "state/node/selectors";
import {
    getHomeOwnerAvatar,
    getHomeOwnerFullName,
    getHomeOwnerGender,
    getHomeOwnerName,
    getHomeOwnerNameOrUrl,
    getHomeOwnerSourceUri
} from "state/home/selectors";
import { getSearchNodeName } from "state/search/selectors";

export class DynamicActionContext implements ActionContext {

    get ownerName(): string | null {
        return select(getOwnerName);
    }

    get ownerNameOrUrl(): string {
        return select(getOwnerNameOrUrl);
    }

    get ownerFullName(): string | null {
        return select(getOwnerFullName);
    }

    get ownerSourceUri(): string | null {
        return select(getOwnerSourceUri);
    }

    get homeOwnerName(): string | null {
        return select(getHomeOwnerName);
    }

    get homeOwnerNameOrUrl(): string {
        return select(getHomeOwnerNameOrUrl);
    }

    get homeOwnerFullName(): string | null {
        return select(getHomeOwnerFullName);
    }

    get homeOwnerSourceUri(): string | null {
        return select(getHomeOwnerSourceUri);
    }

    get homeOwnerGender(): string | null {
        return select(getHomeOwnerGender);
    }

    get homeOwnerAvatar(): AvatarImage | null {
        return select(getHomeOwnerAvatar);
    }

    get searchName(): string {
        return select(getSearchNodeName);
    }

}

export default function getContext(state?: ClientState | null): ActionContext {
    if (state == null) {
        return {
            ownerName: null,
            ownerNameOrUrl: "",
            ownerFullName: null,
            ownerSourceUri: null,
            homeOwnerName: null,
            homeOwnerNameOrUrl: "",
            homeOwnerFullName: null,
            homeOwnerSourceUri: null,
            homeOwnerGender: null,
            homeOwnerAvatar: null,
            searchName: ""
        };
    }

    return {
        ownerName: getOwnerName(state),
        ownerNameOrUrl: getOwnerNameOrUrl(state),
        ownerFullName: getOwnerFullName(state),
        ownerSourceUri: getOwnerSourceUri(state),
        homeOwnerName: getHomeOwnerName(state),
        homeOwnerNameOrUrl: getHomeOwnerNameOrUrl(state),
        homeOwnerFullName: getHomeOwnerFullName(state),
        homeOwnerSourceUri: getHomeOwnerSourceUri(state),
        homeOwnerGender: getHomeOwnerGender(state),
        homeOwnerAvatar: getHomeOwnerAvatar(state),
        searchName: getSearchNodeName(state)
    }
}
