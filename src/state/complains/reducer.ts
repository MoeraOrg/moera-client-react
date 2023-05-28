import cloneDeep from 'lodash.clonedeep';
import * as immutable from 'object-path-immutable';

import { SheriffComplainGroupInfo, SheriffComplainInfo } from "api/node/api-types";
import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";
import { INIT_FROM_LOCATION } from "state/navigation/actions";
import {
    COMPLAINS_COMPLAINS_LOAD,
    COMPLAINS_COMPLAINS_LOAD_FAILED,
    COMPLAINS_COMPLAINS_LOADED,
    COMPLAINS_DECISION_POST,
    COMPLAINS_DECISION_POST_FAILED,
    COMPLAINS_DECISION_POSTED,
    COMPLAINS_FUTURE_SLICE_LOAD,
    COMPLAINS_FUTURE_SLICE_LOAD_FAILED,
    COMPLAINS_FUTURE_SLICE_SET,
    COMPLAINS_GROUP_CLOSE,
    COMPLAINS_GROUP_LOAD,
    COMPLAINS_GROUP_LOAD_FAILED,
    COMPLAINS_GROUP_LOADED,
    COMPLAINS_GROUP_OPEN,
    COMPLAINS_PAST_SLICE_LOAD,
    COMPLAINS_PAST_SLICE_LOAD_FAILED,
    COMPLAINS_PAST_SLICE_SET
} from "state/complains/actions";
import { ComplainsState, ExtComplainGroupInfo, ExtComplainInfo } from "state/complains/state";
import { htmlEntities, replaceEmojis } from "util/html";

const initialState: ComplainsState = {
    loadingFuture: false,
    loadingPast: false,
    before: Number.MAX_SAFE_INTEGER,
    after: Number.MAX_SAFE_INTEGER,
    complainGroups: {},
    complainGroupList: [],
    total: 0,
    totalInFuture: 0,
    totalInPast: 0,
    activeComplainGroupId: null,
    loadingActive: false,
    complains: [],
    loadingComplains: false,
    submitting: false
};

const emptyActiveComplain = {
    loadingActive: false,
    complains: [],
    loadingComplains: false,
    submitting: false
}

function isComplainGroupExtracted(group: SheriffComplainGroupInfo | ExtComplainGroupInfo): group is ExtComplainGroupInfo {
    return (group as ExtComplainGroupInfo).extracted != null;
}

function extractComplainGroup(group: SheriffComplainGroupInfo | ExtComplainGroupInfo): ExtComplainGroupInfo {
    if (isComplainGroupExtracted(group)) { // Already extracted
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

function isComplainExtracted(complain: SheriffComplainInfo | ExtComplainInfo): complain is ExtComplainInfo {
    return (complain as ExtComplainInfo).extracted != null;
}

function extractComplain(complain: SheriffComplainInfo | ExtComplainInfo): ExtComplainInfo {
    if (isComplainExtracted(complain)) { // Already extracted
        return complain;
    }
    const icomplain = immutable.wrap(complain as ExtComplainInfo);
    if (complain.reasonDetails) {
        icomplain.set("reasonDetailsHtml", replaceEmojis(htmlEntities(complain.reasonDetails)));
    }
    return icomplain
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
                action.payload.complainGroups.forEach(cg =>
                    istate.set(["complainGroups", cg.id], extractComplainGroup(cg))
                );
                const groups = state.complainGroupList
                    .map(id => ({id, moment: state.complainGroups[id]!.moment}));
                action.payload.complainGroups
                    .filter(cg => cg.moment <= state.after)
                    .forEach(cg => groups.push({id: cg.id, moment: cg.moment}));
                groups.sort((a, b) => a.moment - b.moment);
                istate.assign("", {
                    loadingPast: false,
                    after: action.payload.after,
                    complainGroupList: groups.map(g => g.id),
                    total: action.payload.total,
                    totalInPast: action.payload.totalInPast
                });
                action.payload.complainGroups.forEach(cg =>
                    istate.set(["complainGroups", cg.id], extractComplainGroup(cg))
                );
                return istate.value();
            } else {
                return istate.set("loadingPast", false).value();
            }
        }

        case COMPLAINS_FUTURE_SLICE_SET: {
            const istate = immutable.wrap(state);
            if (action.payload.before > state.before && action.payload.after <= state.before) {
                const groups = state.complainGroupList
                    .map(id => ({id, moment: state.complainGroups[id]!.moment}));
                action.payload.complainGroups
                    .filter(cg => cg.moment > state.before)
                    .forEach(cg => groups.push({id: cg.id, moment: cg.moment}));
                groups.sort((a, b) => a.moment - b.moment);
                istate.assign("", {
                    loadingFuture: false,
                    before: action.payload.before,
                    complainGroupList: groups.map(g => g.id),
                    total: action.payload.total,
                    totalInFuture: action.payload.totalInFuture
                });
                action.payload.complainGroups.forEach(cg =>
                    istate.set(["complainGroups", cg.id], extractComplainGroup(cg))
                );
                return istate.value();
            } else {
                return istate.set("loadingFuture", false).value();
            }
        }

        case COMPLAINS_GROUP_OPEN:
            return immutable.assign(state, "", {
                activeComplainGroupId: action.payload.id,
                ...emptyActiveComplain
            });

        case COMPLAINS_GROUP_CLOSE:
            return immutable.set(state, "activeComplainGroupId", null);

        case COMPLAINS_GROUP_LOAD:
            return immutable.set(state, "loadingActive", true);

        case COMPLAINS_GROUP_LOADED: {
            const {group} = action.payload;
            const istate = immutable.wrap(state);
            istate.set(["complainGroups", group.id], extractComplainGroup(group));
            if (group.id === state.activeComplainGroupId) {
                istate.set("loadingActive", false);
            }
            return istate.value();
        }

        case COMPLAINS_GROUP_LOAD_FAILED:
            if (action.payload.id === state.activeComplainGroupId) {
                return immutable.set(state, "loadingActive", false);
            }
            return state;

        case COMPLAINS_COMPLAINS_LOAD:
            return immutable.set(state, "loadingComplains", true);

        case COMPLAINS_COMPLAINS_LOADED:
            if (action.payload.groupId === state.activeComplainGroupId) {
                return immutable.assign(state, "", {
                    loadingComplains: false,
                    complains: action.payload.complains.map(c => extractComplain(c))
                });
            }
            return state;

        case COMPLAINS_COMPLAINS_LOAD_FAILED:
            if (action.payload.groupId === state.activeComplainGroupId) {
                return immutable.set(state, "loadingComplains", false);
            }
            return state;

        case COMPLAINS_DECISION_POST:
            if (action.payload.groupId === state.activeComplainGroupId) {
                return immutable.set(state, "submitting", true);
            }
            return state;

        case COMPLAINS_DECISION_POSTED: {
            const {group} = action.payload;
            const istate = immutable.wrap(state);
            istate.set(["complainGroups", group.id], extractComplainGroup(group));
            if (group.id === state.activeComplainGroupId) {
                istate.set("submitting", false);
            }
            istate.set("activeComplainGroupId", null);
            return istate.value();
        }

        case COMPLAINS_DECISION_POST_FAILED:
            if (action.payload.groupId === state.activeComplainGroupId) {
                return immutable.set(state, "submitting", false);
            }
            return state;

        default:
            return state;
    }
}
