import { call, put } from 'typed-redux-saga';

import { executor } from "state/executor";
import { errorThrown } from "state/error/actions";
import { Node } from "api";
import {
    OPEN_SOURCE_DIALOG,
    OpenSourceDialogAction,
    sourceDialogLoaded,
    sourceDialogLoadFailed
} from "state/sourcedialog/actions";
import { CommentInfo, PostingInfo } from "api";

export default [
    executor(OPEN_SOURCE_DIALOG, "", openSourceDialogSaga)
];

function* openSourceDialogSaga(action: OpenSourceDialogAction) {
    const {nodeName, postingId, commentId} = action.payload;

    try {
        let entry: PostingInfo | CommentInfo;
        if (commentId == null) {
            entry = yield* call(Node.getPosting, nodeName, postingId, true);
        } else {
            entry = yield* call(Node.getComment, nodeName, postingId, commentId, true);
        }
        yield* put(sourceDialogLoaded(entry.bodySrc?.text ?? ""));
    } catch (e) {
        yield* put(sourceDialogLoadFailed());
        yield* put(errorThrown(e));
    }
}
