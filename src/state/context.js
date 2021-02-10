import { getOwnerFullName, getOwnerName } from "state/owner/selectors";
import { getHomeOwnerFullName, getHomeOwnerName } from "state/home/selectors";

export default function getContext(state) {
    if (state == null) {
        return null;
    }

    return {
        ownerName: getOwnerName(state),
        ownerFullName: getOwnerFullName(state),
        homeOwnerName: getHomeOwnerName(state),
        homeOwnerFullName: getHomeOwnerFullName(state)
    }
}
