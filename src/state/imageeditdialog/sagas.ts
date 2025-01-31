import { Node } from "api";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import { executor } from "state/executor";
import {
    ImageEditDialogLoadAction,
    imageEditDialogLoaded,
    imageEditDialogLoadFailed,
    ImageEditDialogPostAction,
    imageEditDialogPostFailed,
    imageEditDialogPostSucceeded
} from "state/imageeditdialog/actions";
import { postingSet } from "state/postings/actions";
import { fillActivityReaction } from "state/activityreactions/sagas";
import { absoluteNodeName, REL_CURRENT, REL_HOME } from "util/rel-node-name";

export default [
    executor("IMAGE_EDIT_DIALOG_LOAD", "", imageEditDialogLoadSaga),
    executor("IMAGE_EDIT_DIALOG_POST", "", imageEditDialogPostSaga)
];

async function imageEditDialogLoadSaga(action: WithContext<ImageEditDialogLoadAction>): Promise<void> {
    const {id, nodeName} = select(state => ({
        id: state.imageEditDialog.media?.postingId,
        nodeName: state.imageEditDialog.nodeName
    }));

    if (id == null) {
        dispatch(imageEditDialogLoaded().causedBy(action));
        return;
    }

    try {
        const posting = await Node.getPosting(action, nodeName, id, true, ["posting.not-found"]);
        await fillActivityReaction(action, posting);
        dispatch(postingSet(posting, REL_CURRENT).causedBy(action));
        dispatch(imageEditDialogLoaded().causedBy(action));
    } catch (e) {
        dispatch(imageEditDialogLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function imageEditDialogPostSaga(action: WithContext<ImageEditDialogPostAction>): Promise<void> {
    const {postingText} = action.payload;

    const {id, nodeName} = select(state => ({
        id: state.imageEditDialog.media?.postingId,
        nodeName: state.imageEditDialog.nodeName
    }));

    if (id == null) {
        dispatch(imageEditDialogPostFailed().causedBy(action));
        return;
    }

    try {
        const posting = await Node.updatePosting(action, nodeName, id, postingText);
        dispatch(imageEditDialogPostSucceeded().causedBy(action));
        await fillActivityReaction(action, posting);
        dispatch(postingSet(posting, REL_CURRENT).causedBy(action));

        const remoteNodeName = absoluteNodeName(nodeName, action.context);
        if (remoteNodeName != null && remoteNodeName !== postingText.ownerName) {
            const sourceText = {
                bodySrc: postingText.bodySrc,
                bodySrcFormat: postingText.bodySrcFormat,
                acceptedReactions: postingText.acceptedReactions
            }
            await Node.updateRemotePosting(action, REL_HOME, remoteNodeName, id, sourceText);
        }
    } catch (e) {
        dispatch(imageEditDialogPostFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}
