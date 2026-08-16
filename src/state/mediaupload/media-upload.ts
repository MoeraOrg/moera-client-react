import i18n from 'i18next';

import { MediaAttachment, MediaCaption, Node, PostingText, PrivateMediaFileInfo } from "api";
import { AndroidMediaUploadError, AndroidMediaUploadHandler } from "api/android/media-upload";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { dispatch } from "state/store-sagas";
import { messageBox } from "state/messagebox/actions";
import { errorThrown } from "state/error/actions";
import { fillActivityReaction } from "state/activityreactions/sagas";
import { postingSet } from "state/postings/actions";
import { isAndroidMedia, MediaUploadSource } from "state/mediaupload/media-source";
import { absoluteNodeName, REL_HOME, RelNodeName } from "util/rel-node-name";
import { formatMib } from "util/info-quantity";

type MediaUploadProgressHandler = (loaded: number, total: number) => void;

const UPLOAD_STREAMS_COUNT = 4;

export async function mediaUpload(
    caller: WithContext<ClientAction>,
    mediaMaxSize: number,
    file: MediaUploadSource,
    compress: boolean,
    uploadChunkSize: number,
    androidUpload?: AndroidMediaUploadHandler,
    onProgress?: MediaUploadProgressHandler
): Promise<PrivateMediaFileInfo | null> {
    try {
        if (typeof file === "string") {
            onProgress && onProgress(0, 100);
            const media = await Node.uploadPrivateMedia(caller, REL_HOME, null, undefined, null, file, compress);
            onProgress && onProgress(100, 100);
            return media;
        } else {
            if (!compress && file.size > mediaMaxSize) {
                dispatch(messageBox(i18n.t("upload-too-large", {
                    name: file.name,
                    size: formatMib(file.size),
                    maxSize: formatMib(mediaMaxSize)
                })));
                return null;
            }

            if (isAndroidMedia(file)) {
                if (androidUpload == null) {
                    throw new AndroidMediaUploadError("unsupported", "Android media upload is not available");
                }
                return await androidUpload(file, compress, onProgress);
            }

            if (file.size <= uploadChunkSize) {
                return await Node.uploadPrivateMedia(caller, REL_HOME, file, onProgress, null, null, compress);
            } else {
                return await mediaUploadChunked(caller, file, compress, onProgress);
            }
        }
    } catch (e) {
        if (!(e instanceof AndroidMediaUploadError && e.code === "cancelled")) {
            dispatch(errorThrown(e));
        }
        return null;
    }
}

async function mediaUploadChunked(
    caller: WithContext<ClientAction>,
    file: File,
    compress: boolean,
    onProgress?: MediaUploadProgressHandler
): Promise<PrivateMediaFileInfo> {
    const mediaUpload = await Node.createMediaUpload(
        caller, REL_HOME, {mimeType: file.type, title: file.name, fileSize: file.size}
    );
    let streamLoaded = Array(UPLOAD_STREAMS_COUNT).fill(0);
    const onChunkProgress = (index: number) => (loaded: number) => {
        streamLoaded[index] = loaded;
        if (onProgress) {
            onProgress(streamLoaded.reduce((sum, v) => sum + v, 0), file.size);
        }
    };
    await Promise.all(
        streamLoaded.map((_, index) =>
            mediaUploadChunkedStream(
                caller,
                file,
                index,
                UPLOAD_STREAMS_COUNT,
                mediaUpload.chunkSize,
                mediaUpload.id,
                onChunkProgress(index)
            )
        )
    );
    return await Node.uploadPrivateMedia(caller, REL_HOME, undefined, undefined, mediaUpload.id, null, compress);
}

async function mediaUploadChunkedStream(
    caller: WithContext<ClientAction>,
    file: File,
    start: number,
    step: number,
    uploadChunkSize: number,
    uploadId: string,
    onProgress: (loaded: number) => void
): Promise<void> {
    let prevLoaded = 0;
    const onChunkProgress = (loaded: number) => {
        onProgress(prevLoaded + loaded);
    };
    for (let i = start; true; i += step) {
        const offset = i * uploadChunkSize;
        if (offset >= file.size) {
            break;
        }
        const chunkSize = Math.min(uploadChunkSize, file.size - offset);
        const chunk = file.slice(offset, offset + chunkSize);
        await Node.uploadMediaChunk(
            caller, REL_HOME, uploadId, i, new File([chunk], file.name, {type: file.type}), onChunkProgress
        );
        onChunkProgress(chunkSize);
        prevLoaded += chunkSize;
    }
}

async function updateMediaCaption(
    caller: WithContext<ClientAction>, nodeName: RelNodeName | string, postingId: string, caption: MediaCaption
): Promise<void> {
    const postingText: PostingText = {
        bodySrc: JSON.stringify(caption.captionSrc),
        bodySrcFormat: caption.captionSrcFormat,
    };

    const posting = await Node.updatePosting(caller, nodeName, postingId, postingText);
    await fillActivityReaction(caller, posting);
    dispatch(postingSet(posting, nodeName).causedBy(caller));

    const remoteNodeName = absoluteNodeName(nodeName, caller.context);
    if (remoteNodeName != null && remoteNodeName !== posting.ownerName) {
        const sourceText = {
            bodySrc: postingText.bodySrc,
            bodySrcFormat: postingText.bodySrcFormat,
        }
        await Node.updateRemotePosting(caller, REL_HOME, remoteNodeName, postingId, sourceText);
    }
}

export async function updateMediaCaptions(
    caller: WithContext<ClientAction>,
    nodeName: RelNodeName | string,
    attachments: MediaAttachment[] | null | undefined,
    captions: Record<string, MediaCaption>
): Promise<void> {
    if (attachments == null) {
        return;
    }

    await Promise.all(
        attachments
            .map(ma => [ma.postingId, ma.media?.id])
            .filter((r): r is [string, string] => r[0] != null && r[1] != null)
            .map(([postingId, mediaId]) => [postingId, captions[mediaId]])
            .filter((r): r is [string, MediaCaption] => r[1] != null)
            .map(async ([postingId, caption]) => await updateMediaCaption(caller, nodeName, postingId, caption))
    );
}
