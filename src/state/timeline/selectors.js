import moment from 'moment';

import { isPermitted } from "state/node/selectors";
import { isHomeOwnerNameSet } from "state/home/selectors";

const MAX_MOMENT = 25337597040000; // January 1, 9999

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
    return state.timeline.at < MAX_MOMENT ? Math.floor(state.timeline.at / 100): moment().unix()
}

export function isTimelineContainsMoment(state, moment) {
    return moment <= state.timeline.before && moment > state.timeline.after;
}
