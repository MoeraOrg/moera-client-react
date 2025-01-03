import React, { ReactNode, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import * as immutable from 'object-path-immutable';

import { PostingFeatures, SourceFormat, VerifiedMediaFile } from "api";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { richTextEditorImagesUpload } from "state/richtexteditor/actions";
import * as Browser from "ui/browser";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import {
    OnInsertHandler,
    RichTextEditorMediaContext,
    UploadProgress,
    UploadStatus
} from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { RichTextEditorDialogSubmit } from "ui/control/richtexteditor/dialog/rich-text-editor-dialog";
import { RichTextImageStandardSize } from "ui/control/richtexteditor/media/rich-text-image";
import RichTextImageDialog, { RichTextImageValues } from "ui/control/richtexteditor/media/RichTextImageDialog";
import { isHtmlEmpty } from "util/html";
import { RelNodeName } from "util/rel-node-name";
import { arrayMove } from "util/misc";
import { mediaImageExtensions } from "util/media-images";

function updateStatus(progress: UploadProgress[], index: number, status: UploadStatus): UploadProgress[] {
    const updated = immutable.set(progress, [index, "status"], status);
    return updated.some(p => p.status === "loading") ? updated : [];
}

const isAllUploaded = (media: (VerifiedMediaFile | null)[]): media is VerifiedMediaFile[] =>
    media.every(v => v != null);

type ChangeHandler = (value: RichTextValue) => void;

interface Props {
    value: RichTextValue;
    features: PostingFeatures | null;
    nodeName: RelNodeName | string;
    forceCompress?: boolean;
    srcFormat: SourceFormat;
    smileysEnabled?: boolean;
    onChange?: ChangeHandler;
    children: ReactNode;
}

export default function RichTextEditorMedia({
    value, features, nodeName, forceCompress = false, srcFormat, smileysEnabled, onChange, children
}: Props) {
    const compressImages = useSelector((state: ClientState) =>
        getSetting(state, "posting.media.compress.default") as boolean);
    const dispatch = useDispatch();

    const uploadedImagesRef = useRef<(VerifiedMediaFile | null)[]>([]);
    // Refs are needed here, because callbacks passed to richTextEditorImagesUpload() cannot be changed, while
    // value and onChange may change
    const valueRef = useRef<RichTextValue>();
    valueRef.current = value;
    const onChangeRef = useRef<ChangeHandler | undefined>();
    onChangeRef.current = onChange;

    // Parameters passed to bottom callbacks from the topmost dialog
    const onInsertRef = useRef<OnInsertHandler | undefined>();
    const standardSizeRef = useRef<RichTextImageStandardSize | undefined>();
    const customWidthRef = useRef<number | null>(null);
    const customHeightRef = useRef<number | null>(null);
    const captionRef = useRef<string | undefined>();

    const imageUploaded = (index: number, image: VerifiedMediaFile) => {
        if (uploadedImagesRef.current.some(v => v != null && v.id === image.id)) {
            return;
        }
        uploadedImagesRef.current[index] = image;
        if (isAllUploaded(uploadedImagesRef.current)) {
            const media = (valueRef.current?.media ?? []).concat(uploadedImagesRef.current);
            onChangeRef.current?.(new RichTextValue(valueRef.current?.text ?? "", srcFormat, media));
            if (onInsertRef.current != null && uploadedImagesRef.current.length > 0) {
                onInsertRef.current(
                    uploadedImagesRef.current, standardSizeRef.current ?? "large",
                    customWidthRef.current, customHeightRef.current, captionRef.current
                );
            }
        }
    }

    const onImageUploadSuccess = (index: number, mediaFile: VerifiedMediaFile) => {
        setUploadProgress(progress => updateStatus(progress, index, "success"));
        imageUploaded(index, mediaFile);
    }

    const onImageUploadFailure = (index: number) => {
        setUploadProgress(progress => updateStatus(progress, index, "failure"));
    }

    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

    const onImageUploadProgress = (index: number, loaded: number, total: number) => {
        setUploadProgress(progress => immutable.assign(progress, [index], {loaded, total}));
    }

    const imageUploadStarted = (count: number) => {
        uploadedImagesRef.current = new Array(count).fill(null);
    }

    const uploadImages = (files: File[], compress: boolean, description: RichTextValue | undefined) => {
        if (files.length > 0) {
            setUploadProgress(files.map(file => ({status: "loading", loaded: 0, total: file.size})));
            imageUploadStarted(files.length);
            const descriptionSrcText = description?.toText(smileysEnabled);
            const descriptionSrc = !isHtmlEmpty(descriptionSrcText) ? JSON.stringify({text: descriptionSrcText}) : null;
            dispatch(richTextEditorImagesUpload(
                nodeName, files, features, compress, onImageUploadSuccess, onImageUploadFailure, onImageUploadProgress,
                descriptionSrc, srcFormat
            ));
        }
    };

    const compressDefault = useRef<boolean>(forceCompress || compressImages);

    const openUploadImages = (files: File[]) => {
        showImageDialog(
            true,
            files,
            null,
            null,
            onInsertRef.current != null,
            null,
            (
                ok: boolean | null,
                {
                    files, compress, description, standardSize, customWidth, customHeight, caption
                }: Partial<RichTextImageValues>
            ) => {
                showImageDialog(false);

                if (!ok || !files || files.length === 0) {
                    return;
                }

                if (compress != null) {
                    compressDefault.current = compress;
                }
                standardSizeRef.current = standardSize;
                customWidthRef.current = customWidth ?? null;
                customHeightRef.current = customHeight ?? null;
                captionRef.current = caption;
                uploadImages(files, compress ?? compressDefault.current, description);
            }
        );
    }

    const imageExtensions = useMemo(
        () => features?.imageFormats
            ? features.imageFormats.flatMap(format => mediaImageExtensions(format)).map(ext => "." + ext)
            : [],
        [features]
    );

    const {getRootProps, getInputProps, isDragAccept, isDragReject, open: openDropzone} =
        useDropzone({
            noClick: true,
            noKeyboard: true,
            accept: {
                "image/*": imageExtensions
            },
            useFsAccessApi: !Browser.isDevMode(),
            onDrop: openUploadImages
        });

    const openLocalFiles = (onInsert?: OnInsertHandler) => {
        onInsertRef.current = onInsert;
        openDropzone();
    }

    const deleteImage = (id: string) => {
        if (onChange != null && value.media != null) {
            const media = value.media.filter(v => v == null || v.id !== id);
            onChange(new RichTextValue(value.text, srcFormat, media));
        }
    }

    const reorderImage = (moveId: string, overId: string) => {
        if (onChange != null && value.media != null && moveId !== overId) {
            const index = value.media.findIndex(v => v != null && v.id === moveId);
            const overIndex = value.media.findIndex(v => v != null && v.id === overId);
            if (index == null || overIndex == null) {
                return;
            }
            const media = arrayMove(value.media, index, overIndex);
            onChange(new RichTextValue(value.text, srcFormat, media));
        }
    }

    const pasteImage = (data: DataTransfer): boolean => {
        // clipboardData.items is array-like, not a real array, thus weird calling convention
        const imageItem: DataTransferItem = Array.prototype.find.call(
            data.items,
            ({kind, type}: DataTransferItem) => kind === "file" && features?.imageFormats.includes(type)
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
    const [imageDialogFiles, setImageDialogFiles] = useState<File[] | null>(null);
    const [imageDialogMediaFiles, setImageDialogMediaFiles] = useState<VerifiedMediaFile[] | null>(null);
    const [imageDialogHref, setImageDialogHref] = useState<string | null>(null);
    const [imageDialogInsert, setImageDialogInsert] = useState<boolean>(false);
    const [imageDialogPrevValues, setImageDialogPrevValues] = useState<RichTextImageValues | null>(null);
    const [imageDialogOnSubmit, setImageDialogOnSubmit] =
        useState<RichTextEditorDialogSubmit<RichTextImageValues>>(() => () => {});

    const showImageDialog = (
        show: boolean, files: File[] | null = null, mediaFiles: VerifiedMediaFile[] | null = null,
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

    return (
        <RichTextEditorMediaContext.Provider value={{
            getRootProps, isDragAccept, isDragReject, openLocalFiles, uploadImages, uploadProgress, forceCompress,
            compress: compressDefault.current, setCompress: value => compressDefault.current = value, deleteImage,
            reorderImage, pasteImage, showImageDialog,
        }}>
            {children}
            <input {...getInputProps()}/>
            {imageDialog &&
                <RichTextImageDialog files={imageDialogFiles} mediaFiles={imageDialogMediaFiles} href={imageDialogHref}
                                     insert={imageDialogInsert} nodeName={nodeName} forceCompress={forceCompress}
                                     compressDefault={compressDefault.current} descriptionSrcFormat={srcFormat}
                                     smileysEnabled={smileysEnabled} prevValues={imageDialogPrevValues}
                                     onSubmit={imageDialogOnSubmit}/>
            }
        </RichTextEditorMediaContext.Provider>
    );
};
