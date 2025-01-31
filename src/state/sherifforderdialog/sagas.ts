import i18n from 'i18next';

import { executor } from "state/executor";
import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { Node } from "api";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
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

async function sheriffOrderDialogSubmitSaga(action: WithContext<SheriffOrderDialogSubmitAction>): Promise<void> {
    const {
        target: {
            nodeName, fullName, feedName, postingOwnerName, postingOwnerFullName, postingOwnerGender, postingHeading,
            postingId, commentOwnerName, commentOwnerFullName, commentOwnerGender, commentHeading, commentId
        },
        reasonCode, reasonDetails, anonymous
    } = action.payload;

    const {isSheriff, homeOwnerFullName, homeOwnerGender} = select(state => ({
        isSheriff: getHomeOwnerName(state) === SHERIFF_GOOGLE_PLAY_TIMELINE,
        homeOwnerFullName: getHomeOwnerFullName(state),
        homeOwnerGender: getHomeOwnerGender(state)
    }));

    try {
        if (isSheriff) {
            await Node.createRemoteSheriffOrder(action, REL_HOME, nodeName, {
                delete: false, feedName, postingId, commentId, category: "visibility" as const, reasonCode,
                reasonDetails
            });
        } else {
            await Node.createSheriffComplaint(action, SHERIFF_GOOGLE_PLAY_TIMELINE, {
                ownerFullName: homeOwnerFullName, ownerGender: homeOwnerGender, nodeName, fullName, feedName,
                postingOwnerName, postingOwnerFullName, postingOwnerGender, postingHeading, postingId,
                commentOwnerName, commentOwnerFullName, commentOwnerGender, commentHeading, commentId, reasonCode,
                reasonDetails, anonymous
            });
        }
        dispatch(sheriffOrderDialogSubmitted().causedBy(action));
        dispatch(flashBox(isSheriff ? i18n.t("sheriff-order-sent") : i18n.t("report-sheriff-sent")).causedBy(action));
    } catch (e) {
        dispatch(sheriffOrderDialogSubmitFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function sheriffOrderDeleteSaga(action: WithContext<SheriffOrderDeleteAction>): Promise<void> {
    const {nodeName, feedName, postingId, commentId} = action.payload.target;

    try {
        await Node.createRemoteSheriffOrder(action, REL_HOME, nodeName, {
            delete: true, feedName, postingId, commentId, category: "visibility" as const
        });
        dispatch(flashBox(i18n.t("sheriff-order-sent")).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}
