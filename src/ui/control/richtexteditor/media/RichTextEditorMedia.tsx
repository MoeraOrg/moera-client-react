import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import * as immutable from 'object-path-immutable';

import { MediaAttachment, MediaCaption, PostingFeatures, PrivateMediaFileInfo, SourceFormat } from "api";
import {
    isAndroidMedia,
    LocalMediaUploadSource,
    MediaUploadSource
} from "state/mediaupload/media-source";
import { ClientState } from "state/state";
import { getSetting, getSettingNode } from "state/settings/selectors";
import { richTextEditorMediaRename, richTextEditorMediaUpload } from "state/richtexteditor/actions";
import { useAndroidUploader, useDispatcher } from "ui/hook";
import * as Browser from "ui/browser";
import { UI_EVENT_MEDIA_COMPRESSED, UiEventMediaCompressed } from "ui/ui-events";
import {
    AttachmentType,
    OnInsertHandler,
    RichTextEditorMediaContext,
    UploadProgress,
    UploadStatus
} from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { RichTextEditorDialogSubmit } from "ui/control/richtexteditor/dialog/rich-text-editor-dialog";
import { RichTextImageStandardSize } from "ui/control/richtexteditor/media/rich-text-image";
import RichTextImageDialog, { RichTextImageValues } from "ui/control/richtexteditor/media/RichTextImageDialog";
import RichTextCopyImageDialog, {
    RichTextCopyImageValues
} from "ui/control/richtexteditor/dialog/RichTextCopyImageDialog";
import RichTextRenameMediaDialog, {
    RichTextRenameMediaValues
} from "ui/control/richtexteditor/dialog/RichTextRenameMediaDialog";
import ImageEditDialog from "ui/imageeditdialog/ImageEditDialog";
import { MediaWithCaption } from "util/media-with-caption";
import { RelNodeName } from "util/rel-node-name";
import { extension } from "util/mime-type";
import { arrayMove, notNull } from "util/misc";

function updateStatus(progress: UploadProgress[], index: number, status: UploadStatus): UploadProgress[] {
    const updated = immutable.set(progress, [index, "status"], status);
    return updated.some(p => p.status === "loading") ? updated : [];
}

const isAllUploaded = (media: (MediaWithCaption | null)[]): media is MediaWithCaption[] =>
    media.every(v => v != null);

type ChangeHandler = (value: (MediaWithCaption | null)[]) => void;

interface Props {
    value: (MediaWithCaption | null)[];
    features: PostingFeatures | null;
    nodeName: RelNodeName | string;
    noMedia?: boolean | null;
    srcFormat: SourceFormat;
    draftId?: string | null;
    draftReady?: boolean;
    draftMedia?: MediaAttachment[] | null;
    onChange?: ChangeHandler;
    children: ReactNode;
}

export default function RichTextEditorMedia({
    value, features, nodeName, noMedia, srcFormat, draftId = null, draftReady = false, draftMedia, onChange, children
}: Props) {
    const mediaMaxSize = useSelector((state: ClientState) => getSettingNode(state, "media.max-size") as number);
    const compressImages = useSelector((state: ClientState) =>
        getSetting(state, "media.compress.default") as boolean
    );
    const imageEditDialogShow = useSelector((state: ClientState) => state.imageEditDialog.show);
    const dispatch = useDispatcher();

    const [attachmentType, setAttachmentType] = useState<AttachmentType>("image");
    const uploadedImagesRef = useRef<(MediaWithCaption | null)[]>([]);
    // Refs are needed here, because callbacks passed to richTextEditorImagesUpload() cannot be changed, while
    // value and onChange may change
    const valueRef = useRef<(MediaWithCaption | null)[]>(null);
    valueRef.current = value;
    const onChangeRef = useRef<ChangeHandler | undefined>(undefined);
    onChangeRef.current = onChange;

    const draftMediaIds = useMemo(
        () => draftMedia
            ?.map(attachment => attachment.media?.id ?? attachment.remoteMedia?.mediaId)
            .filter(notNull)
            ?? [],
        [draftMedia]
    );
    const androidUploader = useAndroidUploader({
        draftId,
        draftReady,
        draftMediaIds,
        onSelectedMedia: openUploadImages,
        onRestoreMedia: files => uploadImages(files, false)
    });

    const onMediaCompressed = useCallback((event: UiEventMediaCompressed) => {
        const replaceMedia = (media: MediaWithCaption | null): MediaWithCaption | null => {
            if (media?.localMedia?.id !== event.detail.originalMediaId) {
                return media;
            }
            const caption = media.caption != null ? {...media.caption, mediaId: event.detail.media.id} : undefined;
            return new MediaWithCaption(event.detail.media, media.remoteMedia, undefined, caption);
        };

        uploadedImagesRef.current = uploadedImagesRef.current.map(replaceMedia);
        onChangeRef.current?.((valueRef.current ?? []).map(replaceMedia));
    }, []);

    useEffect(() => {
        // @ts-ignore
        document.addEventListener(UI_EVENT_MEDIA_COMPRESSED, onMediaCompressed);
        return () => {
            // @ts-ignore
            document.removeEventListener(UI_EVENT_MEDIA_COMPRESSED, onMediaCompressed);
        }
    }, [onMediaCompressed]);

    const onImageUploadSuccess = useCallback((
        onInsert?: OnInsertHandler,
        standardSize?: RichTextImageStandardSize,
        customWidth?: number | null,
        customHeight?: number | null,
        caption?: string
    ) => (index: number, mediaFile: MediaWithCaption) => {
        setUploadProgress(progress => updateStatus(progress, index, "success"));

        uploadedImagesRef.current[index] = mediaFile;

        if (isAllUploaded(uploadedImagesRef.current)) {
            const existing = new Set((valueRef.current ?? []).map(media => media?.mediaId));
            const additions = uploadedImagesRef.current.filter(media => {
                if (existing.has(media.mediaId)) {
                    return false;
                }
                existing.add(media.mediaId);
                return true;
            });
            if (additions.length > 0) {
                onChangeRef.current?.((valueRef.current ?? []).concat(additions));
            }
            if (onInsert != null && additions.length > 0) {
                onInsert(additions, standardSize ?? "large", customWidth, customHeight, caption);
            }
        }
    }, []);

    const onImageUploadFailure = useCallback(() => (index: number) => {
        setUploadProgress(progress => updateStatus(progress, index, "failure"));
    }, []);

    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

    const onImageUploadProgress = useCallback(() =>
        (index: number, loaded: number, total: number) => {
            setUploadProgress(progress => immutable.assign(progress, [index], {loaded, total}));
        }, []);

    const uploadImages = useCallback((
        files: MediaUploadSource[],
        compress: boolean,
        onInsert?: OnInsertHandler,
        standardSize?: RichTextImageStandardSize,
        customWidth?: number | null,
        customHeight?: number | null,
        caption?: string
    ) => {
        if (files.length > 0) {
            setUploadProgress(files.map(file =>
                ({status: "loading", loaded: 0, total: typeof file === "string" ? 100 : file.size})
            ));
            uploadedImagesRef.current = new Array(files.length).fill(null);
            dispatch(richTextEditorMediaUpload(
                nodeName,
                files,
                androidUploader.upload,
                compress,
                onImageUploadSuccess(onInsert, standardSize, customWidth, customHeight, caption),
                onImageUploadFailure(),
                onImageUploadProgress(),
                null,
                srcFormat
            ));
        }
    }, [androidUploader.upload, dispatch, nodeName, onImageUploadFailure, onImageUploadProgress,
        onImageUploadSuccess, srcFormat]);

    const compressDefault = useRef<boolean>(compressImages);
    const onInsertRef = useRef<OnInsertHandler | undefined>(undefined);

    function openUploadImages(selectedFiles: LocalMediaUploadSource[]) {
        if (selectedFiles.length === 0) {
            return;
        }

        if (attachmentType === "file" && onInsertRef.current == null) {
            uploadImages(selectedFiles, false);
            return;
        }

        showImageDialog(
            true,
            selectedFiles,
            null,
            null,
            onInsertRef.current != null,
            null,
            (
                ok: boolean | null,
                {files, compress, standardSize, customWidth, customHeight, caption}: Partial<RichTextImageValues>
            ) => {
                showImageDialog(false);

                const onInsert = onInsertRef.current;
                onInsertRef.current = undefined;

                if (!ok || !files || files.length === 0) {
                    selectedFiles.filter(isAndroidMedia)
                        .forEach(file => androidUploader.discard(file.id));
                    return;
                }

                if (compress != null) {
                    compressDefault.current = compress;
                }
                uploadImages(
                    files, compress ?? compressDefault.current, onInsert, standardSize, customWidth, customHeight,
                    caption
                );
            }
        );
    }

    const imageExtensions = useMemo(
        () => features?.imageFormats
            ? features.imageFormats.flatMap(format => extension(format)).map(ext => "." + ext)
            : [],
        [features]
    );

    const videoExtensions = useMemo(
        () => features?.videoFormats
            ? features.videoFormats.flatMap(format => extension(format)).map(ext => "." + ext)
            : [],
        [features]
    );

    const {getRootProps, getInputProps, isDragAccept, isDragReject, open: openDropzone} =
        useDropzone({
            noClick: true,
            noKeyboard: true,
            accept: attachmentType === "image" || onInsertRef.current != null
                ? {
                    "image/*": imageExtensions,
                    "video/*": videoExtensions
                }
                : undefined,
            useFsAccessApi: !Browser.isDevMode(),
            onDrop: openUploadImages
        });

    const currentlyExpectingSelectionRef = useRef<(() => void) | null>(null);

    useEffect(() => () => currentlyExpectingSelectionRef.current?.(), []);

    const openLocalFiles = (onInsert?: OnInsertHandler) => {
        onInsertRef.current = onInsert;
        currentlyExpectingSelectionRef.current?.();
        currentlyExpectingSelectionRef.current = androidUploader.expectSelection();
        openDropzone();
    }

    const deleteMedia = (id: string) => {
        if (onChange != null && value != null) {
            const media = value.filter(v => v == null || v.mediaId !== id);
            onChange(media);
        }
    }

    const reorderMedia = (moveId: string, overId: string) => {
        if (onChange != null && value != null && moveId !== overId) {
            const index = value.findIndex(v => v != null && v.mediaId === moveId);
            const overIndex = value.findIndex(v => v != null && v.mediaId === overId);
            if (index == null || overIndex == null) {
                return;
            }
            const media = arrayMove(value, index, overIndex);
            onChange(media);
        }
    }

    const pasteMedia = (data: DataTransfer): boolean => {
        // clipboardData.items is array-like, not a real array, thus weird calling convention
        const imageItem: DataTransferItem = Array.prototype.find.call(
            data.items,
            ({kind, type}: DataTransferItem) =>
                kind === "file" && (attachmentType === "file" || features?.imageFormats.includes(type))
        );

        if (imageItem) {
            const imageFile = imageItem.getAsFile();
            if (imageFile) {
                openUploadImages([imageFile]);
            }
            return true;
        }

        return false;
    }

    const [imageDialog, setImageDialog] = useState<boolean>(false);
    const [imageDialogFiles, setImageDialogFiles] = useState<LocalMediaUploadSource[] | null>(null);
    const [imageDialogMediaFiles, setImageDialogMediaFiles] = useState<MediaWithCaption[] | null>(null);
    const [imageDialogHref, setImageDialogHref] = useState<string | null>(null);
    const [imageDialogInsert, setImageDialogInsert] = useState<boolean>(false);
    const [imageDialogPrevValues, setImageDialogPrevValues] = useState<RichTextImageValues | null>(null);
    const [imageDialogOnSubmit, setImageDialogOnSubmit] =
        useState<RichTextEditorDialogSubmit<RichTextImageValues>>(() => () => {});

    const showImageDialog = (
        show: boolean, files: LocalMediaUploadSource[] | null = null, mediaFiles: MediaWithCaption[] | null = null,
        href: string | null = null, insert: boolean = false, prevValues: RichTextImageValues | null = null,
        onSubmit?: RichTextEditorDialogSubmit<RichTextImageValues>
    ) => {
        if (show) {
            setImageDialogFiles(files);
            setImageDialogMediaFiles(mediaFiles);
            setImageDialogHref(href);
            setImageDialogInsert(insert);
            setImageDialogPrevValues(prevValues);
            onSubmit && setImageDialogOnSubmit(() => onSubmit);
            setImageDialog(true);
        } else {
            setImageDialog(false);
        }
    }

    const [copyImageShow, setCopyImageShow] = useState<boolean>(false);

    const copyImage = () => {
        setCopyImageShow(true);
    }

    const submitCopyImage = (ok: boolean | null, values: Partial<RichTextCopyImageValues>) => {
        setCopyImageShow(false);
        if (!ok || !values.url) {
            return;
        }
        if (values.compress != null) {
            compressDefault.current = values.compress;
        }
        uploadImages([values.url], compressDefault.current);
    }

    const [renameMediaShow, setRenameMediaShow] = useState<boolean>(false);
    const [renameMediaId, setRenameMediaId] = useState<string>("");
    const [renameMediaTitle, setRenameMediaTitle] = useState<string>("");

    const renameMedia = (mediaId: string, title: string) => {
        setRenameMediaId(mediaId);
        setRenameMediaTitle(title);
        setRenameMediaShow(true);
    }

    const onRenameMediaSuccess = (info: PrivateMediaFileInfo) => {
        const media = (valueRef.current ?? []).map(m =>
            m == null || m.mediaId !== info.id ? m : m.withTitle(info.title)
        );
        onChangeRef.current?.(media);
    }

    const onRenameMediaFailure = () => {
    }

    const submitRenameMedia = (ok: boolean | null, values: Partial<RichTextRenameMediaValues>) => {
        setRenameMediaShow(false);
        if (ok && values.title != null) {
            dispatch(
                richTextEditorMediaRename(renameMediaId, values.title, onRenameMediaSuccess, onRenameMediaFailure)
            );
        }
    }

    const setMediaCaption = (mediaId: string, caption?: MediaCaption | null) => {
        if (onChange != null && value != null && caption != null) {
            const media = value.map(
                m => m == null || m.mediaId !== mediaId ? m : m.withCaption({...caption, mediaId})
            );
            onChange(media);
        }
    }

    return (
        <RichTextEditorMediaContext.Provider value={{
            getRootProps, isDragAccept, isDragReject, openLocalFiles, uploadProgress, deleteMedia, reorderMedia,
            pasteMedia, showImageDialog, copyImage, attachmentType, setAttachmentType, renameMedia, setMediaCaption,
            discardOpenFiles: androidUploader.discard
        }}>
            {children}
            <input {...getInputProps()}/>
            {imageDialog &&
                <RichTextImageDialog
                    files={imageDialogFiles}
                    mediaFiles={imageDialogMediaFiles}
                    href={imageDialogHref}
                    insert={imageDialogInsert}
                    nodeName={nodeName}
                    compressDefault={compressDefault.current}
                    mediaMaxSize={mediaMaxSize}
                    prevValues={imageDialogPrevValues}
                    onSubmit={imageDialogOnSubmit}
                />
            }
            {copyImageShow &&
                <RichTextCopyImageDialog
                    compressDefault={compressDefault.current}
                    onSubmit={submitCopyImage}
                />
            }
            {renameMediaShow &&
                <RichTextRenameMediaDialog
                    title={renameMediaTitle}
                    onSubmit={submitRenameMedia}
                />
            }
            {!noMedia && imageEditDialogShow && <ImageEditDialog/>}
        </RichTextEditorMediaContext.Provider>
    );
};
