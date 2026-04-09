import { saga } from "state/saga";
import { Node, NodeApiError } from "api";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import {
    mediaDownloadFailed,
    mediaDownloadSucceeded,
    OpenMediaDownloadDialogAction
} from "state/mediadownloaddialog/actions";
import { isMediaDownloadDialogShown, isMediaDownloadPending } from "state/mediadownloaddialog/selectors";
import { dispatch, select } from "state/store-sagas";
import { REL_HOME } from "util/rel-node-name";
import { delay } from "util/misc";

export default [
    saga("OPEN_MEDIA_DOWNLOAD_DIALOG", payload => `${payload.nodeName}/${payload.mediaId}`, openMediaDownloadDialogSaga)
];

async function openMediaDownloadDialogSaga(action: WithContext<OpenMediaDownloadDialogAction>): Promise<void> {
    const {nodeName, mediaId} = action.payload;

    while (true) {
        try {
            const media = await Node.downloadRemoteMedia(
                action, REL_HOME, nodeName, mediaId,
                [
                    "media.digest-incorrect", "media.download-failed", "media.malware", "media.storage-error",
                    "media.download-pending"
                ]
            );
            dispatch(mediaDownloadSucceeded(nodeName, mediaId, media).causedBy(action));
            break;
        } catch (e) {
            const errorCode = e instanceof NodeApiError ? e.errorCode : "media.download-failed";
            dispatch(mediaDownloadFailed(nodeName, mediaId, errorCode).causedBy(action));
            if (!(e instanceof NodeApiError)) {
                dispatch(errorThrown(e));
            }
        }

        await delay(5000);

        if (!select(isMediaDownloadDialogShown) || !select(isMediaDownloadPending)) {
            // the dialog is closed or events have already updated the status
            break;
        }
    }
}
