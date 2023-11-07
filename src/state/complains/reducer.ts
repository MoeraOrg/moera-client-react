import cloneDeep from 'lodash.clonedeep';
import * as immutable from 'object-path-immutable';

import { SheriffComplainGroupInfo, SheriffComplainInfo } from "api";
import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";
import { ComplainsState, ExtComplainGroupInfo, ExtComplainInfo } from "state/complains/state";
import { htmlEntities, replaceEmojis } from "util/html";

const initialState: ComplainsState = {
    loadingFuture: false,
    loadingPast: false,
    before: Number.MAX_SAFE_INTEGER,
    after: Number.MAX_SAFE_INTEGER,
    complainGroups: {},
    complainGroupList: [],
    inboxOnly: false,
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
        case "INIT_FROM_LOCATION":
            return cloneDeep(initialState);

        case "COMPLAINS_PAST_SLICE_LOAD":
            return immutable.set(state, "loadingPast", true);

        case "COMPLAINS_PAST_SLICE_LOAD_FAILED":
            return immutable.set(state, "loadingPast", false);

        case "COMPLAINS_FUTURE_SLICE_LOAD":
            return immutable.set(state, "loadingFuture", true);

        case "COMPLAINS_FUTURE_SLICE_LOAD_FAILED":
            return immutable.set(state, "loadingFuture", false);

        case "COMPLAINS_PAST_SLICE_SET": {
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
                groups.sort((a, b) => b.moment - a.moment);
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

        case "COMPLAINS_FUTURE_SLICE_SET": {
            const istate = immutable.wrap(state);
            if (action.payload.before > state.before && action.payload.after <= state.before) {
                const groups = state.complainGroupList
                    .map(id => ({id, moment: state.complainGroups[id]!.moment}));
                action.payload.complainGroups
                    .filter(cg => cg.moment > state.before)
                    .forEach(cg => groups.push({id: cg.id, moment: cg.moment}));
                groups.sort((a, b) => b.moment - a.moment);
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

        case "COMPLAINS_INBOX_SET":
            return immutable.assign(state, "", {
                loadingFuture: false,
                loadingPast: false,
                before: Number.MAX_SAFE_INTEGER,
                after: Number.MAX_SAFE_INTEGER,
                complainGroupList: [],
                total: 0,
                totalInFuture: 0,
                totalInPast: 0,
                inboxOnly: action.payload.inboxOnly
            });

        case "COMPLAINS_GROUP_OPEN":
            return immutable.assign(state, "", {
                activeComplainGroupId: action.payload.id,
                ...emptyActiveComplain
            });

        case "COMPLAINS_GROUP_CLOSE":
            return immutable.set(state, "activeComplainGroupId", null);

        case "COMPLAINS_GROUP_LOAD":
            return immutable.set(state, "loadingActive", true);

        case "COMPLAINS_GROUP_LOADED": {
            const {group} = action.payload;
            const istate = immutable.wrap(state);
            istate.set(["complainGroups", group.id], extractComplainGroup(group));
            if (group.id === state.activeComplainGroupId) {
                istate.set("loadingActive", false);
            }
            return istate.value();
        }

        case "COMPLAINS_GROUP_LOAD_FAILED":
            if (action.payload.id === state.activeComplainGroupId) {
                return immutable.set(state, "loadingActive", false);
            }
            return state;

        case "COMPLAINS_COMPLAINS_LOAD":
            return immutable.set(state, "loadingComplains", true);

        case "COMPLAINS_COMPLAINS_LOADED":
            if (action.payload.groupId === state.activeComplainGroupId) {
                return immutable.assign(state, "", {
                    loadingComplains: false,
                    complains: action.payload.complains.map(c => extractComplain(c))
                });
            }
            return state;

        case "COMPLAINS_COMPLAINS_LOAD_FAILED":
            if (action.payload.groupId === state.activeComplainGroupId) {
                return immutable.set(state, "loadingComplains", false);
            }
            return state;

        case "COMPLAINS_DECISION_POST":
            if (action.payload.groupId === state.activeComplainGroupId) {
                return immutable.set(state, "submitting", true);
            }
            return state;

        case "COMPLAINS_DECISION_POSTED": {
            const {group} = action.payload;
            const istate = immutable.wrap(state);
            istate.set(["complainGroups", group.id], extractComplainGroup(group));
            if (group.id === state.activeComplainGroupId) {
                istate.set("submitting", false);
            }
            istate.set("activeComplainGroupId", null);
            return istate.value();
        }

        case "COMPLAINS_DECISION_POST_FAILED":
            if (action.payload.groupId === state.activeComplainGroupId) {
                return immutable.set(state, "submitting", false);
            }
            return state;

        case "EVENT_HOME_SHERIFF_COMPLAIN_GROUP_ADDED": {
            const {group} = action.payload;
            if (group.moment > state.before) {
                return immutable.update(state, "totalInFuture", t => t + 1);
            }
            if (group.moment <= state.after) {
                return immutable.update(state, "totalInPast", t => t + 1);
            }
            const istate = immutable.wrap(state);
            const groups = state.complainGroupList
                .filter(id => id !== group.id)
                .map(id => ({id, moment: state.complainGroups[id]!.moment}));
            groups.push({id: group.id, moment: group.moment});
            groups.sort((a, b) => b.moment - a.moment);
            istate.assign("", {
                complainGroupList: groups.map(g => g.id),
                total: state.total + (groups.length - state.complainGroupList.length)
            });
            if (!state.complainGroups.hasOwnProperty(group.id)) {
                istate.set(["complainGroups", group.id], extractComplainGroup(group))
            }
            return istate.value();
        }

        case "EVENT_HOME_SHERIFF_COMPLAIN_GROUP_UPDATED": {
            const {group} = action.payload;
            if (group.moment <= state.before && group.moment > state.after) {
                return immutable.set(state, ["complainGroups", group.id], extractComplainGroup(group));
            }
            return state;
        }

        case "EVENT_HOME_SHERIFF_COMPLAIN_ADDED": {
            const {complain, groupId} = action.payload;
            if (state.activeComplainGroupId !== groupId || state.loadingComplains) {
                return state;
            }
            const complains = state.complains.filter(c => c.id !== complain.id);
            complains.push(extractComplain(complain));
            complains.sort((a, b) => a.createdAt - b.createdAt);
            return immutable.set(state, "complains", complains);
        }

        default:
            return state;
    }
}
