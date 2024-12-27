import React, { ReactNode, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import * as immutable from 'object-path-immutable';

import { PostingFeatures, SourceFormat, VerifiedMediaFile } from "api";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { richTextEditorImagesUpload } from "state/richtexteditor/actions";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import {
    RichTextEditorMediaContext,
    UploadProgress,
    UploadStatus
} from "ui/control/richtexteditor/rich-text-editor-media-context";
import RichTextUploadImagesDialog, {
    RichTextUploadImagesValues
} from "ui/control/richtexteditor/RichTextUploadImagesDialog";
import { isHtmlEmpty } from "util/html";
import { RelNodeName } from "util/rel-node-name";

function updateStatus(progress: UploadProgress[], index: number, status: UploadStatus): UploadProgress[] {
    const updated = immutable.set(progress, [index, "status"], status);
    return updated.some(p => p.status === "loading") ? updated : [];
}

type ImageLoadStartedHandler = (count: number) => void;
type ImageLoadedHandler = (index: number, image: VerifiedMediaFile) => void;

interface Props {
    value: RichTextValue;
    features: PostingFeatures | null;
    nodeName: RelNodeName | string;
    forceCompress?: boolean;
    captionSrcFormat?: SourceFormat;
    smileysEnabled?: boolean;
    onLoadStarted?: ImageLoadStartedHandler;
    onLoaded?: ImageLoadedHandler;
    children: ReactNode;
}

export default function RichTextEditorMedia({
    value, features, nodeName, forceCompress = false, captionSrcFormat, smileysEnabled, onLoadStarted, onLoaded,
    children
}: Props) {
    const compressImages = useSelector((state: ClientState) =>
        getSetting(state, "posting.media.compress.default") as boolean);
    const dispatch = useDispatch();

    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
    // Refs are needed here, because callbacks passed to richTextEditorImagesUpload() cannot be changed, while
    // onLoadStarted and onLoaded may change
    const onLoadStartedRef = useRef<ImageLoadStartedHandler>();
    onLoadStartedRef.current = onLoadStarted;
    const onLoadedRef = useRef<ImageLoadedHandler>();
    onLoadedRef.current = onLoaded;

    const onImageUploadSuccess = (startIndex: number) => (index: number, mediaFile: VerifiedMediaFile) => {
        setUploadProgress(progress => updateStatus(progress, index, "success"));
        if (onLoadedRef.current) {
            onLoadedRef.current(startIndex + index, mediaFile);
        }
    }

    const onImageUploadFailure = (index: number) => {
        setUploadProgress(progress => updateStatus(progress, index, "failure"));
    }

    const onImageUploadProgress = (index: number, loaded: number, total: number) => {
        setUploadProgress(progress => immutable.assign(progress, [index], {loaded, total}));
    }

    const uploadImages = (files: File[], caption: RichTextValue | undefined) => {
        if (files.length > 0) {
            const progress: UploadProgress[] = [];
            for (const file of files) {
                progress.push({status: "loading", loaded: 0, total: file.size});
            }
            setUploadProgress(progress);
            if (onLoadStartedRef.current) {
                onLoadStartedRef.current(files.length);
            }
            const captionSrcText = caption?.toString(smileysEnabled);
            const captionSrc = !isHtmlEmpty(captionSrcText) ? JSON.stringify({text: captionSrcText}) : null;
            dispatch(richTextEditorImagesUpload(
                nodeName, files, features, compress.current, onImageUploadSuccess(value.media?.length ?? 0),
                onImageUploadFailure, onImageUploadProgress, captionSrc, captionSrcFormat
            ));
        }
    };

    const [files, setFiles] = useState<File[]>([]);
    const compress = useRef<boolean>(forceCompress || compressImages);
    const [uploadImagesShow, setUploadImagesShow] = useState<boolean>(false);

    const openUploadImages = (files: File[]) => {
        setFiles(files);
        setUploadImagesShow(true);
    }

    const submitUploadImages = (ok: boolean | null, values: Partial<RichTextUploadImagesValues>) => {
        setUploadImagesShow(false);
        if (!ok || !values.files || values.files.length === 0) {
            return;
        }
        if (values.compress != null) {
            compress.current = values.compress;
        }
        uploadImages(values.files, values.caption);
    }

    const {getRootProps, getInputProps, isDragAccept, isDragReject, open} =
        useDropzone({
            noClick: true,
            noKeyboard: true,
            accept: {
                "image/*": features?.imageFormats ?? []
            },
            onDrop: openUploadImages
        });

    return (
        <RichTextEditorMediaContext.Provider value={{
            getRootProps, isDragAccept, isDragReject, open, uploadImages, uploadProgress, forceCompress,
            compress: compress.current, setCompress: value => compress.current = value,
        }}>
            {children}
            <input {...getInputProps()}/>
            {uploadImagesShow &&
                <RichTextUploadImagesDialog forceCompress={forceCompress} files={files}
                                            compressDefault={compress.current} captionSrcFormat={captionSrcFormat}
                                            smileysEnabled={smileysEnabled} onSubmit={submitUploadImages}/>
            }
        </RichTextEditorMediaContext.Provider>
    );
};
