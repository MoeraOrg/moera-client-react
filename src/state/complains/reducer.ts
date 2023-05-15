import cloneDeep from 'lodash.clonedeep';
import * as immutable from 'object-path-immutable';

import { SheriffComplainGroupInfo } from "api/node/api-types";
import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";
import { INIT_FROM_LOCATION } from "state/navigation/actions";
import {
    COMPLAINS_FUTURE_SLICE_LOAD,
    COMPLAINS_FUTURE_SLICE_LOAD_FAILED,
    COMPLAINS_FUTURE_SLICE_SET,
    COMPLAINS_PAST_SLICE_LOAD,
    COMPLAINS_PAST_SLICE_LOAD_FAILED,
    COMPLAINS_PAST_SLICE_SET
} from "state/complains/actions";
import { ComplainsState, ExtComplainGroupInfo } from "state/complains/state";
import { htmlEntities, replaceEmojis } from "util/html";

const initialState: ComplainsState = {
    loadingFuture: false,
    loadingPast: false,
    before: Number.MAX_SAFE_INTEGER,
    after: Number.MAX_SAFE_INTEGER,
    complainGroups: [],
    total: 0,
    totalInFuture: 0,
    totalInPast: 0
};

function isExtracted(group: SheriffComplainGroupInfo | ExtComplainGroupInfo): group is ExtComplainGroupInfo {
    return (group as ExtComplainGroupInfo).extracted != null;
}

function extractComplainGroup(group: SheriffComplainGroupInfo | ExtComplainGroupInfo): ExtComplainGroupInfo {
    if (isExtracted(group)) { // Already extracted
        return group;
    }
    const igroup = immutable.wrap(group as ExtComplainGroupInfo);
    if (group.remotePostingHeading) {
        igroup.set("remotePostingHeadingHtml", replaceEmojis(htmlEntities(group.remotePostingHeading)));
    }
    if (group.remoteCommentHeading) {
        igroup.set("remoteCommentHeadingHtml", replaceEmojis(htmlEntities(group.remoteCommentHeading)));
    }
    if (group.decisionDetails) {
        igroup.set("decisionDetailsHtml", replaceEmojis(htmlEntities(group.decisionDetails)));
    }
    return igroup
        .set("extracted", true)
        .value();
}

export default (state: ComplainsState = initialState, action: WithContext<ClientAction>): ComplainsState => {
    switch (action.type) {
        case INIT_FROM_LOCATION:
            return cloneDeep(initialState);

        case COMPLAINS_PAST_SLICE_LOAD:
            return immutable.set(state, "loadingPast", true);

        case COMPLAINS_PAST_SLICE_LOAD_FAILED:
            return immutable.set(state, "loadingPast", false);

        case COMPLAINS_FUTURE_SLICE_LOAD:
            return immutable.set(state, "loadingFuture", true);

        case COMPLAINS_FUTURE_SLICE_LOAD_FAILED:
            return immutable.set(state, "loadingFuture", false);

        case COMPLAINS_PAST_SLICE_SET: {
            const istate = immutable.wrap(state);
            if (action.payload.before >= state.after && action.payload.after < state.after) {
                const groups = state.complainGroups.slice();
                action.payload.complainGroups
                    .filter(c => c.moment <= state.after)
                    .forEach(c => groups.push(extractComplainGroup(c)));
                groups.sort((a, b) => a.moment - b.moment);
                return istate.assign("", {
                    loadingPast: false,
                    after: action.payload.after,
                    complainGroups: groups,
                    total: action.payload.total,
                    totalInPast: action.payload.totalInPast
                }).value();
            } else {
                return istate.set("loadingPast", false).value();
            }
        }

        case COMPLAINS_FUTURE_SLICE_SET: {
            const istate = immutable.wrap(state);
            if (action.payload.before > state.before && action.payload.after <= state.before) {
                const groups = state.complainGroups.slice();
                action.payload.complainGroups
                    .filter(c => c.moment > state.before)
                    .forEach(c => groups.push(extractComplainGroup(c)));
                groups.sort((a, b) => a.moment - b.moment);
                return istate.assign("", {
                    loadingFuture: false,
                    before: action.payload.before,
                    complainGroups: groups,
                    total: action.payload.total,
                    totalInFuture: action.payload.totalInFuture
                }).value();
            } else {
                return istate.set("loadingFuture", false).value();
            }
        }

        default:
            return state;
    }
}
