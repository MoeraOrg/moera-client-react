import React, { act, useEffect } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { PrivateMediaFileInfo } from "api";
import { AndroidMedia } from "api/android/media-upload";
import type { AndroidJsInterface, AndroidMessageMediaUploadState } from "api/android/types";
import { validateSchema } from "api/node/safe";
import { LocalMediaUploadSource } from "state/mediaupload/media-source";
import { AndroidUploaderHandle, useAndroidUploader } from "ui/hook/android-uploader";

jest.mock("ui/browser", () => ({clientId: "test-client", isAndroidApp: () => true}));
jest.mock("api/node/safe", () => ({validateSchema: jest.fn()}));

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

const source: AndroidMedia = {
    id: "local-media-1",
    name: "video.mp4",
    type: "video/mp4",
    size: 1000,
    thumbnail: "data:image/jpeg;base64,AA=="
};

function createAndroid(apiVersion: number = 3) {
    const android = {
        acknowledgeMediaUpload: jest.fn<(id: string) => void>(),
        abandonDraft: jest.fn<(draftId: string) => void>(),
        assignMediaUploadsToDraft: jest.fn<(draftId: string) => void>(),
        cancelMediaUpload: jest.fn<(id: string) => void>(),
        discardSelectedMedia: jest.fn<(id: string) => void>(),
        getApiVersion: jest.fn(() => apiVersion),
        getContentUriFileName: jest.fn<(uri: string) => string | null>(),
        getContentUriMimeType: jest.fn<(uri: string) => string | null>(),
        readContentUri: jest.fn<(uri: string) => string | null>(),
        requestMediaUploadStates: jest.fn<() => void>(),
        setWebClientCapabilities: jest.fn<(json: string) => void>(),
        startMediaUpload: jest.fn<(id: string, downsize: boolean, draftId: string | null) => void>()
    };
    return android as typeof android & AndroidJsInterface;
}

function uploadState(draftId: string): AndroidMessageMediaUploadState {
    return {
        source: "moera-android",
        action: "media-upload-state",
        id: source.id,
        draftId,
        state: "UPLOADING",
        name: source.name,
        mimeType: source.type,
        thumbnail: source.thumbnail,
        loaded: 250,
        total: source.size
    };
}

function postAndroidMessage(message: object): void {
    window.dispatchEvent(new MessageEvent("message", {data: JSON.stringify(message)}));
}

interface HarnessProps {
    draftId: string | null;
    mediaIds?: readonly string[];
    onSelectedMedia: (files: LocalMediaUploadSource[]) => void;
    onRestoreMedia: (files: AndroidMedia[]) => void;
    onHandle: (handle: AndroidUploaderHandle) => void;
}

function Harness({draftId, mediaIds = [], onSelectedMedia, onRestoreMedia, onHandle}: HarnessProps) {
    const handle = useAndroidUploader({
        draftId,
        draftReady: true,
        draftMediaIds: mediaIds,
        onSelectedMedia,
        onRestoreMedia
    });
    useEffect(() => {
        onHandle(handle);
    }, [handle, onHandle]);
    return null;
}

function renderUploader(draftId: string | null, mediaIds: readonly string[] = []) {
    let handle: AndroidUploaderHandle | null = null;
    const onSelectedMedia = jest.fn<(files: LocalMediaUploadSource[]) => void>();
    const onRestoreMedia = jest.fn<(files: AndroidMedia[]) => void>();
    const onHandle = (uploader: AndroidUploaderHandle) => {
        handle = uploader;
    };
    const render = (nextDraftId: string | null, nextMediaIds: readonly string[] = mediaIds) =>
        act(() => root.render(React.createElement(Harness, {
            draftId: nextDraftId,
            mediaIds: nextMediaIds,
            onSelectedMedia,
            onRestoreMedia,
            onHandle
        })));
    render(draftId);
    return {
        onSelectedMedia,
        onRestoreMedia,
        render,
        getHandle: () => {
            if (handle == null) {
                throw new Error("Uploader handle was not returned");
            }
            return handle;
        }
    };
}

let container: HTMLDivElement;
let root: Root;

describe("useAndroidUploader", () => {
    beforeEach(() => {
        (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
        jest.mocked(validateSchema).mockImplementation(
            async (_schema, data) => ({valid: true, data}) as any
        );
        container = document.createElement("div");
        document.body.appendChild(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
        delete window.Android;
        jest.useRealTimers();
    });

    test("performs the handshake and requests states for its draft", () => {
        const android = createAndroid();
        window.Android = android;

        const {getHandle} = renderUploader("draft-1");

        expect(getHandle().enabled).toBe(true);
        expect(JSON.parse(android.setWebClientCapabilities.mock.calls[0][0])).toEqual({
            nativeMediaUpload: 1,
            clientId: "test-client"
        });
        expect(android.assignMediaUploadsToDraft).toHaveBeenCalledWith("draft-1");
        expect(android.requestMediaUploadStates).toHaveBeenCalledTimes(1);
    });

    test("delivers a picker result only after this editor requested it", () => {
        const android = createAndroid();
        window.Android = android;
        const {onSelectedMedia, getHandle} = renderUploader("draft-1");

        act(() => postAndroidMessage({
            source: "moera-android",
            action: "media-selected",
            items: [{
                id: source.id,
                name: source.name,
                mimeType: source.type,
                size: source.size,
                thumbnail: source.thumbnail
            }]
        }));
        expect(onSelectedMedia).not.toHaveBeenCalled();

        getHandle().expectSelection();
        act(() => postAndroidMessage({
            source: "moera-android",
            action: "media-selected",
            items: [{
                id: source.id,
                name: source.name,
                mimeType: source.type,
                size: source.size,
                thumbnail: source.thumbnail
            }]
        }));
        expect(onSelectedMedia).toHaveBeenCalledWith([source]);
    });

    test("starts and completes an upload owned by the hook draft", async () => {
        const android = createAndroid();
        window.Android = android;
        const {getHandle} = renderUploader("draft-1");
        const onProgress = jest.fn<(loaded: number, total: number) => void>();

        const promise = getHandle().upload(source, false, onProgress);
        expect(android.startMediaUpload).toHaveBeenCalledWith(source.id, false, "draft-1");

        act(() => postAndroidMessage({
            source: "moera-android",
            action: "media-upload-progress",
            id: source.id,
            draftId: "draft-1",
            loaded: 250,
            total: source.size
        }));
        expect(onProgress).toHaveBeenCalledWith(250, source.size);

        await act(async () => postAndroidMessage({
            source: "moera-android",
            action: "media-upload-completed",
            id: source.id,
            draftId: "draft-1",
            media
        }));
        await expect(promise).resolves.toEqual(media);
    });

    test("keeps a pending upload when an empty editor obtains a draft ID", async () => {
        const android = createAndroid();
        window.Android = android;
        let finishValidation!: () => void;
        jest.mocked(validateSchema).mockImplementation((_schema, data) => new Promise(resolve => {
            finishValidation = () => resolve({valid: true, data} as any);
        }));
        const {getHandle, render} = renderUploader(null);
        const promise = getHandle().upload(source, false);
        expect(android.startMediaUpload).toHaveBeenCalledWith(source.id, false, null);

        act(() => postAndroidMessage({
            source: "moera-android",
            action: "media-upload-completed",
            id: source.id,
            draftId: null,
            media
        }));

        render("draft-2");

        expect(android.assignMediaUploadsToDraft).toHaveBeenCalledWith("draft-2");
        await act(async () => finishValidation());
        await expect(promise).resolves.toEqual(media);
    });

    test("two hook instances restore only their own draft", async () => {
        jest.useFakeTimers();
        const android = createAndroid();
        window.Android = android;
        let handle1: AndroidUploaderHandle | null = null;
        let handle2: AndroidUploaderHandle | null = null;
        const onSelectedMedia1 = jest.fn<(files: LocalMediaUploadSource[]) => void>();
        const onSelectedMedia2 = jest.fn<(files: LocalMediaUploadSource[]) => void>();
        const onRestoreMedia1 = jest.fn<(files: AndroidMedia[]) => void>();
        const onRestoreMedia2 = jest.fn<(files: AndroidMedia[]) => void>();
        act(() => {
            root.render(React.createElement(React.Fragment, null,
                React.createElement(Harness, {
                    draftId: "draft-1",
                    onSelectedMedia: onSelectedMedia1,
                    onRestoreMedia: onRestoreMedia1,
                    onHandle: uploader => handle1 = uploader
                }),
                React.createElement(Harness, {
                    draftId: "draft-2",
                    onSelectedMedia: onSelectedMedia2,
                    onRestoreMedia: onRestoreMedia2,
                    onHandle: uploader => handle2 = uploader
                })
            ));
        });
        expect(handle1).not.toBeNull();
        expect(handle2).not.toBeNull();

        act(() => {
            postAndroidMessage(uploadState("draft-1"));
            postAndroidMessage({...uploadState("draft-2"), id: "local-media-2"});
            jest.runAllTimers();
        });

        expect(onRestoreMedia1).toHaveBeenCalledWith([source]);
        expect(onRestoreMedia2).toHaveBeenCalledWith([{...source, id: "local-media-2"}]);
    });

    test("acknowledges a completed upload already saved in the same draft", async () => {
        const android = createAndroid();
        window.Android = android;
        renderUploader("draft-1", [media.id]);

        await act(async () => postAndroidMessage({
            ...uploadState("draft-1"),
            state: "COMPLETED",
            loaded: source.size,
            media
        }));

        expect(android.acknowledgeMediaUpload).toHaveBeenCalledWith(source.id);
    });

    test("remembers a locally completed upload until the draft saves it", async () => {
        const android = createAndroid();
        window.Android = android;
        const {getHandle, onRestoreMedia, render} = renderUploader("draft-1");
        const promise = getHandle().upload(source, false);

        await act(async () => postAndroidMessage({
            source: "moera-android",
            action: "media-upload-completed",
            id: source.id,
            draftId: "draft-1",
            media
        }));
        await expect(promise).resolves.toEqual(media);
        expect(onRestoreMedia).not.toHaveBeenCalled();
        expect(android.acknowledgeMediaUpload).not.toHaveBeenCalled();

        render("draft-1", [media.id]);

        expect(android.acknowledgeMediaUpload).toHaveBeenCalledWith(source.id);
        expect(onRestoreMedia).not.toHaveBeenCalled();
    });
});
