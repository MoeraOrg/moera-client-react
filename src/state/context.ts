import { getOwnerFullName, getOwnerName } from "state/owner/selectors";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerName } from "state/home/selectors";
import { ClientState } from "state/state";
import { ActionContext } from "state/action-types";

export default function getContext(state: ClientState | null): ActionContext {
    if (state == null) {
        return {
            ownerName: null,
            ownerFullName: null,
            homeOwnerName: null,
            homeOwnerFullName: null,
            homeOwnerAvatar: null
        };
    }

    return {
        ownerName: getOwnerName(state),
        ownerFullName: getOwnerFullName(state),
        homeOwnerName: getHomeOwnerName(state),
        homeOwnerFullName: getHomeOwnerFullName(state),
        homeOwnerAvatar: getHomeOwnerAvatar(state)
    }
}
