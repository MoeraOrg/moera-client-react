import { PrivateMediaFileInfo } from "api";
import { formatSchemaErrors } from "api/error";
import {
    AndroidMediaRef,
    androidSelectionToMediaRef,
    androidStateToMediaRef
} from "api/android/media-source";
import type {
    AndroidJsInterface,
    AndroidMediaUploadError,
    AndroidMessage,
    AndroidMessageMediaUploadCompleted,
    AndroidMessageMediaUploadFailed,
    AndroidMessageMediaUploadProgress,
    AndroidMessageMediaUploadState
} from "api/android/types";
import * as Browser from "ui/browser";

type ProgressHandler = (loaded: number, total: number) => void;
type SelectionHandler = (items: AndroidMediaRef[]) => void;
type StateHandler = (state: AndroidMessageMediaUploadState) => void;
type PrivateMediaValidator = (media: unknown) => Promise<PrivateMediaFileInfo>;

interface PendingUpload {
    promise: Promise<PrivateMediaFileInfo>;
    resolve: (media: PrivateMediaFileInfo) => void;
    reject: (error: NativeMediaUploadError) => void;
    onProgress?: ProgressHandler;
}

interface ActiveDraft {
    draftId: string | null;
    onState: StateHandler;
}

async function validatePrivateMedia(media: unknown): Promise<PrivateMediaFileInfo> {
    const {validateSchema} = await import("api/node/safe");
    const result = await validateSchema("PrivateMediaFileInfo", media, false);
    if (!result.valid) {
        throw new NativeMediaUploadError(
            "invalid-response",
            "Android returned an invalid media upload result",
            false,
            false,
            formatSchemaErrors(result.errors)
        );
    }
    return result.data as PrivateMediaFileInfo;
}

export class NativeMediaUploadError extends Error {
    readonly code: string;
    readonly retryable: boolean;
    readonly completionUnknown: boolean;
    readonly details?: string;

    constructor(
        code: string,
        message: string,
        retryable: boolean = false,
        completionUnknown: boolean = false,
        details?: string
    ) {
        super(message);
        this.name = "NativeMediaUploadError";
        this.code = code;
        this.retryable = retryable;
        this.completionUnknown = completionUnknown;
        this.details = details;
    }
}

export class NativeMediaUploadManager {
    private initialized = false;
    private enabled = false;
    private selectionHandler: SelectionHandler | null = null;
    private activeDraft: ActiveDraft | null = null;
    private readonly references = new Map<string, AndroidMediaRef>();
    private readonly draftOwners = new Map<string, string | null>();
    private readonly states = new Map<string, AndroidMessageMediaUploadState>();
    private readonly pending = new Map<string, PendingUpload>();
    private readonly committedMedia = new Map<string, Set<string>>();

    constructor(
        private readonly androidProvider: () => AndroidJsInterface | undefined = () => window.Android,
        private readonly validator: PrivateMediaValidator = validatePrivateMedia
    ) {
    }

    initialize(): boolean {
        if (this.initialized) {
            return this.enabled;
        }
        this.initialized = true;

        const android = this.androidProvider();
        if (!this.supportsNativeUpload(android)) {
            return false;
        }

        window.addEventListener("message", this.messageReceived);
        try {
            android.setWebClientCapabilities!(JSON.stringify({
                nativeMediaUpload: 1,
                clientId: Browser.clientId
            }));
            this.enabled = true;
        } catch {
            window.removeEventListener("message", this.messageReceived);
        }
        return this.enabled;
    }

    isAvailable(): boolean {
        return this.enabled;
    }

    dispose(): void {
        if (this.initialized) {
            window.removeEventListener("message", this.messageReceived);
        }
        this.initialized = false;
        this.enabled = false;
        this.selectionHandler = null;
        this.activeDraft = null;
        this.references.clear();
        this.draftOwners.clear();
        this.states.clear();
        this.pending.clear();
        this.committedMedia.clear();
    }

    expectSelection(handler: SelectionHandler): () => void {
        this.selectionHandler = handler;
        return () => {
            if (this.selectionHandler === handler) {
                this.selectionHandler = null;
            }
        };
    }

    activateDraft(draftId: string | null, onState: StateHandler): () => void {
        if (!this.enabled) {
            return () => {};
        }

        const activeDraft = {draftId, onState};
        this.activeDraft = activeDraft;
        const android = this.androidProvider()!;
        if (draftId != null) {
            android.assignMediaUploadsToDraft!(draftId);
        }
        android.requestMediaUploadStates!();

        return () => {
            if (this.activeDraft === activeDraft) {
                this.activeDraft = null;
            }
        };
    }

    recordDraftMedia(draftId: string, mediaIds: Iterable<string>): void {
        this.committedMedia.set(draftId, new Set(mediaIds));
        for (const state of this.states.values()) {
            if (state.state === "COMPLETED" && state.draftId === draftId) {
                this.acknowledgeIfCommitted(state);
            }
        }
    }

    isEligibleForDraft(id: string, draftId: string | null): boolean {
        if (!this.draftOwners.has(id)) {
            return false;
        }
        const owner = this.draftOwners.get(id);
        return owner == null || owner === draftId;
    }

    finishDraft(draftId: string | null, mediaIds: Iterable<string>): void {
        const committed = new Set(mediaIds);
        for (const [id, owner] of this.draftOwners) {
            const state = this.states.get(id);
            const belongsToDraft = draftId != null && owner === draftId;
            const isCommitted = state?.state === "COMPLETED" && state.media != null && committed.has(state.media.id);
            if (isCommitted || belongsToDraft) {
                if (state?.state === "COMPLETED") {
                    this.androidProvider()?.acknowledgeMediaUpload?.(id);
                } else {
                    this.androidProvider()?.cancelMediaUpload?.(id);
                    this.rejectPending(id);
                }
                this.remove(id);
            }
        }
        if (draftId != null) {
            this.committedMedia.delete(draftId);
        }
    }

    abandonDraft(draftId: string): void {
        for (const [id, owner] of this.draftOwners) {
            if (owner !== draftId) {
                continue;
            }
            if (this.states.get(id)?.state === "COMPLETED") {
                this.androidProvider()?.acknowledgeMediaUpload?.(id);
            } else {
                this.androidProvider()?.cancelMediaUpload?.(id);
                this.rejectPending(id);
            }
            this.remove(id);
        }
        this.committedMedia.delete(draftId);
    }

    upload(
        source: AndroidMediaRef,
        draftId: string | null,
        downsize: boolean,
        onProgress?: ProgressHandler
    ): Promise<PrivateMediaFileInfo> {
        if (!this.enabled) {
            return Promise.reject(new NativeMediaUploadError(
                "unsupported",
                "Native Android media upload is not available"
            ));
        }

        this.references.set(source.id, source);
        this.draftOwners.set(source.id, draftId);
        const state = this.states.get(source.id);
        if (state?.state === "COMPLETED" && state.media != null) {
            onProgress?.(state.total, state.total);
            return Promise.resolve(state.media);
        }
        if (state?.state === "FAILED" && state.error != null) {
            return Promise.reject(this.toError(state.error));
        }

        const current = this.pending.get(source.id);
        if (current != null) {
            current.onProgress = onProgress;
            if (state != null) {
                onProgress?.(state.loaded, state.total);
            }
            return current.promise;
        }

        let resolve!: (media: PrivateMediaFileInfo) => void;
        let reject!: (error: NativeMediaUploadError) => void;
        const promise = new Promise<PrivateMediaFileInfo>((res, rej) => {
            resolve = res;
            reject = rej;
        });
        this.pending.set(source.id, {promise, resolve, reject, onProgress});

        if (state != null) {
            onProgress?.(state.loaded, state.total);
        } else {
            const request: {id: string; downsize: boolean; draftId?: string} = {id: source.id, downsize};
            if (draftId != null) {
                request.draftId = draftId;
            }
            this.androidProvider()!.startMediaUpload!(JSON.stringify(request));
        }
        return promise;
    }

    cancel(id: string): void {
        this.androidProvider()?.cancelMediaUpload?.(id);
    }

    discard(id: string): void {
        this.rejectPending(id);
        this.remove(id);
        this.androidProvider()?.discardSelectedMedia?.(id);
    }

    handleMessage(message: AndroidMessage): void {
        switch (message.action) {
            case "media-selected": {
                const handler = this.selectionHandler;
                this.selectionHandler = null;
                const items = message.items.map(androidSelectionToMediaRef);
                items.forEach(item => {
                    this.references.set(item.id, item);
                    this.draftOwners.set(item.id, null);
                });
                handler?.(items);
                break;
            }
            case "media-upload-progress":
                this.handleProgress(message);
                break;
            case "media-upload-completed":
                void this.handleCompleted(message);
                break;
            case "media-upload-failed":
                this.handleFailed(message);
                break;
            case "media-upload-state":
                void this.handleState(message);
                break;
        }
    }

    private supportsNativeUpload(android: AndroidJsInterface | undefined): android is AndroidJsInterface {
        if (android == null) {
            return false;
        }
        try {
            return android.getApiVersion() >= 3
                && typeof android.setWebClientCapabilities === "function"
                && typeof android.startMediaUpload === "function"
                && typeof android.assignMediaUploadsToDraft === "function"
                && typeof android.requestMediaUploadStates === "function"
                && typeof android.acknowledgeMediaUpload === "function";
        } catch {
            return false;
        }
    }

    private readonly messageReceived = (event: MessageEvent): void => {
        if (typeof event.data !== "string") {
            return;
        }
        try {
            const message = JSON.parse(event.data) as AndroidMessage;
            if (message.source === "moera-android") {
                this.handleMessage(message);
            }
        } catch {
            // Ignore malformed messages from unrelated page scripts.
        }
    };

    private handleProgress(message: AndroidMessageMediaUploadProgress): void {
        this.draftOwners.set(message.id, message.draftId);
        this.pending.get(message.id)?.onProgress?.(message.loaded, message.total);
        const state = this.states.get(message.id);
        if (state != null && state.state !== "COMPLETED" && state.state !== "FAILED") {
            const updated = {...state, draftId: message.draftId, loaded: message.loaded, total: message.total};
            this.states.set(message.id, updated);
            this.notifyActiveDraft(updated);
        }
    }

    private async handleCompleted(message: AndroidMessageMediaUploadCompleted): Promise<void> {
        this.draftOwners.set(message.id, message.draftId);
        const source = this.references.get(message.id);
        const previous = this.states.get(message.id);
        const total = previous?.total ?? source?.size ?? message.media.size;
        await this.storeCompleted({
            source: "moera-android",
            action: "media-upload-state",
            id: message.id,
            draftId: message.draftId,
            state: "COMPLETED",
            name: previous?.name ?? source?.name ?? message.media.title ?? "",
            mimeType: previous?.mimeType ?? source?.type ?? message.media.mimeType,
            thumbnail: previous?.thumbnail ?? source?.thumbnail ?? null,
            loaded: total,
            total,
            media: message.media
        });
    }

    private handleFailed(message: AndroidMessageMediaUploadFailed): void {
        this.draftOwners.set(message.id, message.draftId);
        const error = this.toError(message.error);
        const pending = this.pending.get(message.id);
        if (pending != null) {
            this.pending.delete(message.id);
            pending.reject(error);
        }

        const previous = this.states.get(message.id);
        const source = this.references.get(message.id);
        if (previous != null || source != null) {
            const state: AndroidMessageMediaUploadState = {
                source: "moera-android",
                action: "media-upload-state",
                id: message.id,
                draftId: message.draftId,
                state: "FAILED",
                name: previous?.name ?? source?.name ?? "",
                mimeType: previous?.mimeType ?? source?.type ?? "application/octet-stream",
                thumbnail: previous?.thumbnail ?? source?.thumbnail ?? null,
                loaded: previous?.loaded ?? 0,
                total: previous?.total ?? source?.size ?? 0,
                error: message.error
            };
            this.states.set(message.id, state);
            if (pending == null) {
                this.notifyActiveDraft(state);
            }
        }
    }

    private async handleState(message: AndroidMessageMediaUploadState): Promise<void> {
        this.references.set(message.id, androidStateToMediaRef(message));
        this.draftOwners.set(message.id, message.draftId);
        if (message.state === "COMPLETED" && message.media != null) {
            await this.storeCompleted(message);
            return;
        }

        this.states.set(message.id, message);
        this.pending.get(message.id)?.onProgress?.(message.loaded, message.total);
        if (message.state === "FAILED" && message.error != null) {
            const pending = this.pending.get(message.id);
            if (pending != null) {
                this.pending.delete(message.id);
                pending.reject(this.toError(message.error));
            }
            if (pending == null) {
                this.notifyActiveDraft(message);
            }
            return;
        }
        this.notifyActiveDraft(message);
    }

    private async storeCompleted(message: AndroidMessageMediaUploadState): Promise<void> {
        try {
            const media = await this.validator(message.media);
            const state = {...message, media};
            this.states.set(message.id, state);
            const pending = this.pending.get(message.id);
            const acknowledged = this.acknowledgeIfCommitted(state);
            if (pending != null) {
                this.pending.delete(message.id);
                pending.onProgress?.(state.total, state.total);
                pending.resolve(media);
            }
            if (!acknowledged && pending == null) {
                this.notifyActiveDraft(state);
            }
        } catch (e) {
            const error = e instanceof NativeMediaUploadError
                ? e
                : new NativeMediaUploadError("invalid-response", "Invalid native upload result");
            const pending = this.pending.get(message.id);
            if (pending != null) {
                this.pending.delete(message.id);
                pending.reject(error);
            }
        }
    }

    private acknowledgeIfCommitted(state: AndroidMessageMediaUploadState): boolean {
        const mediaId = state.media?.id;
        if (state.draftId == null || mediaId == null || !this.committedMedia.get(state.draftId)?.has(mediaId)) {
            return false;
        }
        this.androidProvider()?.acknowledgeMediaUpload?.(state.id);
        this.remove(state.id);
        return true;
    }

    private notifyActiveDraft(state: AndroidMessageMediaUploadState): void {
        const active = this.activeDraft;
        if (active == null || this.pending.has(state.id)) {
            return;
        }
        const eligible = active.draftId == null
            ? state.draftId == null
            : state.draftId == null || state.draftId === active.draftId;
        if (eligible) {
            active.onState(state);
        }
    }

    private toError(error: AndroidMediaUploadError): NativeMediaUploadError {
        return new NativeMediaUploadError(
            error.code,
            error.message,
            error.retryable,
            error.completionUnknown
        );
    }

    private remove(id: string): void {
        this.states.delete(id);
        this.references.delete(id);
        this.draftOwners.delete(id);
        this.pending.delete(id);
    }

    private rejectPending(id: string): void {
        this.pending.get(id)?.reject(new NativeMediaUploadError(
            "cancelled",
            "Native media upload was cancelled"
        ));
    }
}

export const nativeMediaUploadManager = new NativeMediaUploadManager();
