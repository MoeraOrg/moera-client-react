import { CommentInfo, Node, PostingInfo } from "api";
import { WithContext } from "state/action-types";
import { dispatch } from "state/store-sagas";
import { executor } from "state/executor";
import { errorThrown } from "state/error/actions";
import { OpenSourceDialogAction, sourceDialogLoaded, sourceDialogLoadFailed } from "state/sourcedialog/actions";

export default [
    executor("OPEN_SOURCE_DIALOG", "", openSourceDialogSaga)
];

async function openSourceDialogSaga(action: WithContext<OpenSourceDialogAction>): Promise<void> {
    const {nodeName, postingId, commentId} = action.payload;

    try {
        let entry: PostingInfo | CommentInfo;
        if (commentId == null) {
            entry = await Node.getPosting(action, nodeName, postingId, true, ["posting.not-found"]);
        } else {
            entry = await Node.getComment(action, nodeName, postingId, commentId, true, ["comment.not-found"]);
        }
        dispatch(sourceDialogLoaded(entry.bodySrc?.text ?? "").causedBy(action));
    } catch (e) {
        dispatch(sourceDialogLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}
