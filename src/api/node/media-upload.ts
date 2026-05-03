import * as Base64js from 'base64-js';
import imageCompression from 'browser-image-compression';
import i18n from 'i18next';

import { MediaAttachment, MediaCaption, Node, PostingFeatures, PostingText, PrivateMediaFileInfo } from "api";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { dispatch } from "state/store-sagas";
import { messageBox } from "state/messagebox/actions";
import { errorThrown } from "state/error/actions";
import { fillActivityReaction } from "state/activityreactions/sagas";
import { postingSet } from "state/postings/actions";
import { readAsArrayBuffer } from "util/read-file";
import { absoluteNodeName, REL_HOME, RelNodeName } from "util/rel-node-name";
import { formatMib } from "util/info-quantity";

export interface VerifiedMediaFile extends PrivateMediaFileInfo {
    digest?: string | null;
}

type MediaUploadProgressHandler = (loaded: number, total: number) => void;

export async function mediaUpload(
    caller: WithContext<ClientAction>, features: PostingFeatures | null, nodeName: RelNodeName | string,
    clientNodeName: string, file: File, compress: boolean, onProgress?: MediaUploadProgressHandler
): Promise<VerifiedMediaFile | null> {
    try {
        if (features != null) {
            if (compress) {
                if (file.size > features.imageRecommendedSize) {
                    file = await imageCompression(file, {
                        maxSizeMB: features.imageRecommendedSize / 1024 / 1024,
                        maxWidthOrHeight: features.imageRecommendedPixels,
                        preserveExif: true
                    });
                }
            } else {
                if (file.size > features.mediaMaxSize) {
                    dispatch(messageBox(i18n.t("upload-too-large", {
                        name: file.name,
                        size: formatMib(file.size),
                        maxSize: formatMib(features.mediaMaxSize)
                    })));
                    return null;
                }
            }
        }

        let digest: string | null = null;
        if (window.crypto.subtle) {
            const fileContent = await readAsArrayBuffer(file);
            digest = Base64js.fromByteArray(new Uint8Array(await window.crypto.subtle.digest("SHA-256", fileContent)));
        }

        const mediaFile = await Node.uploadPrivateMedia(caller, nodeName, clientNodeName, file, onProgress);
        return {...mediaFile, digest};
    } catch (e) {
        dispatch(errorThrown(e));
        return null;
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
