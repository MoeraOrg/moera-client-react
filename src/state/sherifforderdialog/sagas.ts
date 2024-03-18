import { call, put, select } from 'typed-redux-saga';
import i18n from 'i18next';

import { executor } from "state/executor";
import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { Node } from "api";
import { ClientState } from "state/state";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import { flashBox } from "state/flashbox/actions";
import { getHomeOwnerFullName, getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import {
    SheriffOrderDeleteAction,
    SheriffOrderDialogSubmitAction,
    sheriffOrderDialogSubmitFailed,
    sheriffOrderDialogSubmitted
} from "state/sherifforderdialog/actions";
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("SHERIFF_ORDER_DIALOG_SUBMIT", "", sheriffOrderDialogSubmitSaga),
    executor("SHERIFF_ORDER_DELETE", "", sheriffOrderDeleteSaga)
];

function* sheriffOrderDialogSubmitSaga(action: WithContext<SheriffOrderDialogSubmitAction>) {
    const {
        target: {
            nodeName, fullName, feedName, postingOwnerName, postingOwnerFullName, postingOwnerGender, postingHeading,
            postingId, commentOwnerName, commentOwnerFullName, commentOwnerGender, commentHeading, commentId
        },
        reasonCode, reasonDetails, anonymous
    } = action.payload;

    const {isSheriff, homeOwnerFullName, homeOwnerGender} = yield* select((state: ClientState) => ({
        isSheriff: getHomeOwnerName(state) === SHERIFF_GOOGLE_PLAY_TIMELINE,
        homeOwnerFullName: getHomeOwnerFullName(state),
        homeOwnerGender: getHomeOwnerGender(state)
    }));

    try {
        if (isSheriff) {
            yield* call(Node.createRemoteSheriffOrder, action, REL_HOME, nodeName, {
                delete: false, feedName, postingId, commentId, category: "visibility" as const, reasonCode,
                reasonDetails
            });
        } else {
            yield* call(Node.createSheriffComplaint, action, SHERIFF_GOOGLE_PLAY_TIMELINE, {
                ownerFullName: homeOwnerFullName, ownerGender: homeOwnerGender, nodeName, fullName, feedName,
                postingOwnerName, postingOwnerFullName, postingOwnerGender, postingHeading, postingId,
                commentOwnerName, commentOwnerFullName, commentOwnerGender, commentHeading, commentId, reasonCode,
                reasonDetails, anonymous
            });
        }
        yield* put(sheriffOrderDialogSubmitted().causedBy(action));
        yield* put(flashBox(isSheriff ? i18n.t("sheriff-order-sent") : i18n.t("report-sheriff-sent")).causedBy(action));
    } catch (e) {
        yield* put(sheriffOrderDialogSubmitFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* sheriffOrderDeleteSaga(action: WithContext<SheriffOrderDeleteAction>) {
    const {nodeName, feedName, postingId, commentId} = action.payload.target;

    try {
        yield* call(Node.createRemoteSheriffOrder, action, REL_HOME, nodeName, {
            delete: true, feedName, postingId, commentId, category: "visibility" as const
        });
        yield* put(flashBox(i18n.t("sheriff-order-sent")).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}
