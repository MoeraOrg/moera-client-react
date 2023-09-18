import { call, put } from 'typed-redux-saga';
import { CallEffect, PutEffect } from 'redux-saga/effects';
import * as Base64js from 'base64-js';
import imageCompression from 'browser-image-compression';
import i18n from 'i18next';

import { Node, PostingFeatures, PrivateMediaFileInfo } from "api";
import { messageBox } from "state/messagebox/actions";
import { errorThrown } from "state/error/actions";
import { readAsArrayBuffer } from "util/read-file";

export interface VerifiedMediaFile extends PrivateMediaFileInfo {
    digest?: string | null;
}

type ImageUploadProgressHandler = (loaded: number, total: number) => void;

const formatMb = (size: number): string =>
    (size / 1024 / 1024).toLocaleString("en-US", {maximumFractionDigits: 2}) + "Mb";

type ImageUploadResult<T> = Generator<CallEffect | PutEffect<any>, T>;

export function* imageUpload(features: PostingFeatures | null, nodeName: string | null, file: File, compress: boolean,
                             onProgress?: ImageUploadProgressHandler): ImageUploadResult<VerifiedMediaFile | null> {
    try {
        if (features != null) {
            if (compress) {
                if (file.size > features.imageRecommendedSize) {
                    file = yield* call(imageCompression, file, {
                        maxSizeMB: features.imageRecommendedSize / 1024 / 1024,
                        maxWidthOrHeight: features.imageRecommendedPixels,
                        preserveExif: true
                    });
                }
            } else {
                if (file.size > features.mediaMaxSize) {
                    yield* put(messageBox(i18n.t("upload-too-large", {
                        name: file.name,
                        size: formatMb(file.size),
                        maxSize: formatMb(features.mediaMaxSize)
                    })));
                    return null;
                }
            }
        }

        let digest: string | null = null;
        if (window.crypto.subtle) {
            const fileContent = yield* call(readAsArrayBuffer, file);
            digest = Base64js.fromByteArray(new Uint8Array(
                yield* call([window.crypto.subtle, window.crypto.subtle.digest], "SHA-256", fileContent)));
        }

        const mediaFile = yield* call(Node.uploadPrivateMedia, nodeName, file, onProgress);
        return {...mediaFile, digest};
    } catch (e) {
        yield* put(errorThrown(e));
        return null;
    }
}
