import moment from 'moment';

import { isPermitted } from "state/node/selectors";
import { isHomeOwnerNameSet } from "state/home/selectors";

export function isTimelineGeneralToBeLoaded(state) {
    return !state.timeline.loadedGeneral && !state.timeline.loadingGeneral;
}

export function isTimelineGeneralReady(state) {
    return state.timeline.loadedGeneral && !state.timeline.loadingGeneral;
}

export function isTimelineAddable(state) {
    return isTimelineGeneralReady(state) && isPermitted("add", state.timeline, state)
        && isHomeOwnerNameSet(state);
}

export function getTimelineAt(state) {
    return state.timeline.at;
}

export function getTimelineAtTimestamp(state) {
    return state.timeline.at < Number.MAX_SAFE_INTEGER ? Math.floor(state.timeline.at / 100): moment().unix()
}

export function isTimelineContainsMoment(state, moment) {
    return moment <= state.timeline.before && moment > state.timeline.after;
}
