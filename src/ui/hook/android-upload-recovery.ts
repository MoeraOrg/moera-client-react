import { useCallback, useEffect, useMemo, useState } from 'react';

import { AndroidMedia } from "api/android/media-upload";
import { AndroidMessageMediaUploadState } from "api/android/types";
import { androidStateToMedia } from "state/mediaupload/media-source";
import { useManagedTimeout } from "ui/hook/managed-timeout";

interface AndroidUploadRecoveryOptions {
    enabled: boolean;
    draftId: string | null;
    draftReady: boolean;
    draftMediaIds: readonly string[];
    onRestoreMedia: (files: AndroidMedia[]) => void;
    onAcknowledge: (id: string) => void;
}

interface AndroidUploadRecoveryHandle {
    observe(state: AndroidMessageMediaUploadState, shouldRestore: boolean): void;
    forget(id: string): void;
}

interface CompletedUpload {
    draftId: string | null;
    mediaId: string;
}

export function useAndroidUploadRecovery({
    enabled,
    draftId,
    draftReady,
    draftMediaIds,
    onRestoreMedia,
    onAcknowledge
}: AndroidUploadRecoveryOptions): AndroidUploadRecoveryHandle {
    const saved = useMemo(() => new Set(draftMediaIds), [draftMediaIds]);

    const [completed] = useState(() => new Map<string, CompletedUpload>());
    const [restored] = useState(() => new Set<string>());
    const [restoreQueue] = useState(() => new Map<string, AndroidMedia>());
    const restoreTimeout = useManagedTimeout();

    const forget = useCallback((id: string) => {
        completed.delete(id);
        restored.delete(id);
        restoreQueue.delete(id);
    }, [completed, restoreQueue, restored]);

    const acknowledgeIfSaved = useCallback((id: string, upload: CompletedUpload): boolean => {
        if (
            upload.draftId == null
            || upload.draftId !== draftId
            || !saved.has(upload.mediaId)
        ) {
            return false;
        }
        window.Android?.acknowledgeMediaUpload(id);
        forget(id);
        onAcknowledge(id);
        return true;
    }, [draftId, forget, onAcknowledge, saved]);

    useEffect(() => {
        if (!enabled || !draftReady || draftId == null) {
            return;
        }
        for (const [id, upload] of completed) {
            acknowledgeIfSaved(id, upload);
        }
    }, [acknowledgeIfSaved, completed, draftId, draftReady, enabled]);

    const flushRestoreQueue = useCallback(() => {
        const files = [...restoreQueue.values()];
        restoreQueue.clear();
        if (files.length > 0) {
            onRestoreMedia(files);
        }
    }, [onRestoreMedia, restoreQueue]);

    const observe = useCallback((state: AndroidMessageMediaUploadState, shouldRestore: boolean) => {
        const mediaId = state.state === "COMPLETED" ? state.media?.id : null;
        if (mediaId != null) {
            const upload = {draftId: state.draftId, mediaId};
            completed.set(state.id, upload);
            if (acknowledgeIfSaved(state.id, upload)) {
                return;
            }
        }
        if (!shouldRestore || restored.has(state.id)) {
            return;
        }
        restored.add(state.id);
        restoreQueue.set(state.id, androidStateToMedia(state));
        if (!restoreTimeout.isActive()) {
            restoreTimeout.set(flushRestoreQueue, 50);
        }
    }, [acknowledgeIfSaved, completed, flushRestoreQueue, restoreQueue, restoreTimeout, restored]);

    useEffect(() => () => {
        restoreTimeout.clear();
        completed.clear();
        restored.clear();
        restoreQueue.clear();
    }, [completed, draftId, restoreQueue, restoreTimeout, restored]);

    useEffect(() => {
        if (!enabled || !draftReady) {
            return;
        }
        if (draftId != null) {
            window.Android!.assignMediaUploadsToDraft(draftId);
        }
        window.Android!.requestMediaUploadStates();
    }, [draftId, draftReady, enabled]);

    return useMemo(() => ({observe, forget}), [forget, observe]);
}
