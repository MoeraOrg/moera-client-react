import { call, put } from 'typed-redux-saga';

import { executor } from "state/executor";
import { errorThrown } from "state/error/actions";
import { CommentInfo, Node, PostingInfo } from "api";
import { OpenSourceDialogAction, sourceDialogLoaded, sourceDialogLoadFailed } from "state/sourcedialog/actions";
import { WithContext } from "state/action-types";

export default [
    executor("OPEN_SOURCE_DIALOG", "", openSourceDialogSaga)
];

function* openSourceDialogSaga(action: WithContext<OpenSourceDialogAction>) {
    const {nodeName, postingId, commentId} = action.payload;

    try {
        let entry: PostingInfo | CommentInfo;
        if (commentId == null) {
            entry = yield* call(Node.getPosting, action, nodeName, postingId, true, ["posting.not-found"]);
        } else {
            entry = yield* call(Node.getComment, action, nodeName, postingId, commentId, true, ["comment.not-found"]);
        }
        yield* put(sourceDialogLoaded(entry.bodySrc?.text ?? "").causedBy(action));
    } catch (e) {
        yield* put(sourceDialogLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}
