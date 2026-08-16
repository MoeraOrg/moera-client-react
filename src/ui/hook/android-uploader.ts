import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Base64js from 'base64-js';

import { PrivateMediaFileInfo } from "api";
import { formatSchemaErrors } from "api/error";
import {
    AndroidMedia,
    AndroidMediaUploadError,
    AndroidMediaUploadHandler,
    AndroidMediaUploadProgressHandler
} from "api/android/media-upload";
import { androidSelectionToMedia, androidStateToMedia, LocalMediaUploadSource } from "state/mediaupload/media-source";
import type {
    AndroidMediaUploadErrorInfo,
    AndroidMediaUploadState,
    AndroidMessage,
    AndroidMessageMediaUploadCompleted,
    AndroidMessageMediaUploadFailed,
    AndroidMessageMediaUploadState
} from "api/android/types";
import { validateSchema } from "api/node/safe";
import { useAndroidMessages, useAndroidUploadRecovery } from "ui/hook";
import * as Browser from "ui/browser";

interface PendingUpload {
    promise: Promise<PrivateMediaFileInfo>;
    resolve: (media: PrivateMediaFileInfo) => void;
    reject: (error: AndroidMediaUploadError) => void;
    onProgress?: AndroidMediaUploadProgressHandler;
}

interface StoredUploadState {
    draftId: string | null;
    state: AndroidMediaUploadState;
    loaded: number;
    total: number;
    media?: PrivateMediaFileInfo;
    error?: AndroidMediaUploadErrorInfo;
}

export interface AndroidUploaderHandle {
    readonly enabled: boolean;
    expectSelection(): () => void;
    upload: AndroidMediaUploadHandler;
    cancel(id: string): void;
    discard(id: string): void;
}

interface AndroidUploaderProps {
    draftId: string | null;
    draftReady: boolean;
    draftMediaIds: readonly string[];
    onSelectedMedia: (files: LocalMediaUploadSource[]) => void;
    onRestoreMedia: (files: AndroidMedia[]) => void;
}

export function useAndroidUploader({
    draftId,
    draftReady,
    draftMediaIds,
    onSelectedMedia,
    onRestoreMedia
}: AndroidUploaderProps): AndroidUploaderHandle {
    const [enabled, setEnabled] = useState(false);

    const lifecycleGenerationRef = useRef(0);
    const selectionExpectedRef = useRef(false);
    const [sources] = useState(() => new Map<string, AndroidMedia>());
    const [states] = useState(() => new Map<string, StoredUploadState>());
    const [pendingUploads] = useState(() => new Map<string, PendingUpload>());

    useEffect(() => {
        const generation = ++lifecycleGenerationRef.current;
        if (window.Android == null || window.Android.getApiVersion() < 3) {
            return;
        }
        try {
            window.Android.setWebClientCapabilities(JSON.stringify({
                nativeMediaUpload: 1,
                clientId: Browser.clientId
            }));
            setEnabled(true);
        } catch {
            setEnabled(false);
        }
        return () => {
            lifecycleGenerationRef.current = generation + 1;
            for (const pending of pendingUploads.values()) {
                pending.reject(new AndroidMediaUploadError(
                    "cancelled",
                    "Android media upload was detached from its editor"
                ));
            }
            pendingUploads.clear();
            sources.clear();
            states.clear();
        };
    }, [pendingUploads, sources, states]);

    const removeCore = useCallback((id: string) => {
        sources.delete(id);
        states.delete(id);
        pendingUploads.delete(id);
    }, [pendingUploads, sources, states]);

    const recovery = useAndroidUploadRecovery({
        enabled,
        draftReady,
        draftId,
        draftMediaIds,
        onRestoreMedia,
        onAcknowledge: removeCore
    });

    const remove = useCallback((id: string) => {
        removeCore(id);
        recovery.forget(id);
    }, [recovery, removeCore]);

    const storeCompleted = useCallback(async (state: AndroidMessageMediaUploadState) => {
        const generation = lifecycleGenerationRef.current;
        try {
            const media = await validatePrivateMedia(state.media);
            if (generation !== lifecycleGenerationRef.current) {
                return;
            }
            const completed = {...state, media};
            states.set(state.id, toStoredUploadState(completed));
            const pending = pendingUploads.get(state.id);
            recovery.observe(completed, pending == null);
            if (pending != null) {
                pendingUploads.delete(state.id);
                pending.onProgress?.(completed.total, completed.total);
                pending.resolve(media);
            }
        } catch (e) {
            const error = e instanceof AndroidMediaUploadError
                ? e
                : new AndroidMediaUploadError("invalid-response", "Invalid Android upload result");
            const pending = pendingUploads.get(state.id);
            pendingUploads.delete(state.id);
            pending?.reject(error);
        }
    }, [pendingUploads, recovery, states]);

    const handleCompleted = useCallback((message: AndroidMessageMediaUploadCompleted) => {
        const source = sources.get(message.id);
        const previous = states.get(message.id);
        const total = previous?.total ?? source?.size ?? message.media.size;
        void storeCompleted({
            source: "moera-android",
            action: "media-upload-state",
            id: message.id,
            draftId: message.draftId,
            state: "COMPLETED",
            name: source?.name ?? message.media.title ?? "",
            mimeType: source?.type ?? message.media.mimeType,
            thumbnail: source?.thumbnail ?? null,
            loaded: total,
            total,
            media: message.media
        });
    }, [sources, states, storeCompleted]);

    const handleFailed = useCallback((message: AndroidMessageMediaUploadFailed) => {
        const pending = pendingUploads.get(message.id);
        pendingUploads.delete(message.id);
        pending?.reject(toError(message.error));

        const previous = states.get(message.id);
        const source = sources.get(message.id);
        if (pending == null && (previous != null || source != null)) {
            const state: AndroidMessageMediaUploadState = {
                source: "moera-android",
                action: "media-upload-state",
                id: message.id,
                draftId: message.draftId,
                state: "FAILED",
                name: source?.name ?? "",
                mimeType: source?.type ?? "application/octet-stream",
                thumbnail: source?.thumbnail ?? null,
                loaded: previous?.loaded ?? 0,
                total: previous?.total ?? source?.size ?? 0,
                error: message.error
            };
            states.set(message.id, toStoredUploadState(state));
            recovery.observe(state, true);
        }
    }, [pendingUploads, recovery, sources, states]);

    const accepts = useCallback((id: string, messageDraftId: string | null): boolean => {
        return pendingUploads.has(id) || messageDraftId === draftId;
    }, [draftId, pendingUploads]);

    const onAndroidMessage = useCallback((message: AndroidMessage) => {
        if (message.action === "content-selected") {
            if (enabled || !selectionExpectedRef.current || message.uris == null) {
                return;
            }
            selectionExpectedRef.current = false;
            if (window.Android == null) {
                return;
            }
            const files = message.uris.map(uri => {
                const mimeType = window.Android?.getContentUriMimeType(uri) ?? "application/octet-stream";
                const content = Uint8Array.from(Base64js.toByteArray(window.Android?.readContentUri(uri) ?? ""));
                return new File(
                    [content],
                    window.Android?.getContentUriFileName(uri) ?? "moera-upload.bin",
                    {type: mimeType}
                );
            });
            onSelectedMedia(files);
            return;
        }

        if (!enabled) {
            return;
        }

        if (message.action === "media-selected") {
            if (!selectionExpectedRef.current) {
                return;
            }
            selectionExpectedRef.current = false;
            const items = message.items.map(androidSelectionToMedia);
            items.forEach(item => sources.set(item.id, item));
            onSelectedMedia(items);
            return;
        }

        if (
            message.action !== "media-upload-progress"
            && message.action !== "media-upload-completed"
            && message.action !== "media-upload-failed"
            && message.action !== "media-upload-state"
        ) {
            return;
        }

        if (!accepts(message.id, message.draftId)) {
            return;
        }

        switch (message.action) {
            case "media-upload-progress": {
                pendingUploads.get(message.id)?.onProgress?.(message.loaded, message.total);
                const state = states.get(message.id);
                if (state != null && state.state !== "COMPLETED" && state.state !== "FAILED") {
                    states.set(message.id, {
                        ...state,
                        draftId: message.draftId,
                        loaded: message.loaded,
                        total: message.total
                    });
                }
                break;
            }

            case "media-upload-completed":
                handleCompleted(message);
                break;

            case "media-upload-failed":
                handleFailed(message);
                break;

            case "media-upload-state":
                sources.set(message.id, androidStateToMedia(message));
                if (message.state === "COMPLETED" && message.media != null) {
                    void storeCompleted(message);
                    break;
                }
                states.set(message.id, toStoredUploadState(message));
                const pending = pendingUploads.get(message.id);
                pending?.onProgress?.(message.loaded, message.total);
                if (message.state === "FAILED" && message.error != null && pending != null) {
                    pendingUploads.delete(message.id);
                    pending.reject(toError(message.error));
                } else if (pending == null) {
                    recovery.observe(message, true);
                }
                break;
        }
    }, [
        accepts, enabled, handleCompleted, handleFailed, onSelectedMedia, pendingUploads, recovery, sources, states,
        storeCompleted
    ]);

    useAndroidMessages(onAndroidMessage);

    const upload = useCallback<AndroidMediaUploadHandler>((source, downsize, onProgress) => {
        if (!enabled) {
            return Promise.reject(new AndroidMediaUploadError(
                "unsupported",
                "Android media upload is not available"
            ));
        }

        sources.set(source.id, source);
        const state = states.get(source.id);
        if (state?.draftId === draftId && state.state === "COMPLETED" && state.media != null) {
            onProgress?.(state.total, state.total);
            return Promise.resolve(state.media);
        }
        if (state?.draftId === draftId && state.state === "FAILED" && state.error != null) {
            return Promise.reject(toError(state.error));
        }

        const current = pendingUploads.get(source.id);
        if (current != null) {
            current.onProgress = onProgress;
            return current.promise;
        }

        let resolve!: (media: PrivateMediaFileInfo) => void;
        let reject!: (error: AndroidMediaUploadError) => void;
        const promise = new Promise<PrivateMediaFileInfo>((res, rej) => {
            resolve = res;
            reject = rej;
        });
        pendingUploads.set(source.id, {promise, resolve, reject, onProgress});

        if (state != null && state.draftId === draftId) {
            onProgress?.(state.loaded, state.total);
        } else {
            window.Android!.startMediaUpload(source.id, downsize, draftId);
        }
        return promise;
    }, [draftId, enabled, pendingUploads, sources, states]);

    const expectSelection = useCallback(() => {
        selectionExpectedRef.current = true;
        return () => {
            selectionExpectedRef.current = false;
        };
    }, []);

    const rejectPending = useCallback((id: string) => {
        const pending = pendingUploads.get(id);
        pendingUploads.delete(id);
        pending?.reject(new AndroidMediaUploadError("cancelled", "Android media upload was cancelled"));
    }, [pendingUploads]);

    const cancel = useCallback((id: string) => {
        window.Android?.cancelMediaUpload(id);
        rejectPending(id);
        remove(id);
    }, [rejectPending, remove]);

    const discard = useCallback((id: string) => {
        rejectPending(id);
        remove(id);
        window.Android?.discardSelectedMedia(id);
    }, [rejectPending, remove]);

    return useMemo<AndroidUploaderHandle>(() => ({
        enabled,
        expectSelection,
        upload,
        cancel,
        discard
    }), [cancel, discard, enabled, expectSelection, upload]);
}

async function validatePrivateMedia(media: unknown): Promise<PrivateMediaFileInfo> {
    const result = await validateSchema("PrivateMediaFileInfo", media, false);
    if (!result.valid) {
        throw new AndroidMediaUploadError(
            "invalid-response",
            "Android returned an invalid media upload result",
            false,
            false,
            formatSchemaErrors(result.errors)
        );
    }
    return result.data as PrivateMediaFileInfo;
}

function toError(error: AndroidMediaUploadErrorInfo): AndroidMediaUploadError {
    return new AndroidMediaUploadError(
        error.code,
        error.message,
        error.retryable,
        error.completionUnknown
    );
}

const toStoredUploadState = (state: AndroidMessageMediaUploadState): StoredUploadState => ({
    draftId: state.draftId,
    state: state.state,
    loaded: state.loaded,
    total: state.total,
    media: state.media,
    error: state.error
});
