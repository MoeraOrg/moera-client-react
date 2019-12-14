import moment from 'moment';

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
        && moment().isSameOrAfter(moment.unix(state.owner.deadline).subtract(30, "days"));
}

export function isOwnerNameExpired(state) {
    return state.owner.verified && state.owner.correct && state.owner.deadline != null
        && moment().isSameOrAfter(moment.unix(state.owner.deadline));
}
