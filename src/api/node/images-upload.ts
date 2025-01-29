import * as Base64js from 'base64-js';
import imageCompression from 'browser-image-compression';
import i18n from 'i18next';

import { Node, PostingFeatures, PrivateMediaFileInfo } from "api";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { dispatch } from "state/store-sagas";
import { messageBox } from "state/messagebox/actions";
import { errorThrown } from "state/error/actions";
import { readAsArrayBuffer } from "util/read-file";
import { RelNodeName } from "util/rel-node-name";
import { formatMib } from "util/info-quantity";

export interface VerifiedMediaFile extends PrivateMediaFileInfo {
    digest?: string | null;
}

type ImageUploadProgressHandler = (loaded: number, total: number) => void;

export async function imageUpload(
    caller: WithContext<ClientAction>, features: PostingFeatures | null, nodeName: RelNodeName | string,
    clientNodeName: string, file: File, compress: boolean, onProgress?: ImageUploadProgressHandler
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
