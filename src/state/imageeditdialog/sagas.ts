import { call, put, select } from 'typed-redux-saga';

import { Node } from "api";
import { errorThrown } from "state/error/actions";
import {
    ImageEditDialogLoadAction,
    imageEditDialogLoaded,
    imageEditDialogLoadFailed,
    ImageEditDialogPostAction,
    imageEditDialogPostFailed,
    imageEditDialogPostSucceeded
} from "state/imageeditdialog/actions";
import { postingSet } from "state/postings/actions";
import { ClientState } from "state/state";
import { executor } from "state/executor";
import { fillActivityReaction } from "state/activityreactions/sagas";
import { WithContext } from "state/action-types";

export default [
    executor("IMAGE_EDIT_DIALOG_LOAD", "", imageEditDialogLoadSaga),
    executor("IMAGE_EDIT_DIALOG_POST", "", imageEditDialogPostSaga)
];

function* imageEditDialogLoadSaga(action: ImageEditDialogLoadAction) {
    const {id, nodeName} = yield* select((state: ClientState) => ({
        id: state.imageEditDialog.media?.postingId,
        nodeName: state.imageEditDialog.nodeName
    }));

    if (id == null) {
        yield* put(imageEditDialogLoaded().causedBy(action));
        return;
    }

    try {
        const posting = yield* call(Node.getPosting, action, nodeName, id, true, ["posting.not-found"]);
        yield* call(fillActivityReaction, action, posting);
        yield* put(postingSet(posting, "").causedBy(action));
        yield* put(imageEditDialogLoaded().causedBy(action));
    } catch (e) {
        yield* put(imageEditDialogLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* imageEditDialogPostSaga(action: WithContext<ImageEditDialogPostAction>) {
    const {postingText} = action.payload;

    const {id, nodeName} = yield* select((state: ClientState) => ({
        id: state.imageEditDialog.media?.postingId,
        nodeName: state.imageEditDialog.nodeName
    }));

    if (id == null) {
        yield* put(imageEditDialogPostFailed().causedBy(action));
        return;
    }

    try {
        const posting = yield* call(Node.updatePosting, action, nodeName, id, postingText);
        yield* put(imageEditDialogPostSucceeded().causedBy(action));
        yield* call(fillActivityReaction, action, posting);
        yield* put(postingSet(posting, "").causedBy(action));

        const remoteNodeName = nodeName || action.context.ownerName;
        if (remoteNodeName != null && remoteNodeName !== postingText.ownerName) {
            const sourceText = {
                bodySrc: postingText.bodySrc,
                bodySrcFormat: postingText.bodySrcFormat,
                acceptedReactions: postingText.acceptedReactions
            }
            yield* call(Node.updateRemotePosting, action, ":", remoteNodeName, id, sourceText);
        }
    } catch (e) {
        yield* put(imageEditDialogPostFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}
