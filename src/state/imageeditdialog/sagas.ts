import { call, put, select } from 'typed-redux-saga/macro';

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
        const data = yield* call(Node.getPosting, nodeName, id, true);
        yield* call(fillActivityReaction, data);
        yield* put(postingSet(data));
        yield* put(imageEditDialogLoaded());
    } catch (e) {
        yield* put(imageEditDialogLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* imageEditDialogPostSaga(action: ImageEditDialogPostAction) {
    const {id, nodeName} = yield* select((state: ClientState) => ({
        id: state.imageEditDialog.media?.postingId,
        nodeName: state.imageEditDialog.nodeName
    }));

    if (id == null) {
        yield* put(imageEditDialogPostFailed());
        return;
    }

    try {
        const data = yield* call(Node.putPosting, nodeName, id, action.payload.postingText);
        yield* put(imageEditDialogPostSucceeded());
        yield* call(fillActivityReaction, data);
        yield* put(postingSet(data));
    } catch (e) {
        yield* put(imageEditDialogPostFailed());
        yield* put(errorThrown(e));
    }
}
