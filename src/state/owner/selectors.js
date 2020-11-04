import { fromUnixTime, isBefore, subDays } from 'date-fns';

import { isNodeNameOperationFinished } from "state/nodename/selectors";

export function getOwnerName(state) {
    return state.owner.name;
}

export function isOwnerNameSet(state) {
    return getOwnerName(state) != null;
}

export function isOwnerNameRecentlyChanged(state) {
    return isOwnerNameSet(state)
        && (state.owner.verifiedAt === 0
            || (isNodeNameOperationFinished(state)
                && state.owner.verifiedAt < state.nodeName.operationStatusUpdated));
}

export function isOwnerNameExpiring(state) {
    return state.owner.verified && state.owner.correct && state.owner.deadline != null
        && !isBefore(new Date(), subDays(fromUnixTime(state.home.owner.deadline), 30));
}

export function isOwnerNameExpired(state) {
    return state.owner.verified && state.owner.correct && state.owner.deadline != null
        && !isBefore(new Date(), fromUnixTime(state.home.owner.deadline));
}
