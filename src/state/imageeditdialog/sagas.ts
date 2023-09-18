import { call, put, select } from 'typed-redux-saga';

import { Node } from "api";
import { errorThrown } from "state/error/actions";
import {
    IMAGE_EDIT_DIALOG_LOAD,
    IMAGE_EDIT_DIALOG_POST,
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
    executor(IMAGE_EDIT_DIALOG_LOAD, "", imageEditDialogLoadSaga),
    executor(IMAGE_EDIT_DIALOG_POST, "", imageEditDialogPostSaga)
];

function* imageEditDialogLoadSaga() {
    const {id, nodeName} = yield* select((state: ClientState) => ({
        id: state.imageEditDialog.media?.postingId,
        nodeName: state.imageEditDialog.nodeName
    }));

    if (id == null) {
        yield* put(imageEditDialogLoaded());
        return;
    }

    try {
        const posting = yield* call(Node.getPosting, nodeName, id, true, ["posting.not-found"]);
        yield* call(fillActivityReaction, posting);
        yield* put(postingSet(posting));
        yield* put(imageEditDialogLoaded());
    } catch (e) {
        yield* put(imageEditDialogLoadFailed());
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
        yield* put(imageEditDialogPostFailed());
        return;
    }

    try {
        const posting = yield* call(Node.updatePosting, nodeName, id, postingText);
        yield* put(imageEditDialogPostSucceeded());
        yield* call(fillActivityReaction, posting);
        yield* put(postingSet(posting));

        const remoteNodeName = nodeName || action.context.ownerName;
        if (remoteNodeName != null && remoteNodeName !== postingText.ownerName) {
            const sourceText = {
                bodySrc: postingText.bodySrc,
                bodySrcFormat: postingText.bodySrcFormat,
                acceptedReactions: postingText.acceptedReactions
            }
            yield* call(Node.updateRemotePosting, ":", remoteNodeName, id, sourceText);
        }
    } catch (e) {
        yield* put(imageEditDialogPostFailed());
        yield* put(errorThrown(e));
    }
}
