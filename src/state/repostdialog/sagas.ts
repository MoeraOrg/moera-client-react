import i18n from 'i18next';

import { Node } from "api";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import { flashBox } from "state/flashbox/actions";
import { RepostPostingAction, repostPostingFailed, repostPostingSucceeded } from "state/repostdialog/actions";
import { saga } from "state/saga";
import { dispatch } from "state/store-sagas";
import { absoluteNodeName, REL_HOME } from "util/rel-node-name";

export default [
    saga("REPOST_POSTING", "", repostPostingSaga)
];

async function repostPostingSaga(action: WithContext<RepostPostingAction>): Promise<void> {
    const {nodeName, postingId, postingView} = action.payload;

    try {
        const remoteNodeName = absoluteNodeName(nodeName, action.context);
        const publications = [
            {feedName: "timeline", viewed: true, read: true},
            {feedName: "news", viewed: true, read: true}
        ];
        if (remoteNodeName === action.context.homeOwnerName) {
            await Node.republishPosting(action, REL_HOME, postingId, {postingView, publications});
        } else {
            await Node.republishRemotePosting(action, REL_HOME, remoteNodeName, postingId, {
                remoteFeedName: "timeline", postingView, publications
            });
        }
        dispatch(flashBox(i18n.t("you-shared-post")).causedBy(action));
        dispatch(repostPostingSucceeded().causedBy(action));
    } catch (e) {
        dispatch(repostPostingFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}
