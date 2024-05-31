import cloneDeep from 'lodash.clonedeep';
import * as immutable from 'object-path-immutable';

import { SheriffComplaintGroupInfo, SheriffComplaintInfo } from "api";
import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";
import { ComplaintsState, ExtComplaintGroupInfo, ExtComplaintInfo } from "state/complaints/state";
import { htmlEntities, replaceEmojis } from "util/html";

const initialState: ComplaintsState = {
    loadingFuture: false,
    loadingPast: false,
    before: Number.MAX_SAFE_INTEGER,
    after: Number.MAX_SAFE_INTEGER,
    complaintGroups: {},
    complaintGroupList: [],
    inboxOnly: false,
    total: 0,
    totalInFuture: 0,
    totalInPast: 0,
    activeComplaintGroupId: null,
    loadingActive: false,
    complaints: [],
    loadingComplaints: false,
    submitting: false
};

const emptyActiveComplaint = {
    loadingActive: false,
    complaints: [],
    loadingComplaints: false,
    submitting: false
}

function isComplaintGroupExtracted(
    group: SheriffComplaintGroupInfo | ExtComplaintGroupInfo
): group is ExtComplaintGroupInfo {
    return (group as ExtComplaintGroupInfo).extracted != null;
}

function extractComplaintGroup(group: SheriffComplaintGroupInfo | ExtComplaintGroupInfo): ExtComplaintGroupInfo {
    if (isComplaintGroupExtracted(group)) { // Already extracted
        return group;
    }
    const igroup = immutable.wrap(group as ExtComplaintGroupInfo);
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

function isComplaintExtracted(complaint: SheriffComplaintInfo | ExtComplaintInfo): complaint is ExtComplaintInfo {
    return (complaint as ExtComplaintInfo).extracted != null;
}

function extractComplaint(complaint: SheriffComplaintInfo | ExtComplaintInfo): ExtComplaintInfo {
    if (isComplaintExtracted(complaint)) { // Already extracted
        return complaint;
    }
    const icomplaint = immutable.wrap(complaint as ExtComplaintInfo);
    if (complaint.reasonDetails) {
        icomplaint.set("reasonDetailsHtml", replaceEmojis(htmlEntities(complaint.reasonDetails)));
    }
    return icomplaint
        .set("extracted", true)
        .value();
}

export default (state: ComplaintsState = initialState, action: WithContext<ClientAction>): ComplaintsState => {
    switch (action.type) {
        case "INIT_FROM_LOCATION":
            return cloneDeep(initialState);

        case "COMPLAINTS_PAST_SLICE_LOAD":
            return immutable.set(state, "loadingPast", true);

        case "COMPLAINTS_PAST_SLICE_LOAD_FAILED":
            return immutable.set(state, "loadingPast", false);

        case "COMPLAINTS_FUTURE_SLICE_LOAD":
            return immutable.set(state, "loadingFuture", true);

        case "COMPLAINTS_FUTURE_SLICE_LOAD_FAILED":
            return immutable.set(state, "loadingFuture", false);

        case "COMPLAINTS_PAST_SLICE_SET": {
            const istate = immutable.wrap(state);
            if (action.payload.before >= state.after && action.payload.after < state.after) {
                action.payload.complaintGroups.forEach(cg =>
                    istate.set(["complaintGroups", cg.id], extractComplaintGroup(cg))
                );
                const groups = state.complaintGroupList
                    .map(id => ({id, moment: state.complaintGroups[id]!.moment}));
                action.payload.complaintGroups
                    .filter(cg => cg.moment <= state.after)
                    .forEach(cg => groups.push({id: cg.id, moment: cg.moment}));
                groups.sort((a, b) => b.moment - a.moment);
                istate.assign("", {
                    loadingPast: false,
                    after: action.payload.after,
                    complaintGroupList: groups.map(g => g.id),
                    total: action.payload.total,
                    totalInPast: action.payload.totalInPast
                });
                action.payload.complaintGroups.forEach(cg =>
                    istate.set(["complaintGroups", cg.id], extractComplaintGroup(cg))
                );
                return istate.value();
            } else {
                return istate.set("loadingPast", false).value();
            }
        }

        case "COMPLAINTS_FUTURE_SLICE_SET": {
            const istate = immutable.wrap(state);
            if (action.payload.before > state.before && action.payload.after <= state.before) {
                const groups = state.complaintGroupList
                    .map(id => ({id, moment: state.complaintGroups[id]!.moment}));
                action.payload.complaintGroups
                    .filter(cg => cg.moment > state.before)
                    .forEach(cg => groups.push({id: cg.id, moment: cg.moment}));
                groups.sort((a, b) => b.moment - a.moment);
                istate.assign("", {
                    loadingFuture: false,
                    before: action.payload.before,
                    complaintGroupList: groups.map(g => g.id),
                    total: action.payload.total,
                    totalInFuture: action.payload.totalInFuture
                });
                action.payload.complaintGroups.forEach(cg =>
                    istate.set(["complaintGroups", cg.id], extractComplaintGroup(cg))
                );
                return istate.value();
            } else {
                return istate.set("loadingFuture", false).value();
            }
        }

        case "COMPLAINTS_INBOX_SET":
            return immutable.assign(state, "", {
                loadingFuture: false,
                loadingPast: false,
                before: Number.MAX_SAFE_INTEGER,
                after: Number.MAX_SAFE_INTEGER,
                complaintGroupList: [],
                total: 0,
                totalInFuture: 0,
                totalInPast: 0,
                inboxOnly: action.payload.inboxOnly
            });

        case "COMPLAINTS_GROUP_OPEN":
            return immutable.assign(state, "", {
                activeComplaintGroupId: action.payload.id,
                ...emptyActiveComplaint
            });

        case "COMPLAINTS_GROUP_CLOSE":
            return immutable.set(state, "activeComplaintGroupId", null);

        case "COMPLAINTS_GROUP_LOAD":
            return immutable.set(state, "loadingActive", true);

        case "COMPLAINTS_GROUP_LOADED": {
            const {group} = action.payload;
            const istate = immutable.wrap(state);
            istate.set(["complaintGroups", group.id], extractComplaintGroup(group));
            if (group.id === state.activeComplaintGroupId) {
                istate.set("loadingActive", false);
            }
            return istate.value();
        }

        case "COMPLAINTS_GROUP_LOAD_FAILED":
            if (action.payload.id === state.activeComplaintGroupId) {
                return immutable.set(state, "loadingActive", false);
            }
            return state;

        case "COMPLAINTS_COMPLAINTS_LOAD":
            return immutable.set(state, "loadingComplaints", true);

        case "COMPLAINTS_COMPLAINTS_LOADED":
            if (action.payload.groupId === state.activeComplaintGroupId) {
                return immutable.assign(state, "", {
                    loadingComplaints: false,
                    complaints: action.payload.complaints.map(c => extractComplaint(c))
                });
            }
            return state;

        case "COMPLAINTS_COMPLAINTS_LOAD_FAILED":
            if (action.payload.groupId === state.activeComplaintGroupId) {
                return immutable.set(state, "loadingComplaints", false);
            }
            return state;

        case "COMPLAINTS_DECISION_POST":
            if (action.payload.groupId === state.activeComplaintGroupId) {
                return immutable.set(state, "submitting", true);
            }
            return state;

        case "COMPLAINTS_DECISION_POSTED": {
            const {group} = action.payload;
            const istate = immutable.wrap(state);
            istate.set(["complaintGroups", group.id], extractComplaintGroup(group));
            if (group.id === state.activeComplaintGroupId) {
                istate.set("submitting", false);
            }
            istate.set("activeComplaintGroupId", null);
            return istate.value();
        }

        case "COMPLAINTS_DECISION_POST_FAILED":
            if (action.payload.groupId === state.activeComplaintGroupId) {
                return immutable.set(state, "submitting", false);
            }
            return state;

        case "EVENT_HOME_SHERIFF_COMPLAINT_GROUP_ADDED": {
            const {group} = action.payload;
            if (group.moment > state.before) {
                return immutable.update(state, "totalInFuture", t => t + 1);
            }
            if (group.moment <= state.after) {
                return immutable.update(state, "totalInPast", t => t + 1);
            }
            const istate = immutable.wrap(state);
            const groups = state.complaintGroupList
                .filter(id => id !== group.id)
                .map(id => ({id, moment: state.complaintGroups[id]!.moment}));
            groups.push({id: group.id, moment: group.moment});
            groups.sort((a, b) => b.moment - a.moment);
            istate.assign("", {
                complaintGroupList: groups.map(g => g.id),
                total: state.total + (groups.length - state.complaintGroupList.length)
            });
            if (!state.complaintGroups.hasOwnProperty(group.id)) {
                istate.set(["complaintGroups", group.id], extractComplaintGroup(group))
            }
            return istate.value();
        }

        case "EVENT_HOME_SHERIFF_COMPLAINT_GROUP_UPDATED": {
            const {group} = action.payload;
            if (group.moment <= state.before && group.moment > state.after) {
                return immutable.set(state, ["complaintGroups", group.id], extractComplaintGroup(group));
            }
            return state;
        }

        case "EVENT_HOME_SHERIFF_COMPLAINT_ADDED": {
            const {complaint, groupId} = action.payload;
            if (state.activeComplaintGroupId !== groupId || state.loadingComplaints) {
                return state;
            }
            const complaints = state.complaints.filter(c => c.id !== complaint.id);
            complaints.push(extractComplaint(complaint));
            complaints.sort((a, b) => a.createdAt - b.createdAt);
            return immutable.set(state, "complaints", complaints);
        }

        default:
            return state;
    }
}
