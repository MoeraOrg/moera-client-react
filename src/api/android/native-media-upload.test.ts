import { PrivateMediaFileInfo } from "api";
import { AndroidMediaRef, isAndroidMediaRef, LocalMediaSource } from "api/android/media-source";
import { NativeMediaUploadManager } from "api/android/native-media-upload";
import type { AndroidJsInterface, AndroidMediaUploadState, AndroidMessageMediaUploadState } from "api/android/types";

jest.mock("ui/browser", () => ({clientId: "test-client"}));

const media: PrivateMediaFileInfo = {
    id: "server-media-1",
    hash: "hash",
    digest: "digest",
    path: "/media/server-media-1",
    mimeType: "video/mp4",
    width: 1920,
    height: 1080,
    orientation: 0,
    size: 1000
};

const source: AndroidMediaRef = {
    id: "local-media-1",
    name: "video.mp4",
    type: "video/mp4",
    size: 1000,
    thumbnail: "data:image/jpeg;base64,AA=="
};

function createAndroid(apiVersion: number = 3) {
    return {
        getApiVersion: jest.fn(() => apiVersion),
        setWebClientCapabilities: jest.fn(),
        startMediaUpload: jest.fn(),
        assignMediaUploadsToDraft: jest.fn(),
        requestMediaUploadStates: jest.fn(),
        acknowledgeMediaUpload: jest.fn(),
        cancelMediaUpload: jest.fn(),
        discardSelectedMedia: jest.fn()
    } as unknown as AndroidJsInterface;
}

function uploadState(
    draftId: string | null,
    state: AndroidMediaUploadState = "UPLOADING"
): AndroidMessageMediaUploadState {
    return {
        source: "moera-android",
        action: "media-upload-state",
        id: source.id,
        draftId,
        state,
        name: source.name,
        mimeType: source.type,
        thumbnail: source.thumbnail,
        loaded: state === "COMPLETED" ? source.size : 250,
        total: source.size,
        media: state === "COMPLETED" ? media : undefined
    };
}

describe("NativeMediaUploadManager", () => {
    let manager: NativeMediaUploadManager;

    afterEach(() => manager?.dispose());

    test("enables API version 3 with a capability handshake", () => {
        const android = createAndroid();
        manager = new NativeMediaUploadManager(() => android, async value => value as PrivateMediaFileInfo);

        expect(manager.initialize()).toBe(true);
        expect(JSON.parse((android.setWebClientCapabilities as jest.Mock).mock.calls[0][0])).toEqual({
            nativeMediaUpload: 1,
            clientId: expect.any(String)
        });
    });

    test("retains the legacy path when API version 3 is unavailable", () => {
        const android = createAndroid(2);
        manager = new NativeMediaUploadManager(() => android);

        expect(manager.initialize()).toBe(false);
        expect(android.setWebClientCapabilities).not.toHaveBeenCalled();
    });

    test("starts an unowned upload without a draftId and resolves the complete media", async () => {
        const android = createAndroid();
        manager = new NativeMediaUploadManager(() => android, async value => value as PrivateMediaFileInfo);
        manager.initialize();
        const onProgress = jest.fn();

        const promise = manager.upload(source, null, false, onProgress);
        expect(JSON.parse((android.startMediaUpload as jest.Mock).mock.calls[0][0])).toEqual({
            id: source.id,
            downsize: false
        });

        manager.handleMessage({
            source: "moera-android",
            action: "media-upload-progress",
            id: source.id,
            draftId: null,
            loaded: 250,
            total: source.size
        });
        expect(onProgress).toHaveBeenLastCalledWith(250, source.size);

        manager.handleMessage({
            source: "moera-android",
            action: "media-upload-completed",
            id: source.id,
            draftId: null,
            media
        });
        await expect(promise).resolves.toEqual(media);
        expect(onProgress).toHaveBeenLastCalledWith(source.size, source.size);
    });

    test("assigns all unowned uploads before requesting draft state", () => {
        const android = createAndroid();
        manager = new NativeMediaUploadManager(() => android);
        manager.initialize();

        manager.activateDraft("draft-1", jest.fn());

        expect(android.assignMediaUploadsToDraft).toHaveBeenCalledWith("draft-1");
        expect(android.requestMediaUploadStates).toHaveBeenCalledTimes(1);
        expect((android.assignMediaUploadsToDraft as jest.Mock).mock.invocationCallOrder[0])
            .toBeLessThan((android.requestMediaUploadStates as jest.Mock).mock.invocationCallOrder[0]);
    });

    test("replays only state eligible for the active draft", () => {
        const android = createAndroid();
        manager = new NativeMediaUploadManager(() => android);
        manager.initialize();
        const onState = jest.fn();
        manager.activateDraft("draft-1", onState);

        manager.handleMessage(uploadState(null));
        manager.handleMessage({...uploadState("draft-1"), id: "owned"});
        manager.handleMessage({...uploadState("draft-2"), id: "other"});

        expect(onState.mock.calls.map(call => call[0].id)).toEqual([source.id, "owned"]);
    });

    test("does not replay a live upload and acknowledges it after the draft contains its server media", async () => {
        const android = createAndroid();
        manager = new NativeMediaUploadManager(() => android, async value => value as PrivateMediaFileInfo);
        manager.initialize();
        const onState = jest.fn();
        manager.activateDraft("draft-1", onState);

        const promise = manager.upload(source, "draft-1", false);
        manager.handleMessage({
            source: "moera-android",
            action: "media-upload-completed",
            id: source.id,
            draftId: "draft-1",
            media
        });
        await expect(promise).resolves.toEqual(media);
        expect(onState).not.toHaveBeenCalled();

        manager.recordDraftMedia("draft-1", [media.id]);
        expect(android.acknowledgeMediaUpload).toHaveBeenCalledWith(source.id);
    });

    test("maps native selection without exposing a URI", () => {
        const android = createAndroid();
        manager = new NativeMediaUploadManager(() => android);
        manager.initialize();
        const selected = jest.fn();
        manager.expectSelection(selected);

        manager.handleMessage({
            source: "moera-android",
            action: "media-selected",
            items: [{
                id: source.id,
                name: source.name,
                mimeType: source.type,
                size: source.size,
                thumbnail: source.thumbnail
            }]
        });

        expect(selected).toHaveBeenCalledWith([source]);
        expect(selected.mock.calls[0][0][0]).not.toHaveProperty("uri");
        expect(selected.mock.calls[0][0][0]).not.toHaveProperty("kind");
    });

    test("distinguishes native references in a mixed local selection", () => {
        const browserFile = new File(["document"], "document.txt", {type: "text/plain"});
        const selection: LocalMediaSource[] = [browserFile, source];

        expect(selection.map(isAndroidMediaRef)).toEqual([false, true]);
    });

    test("cancels and settles a pending upload when its draft is abandoned", async () => {
        const android = createAndroid();
        manager = new NativeMediaUploadManager(() => android);
        manager.initialize();
        const promise = manager.upload(source, "draft-1", false);

        manager.abandonDraft("draft-1");

        await expect(promise).rejects.toMatchObject({code: "cancelled"});
        expect(android.cancelMediaUpload).toHaveBeenCalledWith(source.id);
        expect(manager.isEligibleForDraft(source.id, "draft-1")).toBe(false);
    });
});
