import { Node } from "api";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import { saga } from "state/saga";
import {
    ImageEditDialogLoadAction,
    imageEditDialogLoaded,
    imageEditDialogLoadFailed
} from "state/imageeditdialog/actions";
import { postingSet } from "state/postings/actions";
import { fillActivityReaction } from "state/activityreactions/sagas";
import { REL_CURRENT } from "util/rel-node-name";

export default [
    saga("IMAGE_EDIT_DIALOG_LOAD", "", imageEditDialogLoadSaga),
];

async function imageEditDialogLoadSaga(action: WithContext<ImageEditDialogLoadAction>): Promise<void> {
    const {media, nodeName} = select(state => ({
        media: state.imageEditDialog.media,
        nodeName: state.imageEditDialog.nodeName
    }));

    if (media?.captionPostingId == null || media.caption != null) {
        dispatch(imageEditDialogLoaded().causedBy(action));
        return;
    }

    try {
        const posting = await Node.getPosting(action, nodeName, media.captionPostingId, true, ["posting.not-found"]);
        await fillActivityReaction(action, posting);
        dispatch(postingSet(posting, REL_CURRENT).causedBy(action));
        dispatch(imageEditDialogLoaded().causedBy(action));
    } catch (e) {
        dispatch(imageEditDialogLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}
