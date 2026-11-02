import React, { act, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';

import { PostingFeatures, PrivateMediaFileInfo } from "api";
import { LocalMediaUploadSource } from "state/mediaupload/media-source";
import { RichTextEditorMediaUploadAction } from "state/richtexteditor/actions";
import RichTextEditorMedia from "ui/control/richtexteditor/media/RichTextEditorMedia";
import { RichTextImageValues } from "ui/control/richtexteditor/media/RichTextImageDialog";
import {
    RichTextEditorMediaInterface,
    useRichTextEditorMedia
} from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { MediaWithCaption } from "util/media-with-caption";

interface ImageDialogProps {
    files: LocalMediaUploadSource[];
    onSubmit: (ok: boolean, values: Partial<RichTextImageValues>) => void;
}

let mockImageDialogProps: ImageDialogProps | undefined;
let mockAndroidSelection: (files: LocalMediaUploadSource[]) => void;
const mockDispatch = jest.fn();
const mockOnChange = jest.fn();
const mockAndroidUploader = {upload: jest.fn(), discard: jest.fn(), expectSelection: jest.fn()};

jest.mock('react-redux', () => ({
    useSelector: (selector: (state: object) => unknown) => selector({imageEditDialog: {show: false}})
}));
jest.mock('mime', () => ({
    getExtension: (type: string) => {
        const extensions: Record<string, string> = {
            "image/png": "png", "image/svg+xml": "svg", "video/mp4": "mp4", "application/mp4": "mp4"
        };
        return extensions[type];
    }
}));
jest.mock("state/settings/selectors", () => ({getSetting: () => true, getSettingNode: () => 1000000}));
jest.mock("ui/browser", () => ({isDevMode: () => true}));
jest.mock("ui/hook", () => ({
    useDispatcher: () => mockDispatch,
    useAndroidUploader: ({onSelectedMedia}: {onSelectedMedia: typeof mockAndroidSelection}) => {
        mockAndroidSelection = onSelectedMedia;
        return mockAndroidUploader;
    }
}));
jest.mock("ui/control/richtexteditor/media/RichTextImageDialog", () => (props: ImageDialogProps) => {
    mockImageDialogProps = props;
    return null;
});
jest.mock("ui/control/richtexteditor/dialog/RichTextCopyImageDialog", () => () => null);
jest.mock("ui/control/richtexteditor/dialog/RichTextRenameMediaDialog", () => () => null);
jest.mock("ui/imageeditdialog/ImageEditDialog", () => () => null);

const features = {
    imageFormats: ["image/png", "image/svg+xml"], videoFormats: ["video/mp4", "application/mp4"]
} as PostingFeatures;
let controls: RichTextEditorMediaInterface;
let root: Root;
let container: HTMLDivElement;

function Controls() {
    controls = useRichTextEditorMedia();
    return <output>{controls.attachmentType}</output>;
}

function Editor({postingFeatures = features}: {postingFeatures?: PostingFeatures | null}) {
    const [value, setValue] = useState<(MediaWithCaption | null)[]>([]);
    return (
        <RichTextEditorMedia value={value} features={postingFeatures} nodeName="home" srcFormat="markdown"
                             onChange={media => {setValue(media); mockOnChange(media);}}>
            <Controls/>
        </RichTextEditorMedia>
    );
}

function uploaded(id: string, mimeType: string, attachment: boolean): MediaWithCaption {
    const media: PrivateMediaFileInfo = {
        id, hash: id, digest: id, path: `private/${id}`, mimeType, attachment, size: 100,
        width: attachment ? null : 100, height: attachment ? null : 100, orientation: 1
    };
    return new MediaWithCaption(media);
}

async function selectFiles(files: File[]) {
    const input = container.querySelector("input")!;
    Object.defineProperty(input, "files", {configurable: true, value: files});
    await act(async () => {
        input.dispatchEvent(new Event("change", {bubbles: true}));
    });
}

function uploadRequest(): RichTextEditorMediaUploadAction["payload"] {
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    const action: RichTextEditorMediaUploadAction = mockDispatch.mock.calls[0][0];
    expect(action.type).toBe("RICH_TEXT_EDITOR_MEDIA_UPLOAD");
    return action.payload;
}

beforeAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true}));
afterAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: false}));

beforeEach(() => {
    mockImageDialogProps = undefined;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => root.render(<Editor/>));
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
});

const documents = [
    {name: "drawing.SVG", type: "image/svg+xml"},
    {name: "drawing.SVG", type: ""},
    {name: "drawing.SVG", type: "application/octet-stream"},
    {name: "notes.txt", type: "text/plain"},
    {name: "notes.txt", type: ""}
];

test.each(documents)("uploads $name ($type) through the document picker", async ({name, type}) => {
    const file = new File(["content"], name, {type});
    act(() => controls.setAttachmentType("file"));

    await selectFiles([file]);

    const request = uploadRequest();
    expect(request.files).toEqual([file]);
    expect(request.compress).toBe(false);
    expect(container.querySelector("output")?.textContent).toBe("file");
    const document = uploaded("document", file.type, true);
    act(() => request.onSuccess(0, document));
    expect(mockOnChange).toHaveBeenLastCalledWith([document]);
});

test.each(documents)("excludes $name ($type) from the image picker", async ({name, type}) => {
    const file = new File(["content"], name, {type});

    await selectFiles([file]);

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockImageDialogProps).toBeUndefined();
});

test.each(documents)("uploads Android document $name ($type) without image settings", ({name, type}) => {
    const file = {id: "document", name, type, size: 100};
    act(() => controls.setAttachmentType("file"));

    act(() => mockAndroidSelection([file]));

    const request = uploadRequest();
    expect(request.files).toEqual([file]);
    expect(request.compress).toBe(false);
});

test.each(documents)("pastes $name ($type) only in document mode", ({name, type}) => {
    const file = new File(["content"], name, {type});
    const data = {items: [{kind: "file", type, getAsFile: () => file}]} as unknown as DataTransfer;
    let handled = false;

    act(() => {handled = controls.pasteMedia(data);});

    expect(handled).toBe(false);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockImageDialogProps).toBeUndefined();
    act(() => controls.setAttachmentType("file"));
    act(() => {handled = controls.pasteMedia(data);});

    expect(handled).toBe(true);
    expect(uploadRequest().files).toEqual([file]);
});

test("excludes documents from a mixed image selection before opening the dialog", async () => {
    const svg = new File(["<svg/>"], "drawing.svg", {type: "image/svg+xml"});
    const txt = new File(["text"], "notes.txt", {type: "text/plain"});
    const png = new File(["png"], "photo.png", {type: "image/png"});
    const onInsert = jest.fn();
    act(() => controls.openLocalFiles(onInsert));

    await selectFiles([svg, txt, png]);

    expect(mockImageDialogProps!.files.map(file => file.name)).toEqual(["photo.png"]);
    act(() => mockImageDialogProps!.onSubmit(true, {files: [png], compress: true}));
    const request = uploadRequest();
    expect(request.files).toEqual([png]);
    const image = uploaded("png", "image/png", false);
    act(() => request.onSuccess(0, image));
    expect(mockOnChange).toHaveBeenLastCalledWith([image]);
    expect(onInsert).toHaveBeenCalledWith([image], "large", undefined, undefined, undefined);
});

test("attaches SVG and TXT together through the same document upload", async () => {
    const svg = new File(["<svg/>"], "drawing.svg", {type: "image/svg+xml"});
    const txt = new File(["text"], "notes.txt", {type: "text/plain"});
    act(() => controls.setAttachmentType("file"));

    await selectFiles([svg, txt]);

    const request = uploadRequest();
    expect(request.files).toEqual([svg, txt]);
    expect(request.compress).toBe(false);
});

test.each([null, {imageFormats: [], videoFormats: []} as unknown as PostingFeatures])(
    "keeps the image picker closed without supported formats (%p)",
    async postingFeatures => {
        act(() => root.render(<Editor postingFeatures={postingFeatures}/>));
        act(() => controls.openLocalFiles());
        const file = new File(["content"], "drawing.svg", {type: "image/svg+xml"});

        await selectFiles([file]);

        expect(mockDispatch).not.toHaveBeenCalled();
        expect(mockImageDialogProps).toBeUndefined();
        act(() => controls.setAttachmentType("file"));
        await selectFiles([file]);
        expect(uploadRequest().files).toEqual([file]);
    }
);

test.each([
    ["photo.png", "image/png"],
    ["movie.mp4", "video/mp4"],
    ["movie.mp4", "application/mp4"]
])("preserves the image dialog and compression choice for %s (%s)", async (name, type) => {
    const file = new File(["media"], name, {type});

    await selectFiles([file]);

    expect(mockDispatch).not.toHaveBeenCalled();
    act(() => mockImageDialogProps!.onSubmit(true, {files: [file], compress: true}));
    const request = uploadRequest();
    expect(request.files).toEqual([file]);
    expect(request.compress).toBe(true);
});
