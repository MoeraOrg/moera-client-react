import { AvatarImage } from "api";
import { ClientState } from "state/state";
import { ActionContext } from "state/action-types";
import { select } from "state/store-sagas";
import { getOwnerFullName, getOwnerName, getOwnerNameOrUrl } from "state/node/selectors";
import {
    getHomeOwnerAvatar,
    getHomeOwnerFullName,
    getHomeOwnerGender,
    getHomeOwnerName,
    getHomeOwnerNameOrUrl
} from "state/home/selectors";
import { getSetting } from "state/settings/selectors";

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

    get homeOwnerName(): string | null {
        return select(getHomeOwnerName);
    }

    get homeOwnerNameOrUrl(): string {
        return select(getHomeOwnerNameOrUrl);
    }

    get homeOwnerFullName(): string | null {
        return select(getHomeOwnerFullName);
    }

    get homeOwnerGender(): string | null {
        return select(getHomeOwnerGender);
    }

    get homeOwnerAvatar(): AvatarImage | null {
        return select(getHomeOwnerAvatar);
    }

    get searchName(): string {
        return select(state => getSetting(state, "search.node-name") as string);
    }

}

export default function getContext(state?: ClientState | null): ActionContext {
    if (state == null) {
        return {
            ownerName: null,
            ownerNameOrUrl: "",
            ownerFullName: null,
            homeOwnerName: null,
            homeOwnerNameOrUrl: "",
            homeOwnerFullName: null,
            homeOwnerGender: null,
            homeOwnerAvatar: null,
            searchName: ""
        };
    }

    return {
        ownerName: getOwnerName(state),
        ownerNameOrUrl: getOwnerNameOrUrl(state),
        ownerFullName: getOwnerFullName(state),
        homeOwnerName: getHomeOwnerName(state),
        homeOwnerNameOrUrl: getHomeOwnerNameOrUrl(state),
        homeOwnerFullName: getHomeOwnerFullName(state),
        homeOwnerGender: getHomeOwnerGender(state),
        homeOwnerAvatar: getHomeOwnerAvatar(state),
        searchName: getSetting(state, "search.node-name") as string
    }
}
