import { getOwnerFullName, getOwnerName, getOwnerNameOrUrl } from "state/owner/selectors";
import {
    getHomeOwnerAvatar,
    getHomeOwnerFullName,
    getHomeOwnerName,
    getHomeOwnerNameOrUrl
} from "state/home/selectors";
import { ClientState } from "state/state";
import { ActionContext } from "state/action-types";

export default function getContext(state?: ClientState | null): ActionContext {
    if (state == null) {
        return {
            ownerName: null,
            ownerNameOrUrl: "",
            ownerFullName: null,
            homeOwnerName: null,
            homeOwnerNameOrUrl: "",
            homeOwnerFullName: null,
            homeOwnerAvatar: null
        };
    }

    return {
        ownerName: getOwnerName(state),
        ownerNameOrUrl: getOwnerNameOrUrl(state),
        ownerFullName: getOwnerFullName(state),
        homeOwnerName: getHomeOwnerName(state),
        homeOwnerNameOrUrl: getHomeOwnerNameOrUrl(state),
        homeOwnerFullName: getHomeOwnerFullName(state),
        homeOwnerAvatar: getHomeOwnerAvatar(state)
    }
}
