import { getOwnerName } from "state/owner/selectors";
import { getHomeOwnerName } from "state/home/selectors";

export default function getContext(state) {
    if (state == null) {
        return null;
    }

    return {
        ownerName: getOwnerName(state),
        homeOwnerName: getHomeOwnerName(state)
    }
}
