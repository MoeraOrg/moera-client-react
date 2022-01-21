import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';
import { useField } from 'formik';

import { PostingFeatures } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNodeRootPage } from "state/node/selectors";
import { richTextEditorImageCopy, richTextEditorImagesUpload, RichTextMedia } from "state/richtexteditor/actions";
import { getSetting } from "state/settings/selectors";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { Button, DeleteButton } from "ui/control";
import RichTextCopyImageDialog, { RichTextCopyImageValues } from "ui/control/richtexteditor/RichTextCopyImageDialog";
import { Browser } from "ui/browser";
import { mediaImagePreview, mediaImageSize } from "util/media-images";
import "./RichTextImageDialogDropzone.css";

interface OwnProps {
    features: PostingFeatures | null;
    nodeName: string | null;
    forceCompress?: boolean;
    onAdded?: (image: RichTextMedia) => void;
    onDeleted?: (id: string) => void;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function RichTextImageDialogDropzone({features, nodeName, forceCompress = false, onAdded, onDeleted, rootPage,
                                      compressImages, richTextEditorImagesUpload, richTextEditorImageCopy}: Props) {
    const [compress, setCompress] = useState<boolean>(forceCompress || compressImages);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [, {value}, {setValue}] = useField<RichTextMedia | null>("mediaFile");

    const onImageUploadSuccess = (index: number, mediaFile: RichTextMedia) => {
        setUploading(false);
        setValue(mediaFile);
        if (onAdded) {
            onAdded(mediaFile);
        }
    }

    const onImageUploadFailure = () => {
        setUploading(false);
    }

    const onImageUploadProgress = (index: number, loaded: number, total: number) => {
        setUploadProgress(Math.round(loaded * 100 / total));
    }

    const uploadImage = (files: File[]) => {
        if (files != null && files.length > 0) {
            setUploading(true);
            setUploadProgress(0);
            richTextEditorImagesUpload(nodeName, [files[0]], features, compress, onImageUploadSuccess,
                onImageUploadFailure, onImageUploadProgress);
        }
    }

    const onDelete = () => {
        if (value != null) {
            if (onDeleted) {
                onDeleted(value.id);
            }
            setValue(null);
        }
    }

    const [copyImageShow, setCopyImageShow] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);

    const onImageDownloadSuccess = (file: File) => {
        setDownloading(false);
        uploadImage([file]);
    }

    const onImageDownloadFailure = () => {
        setDownloading(false);
    }

    const openCopyImage = (e: React.MouseEvent) => {
        setCopyImageShow(true);
        e.preventDefault();
    }

    const submitCopyImage = (ok: boolean, {url}: RichTextCopyImageValues) => {
        setCopyImageShow(false);
        if (!ok || !url) {
            return;
        }
        setDownloading(true);
        richTextEditorImageCopy(url, onImageDownloadSuccess, onImageDownloadFailure);
    }

    const {getRootProps, getInputProps, isDragAccept, isDragReject, open} =
        useDropzone({noClick: true, noKeyboard: true, accept: features?.imageFormats, maxFiles: 1, onDrop: uploadImage});

    const mediaLocation = value != null ? rootPage + "/media/" + value.path : null;
    const src = mediaLocation != null ? mediaImagePreview(mediaLocation, 150) : null;
    const [imageWidth, imageHeight] = value != null ? mediaImageSize(150, 150, 150, value) : [0, 0];

    return (
        <div className={cx(
            "rich-text-image-dialog-dropzone",
            {"drag-accept": isDragAccept, "drag-reject": isDragReject}
        )} {...getRootProps()}>
            {uploading ?
                `Uploading ${uploadProgress}% ...`
            : downloading ?
                "Downloading image..."
            :
                (src != null ?
                    <div className="uploaded-image">
                        <DeleteButton onClick={onDelete}/>
                        <img alt="" src={src} width={imageWidth} height={imageHeight}/>
                    </div>
                :
                    <>
                        <Button variant="outline-info" size="sm" onClick={open}>Upload image</Button>
                        {" or "}
                        <Button variant="outline-secondary" size="sm" onClick={openCopyImage}>Copy image</Button>
                        {!Browser.isTinyScreen() ? " or drop it here" : ""}
                        {!forceCompress &&
                            <>
                                <br/>
                                <label className="form-check-label" htmlFor="dialogImagesCompress">
                                    Compress image
                                </label>
                                <input className="form-check-input" type="checkbox" checked={compress}
                                       onChange={e => setCompress(e.target.checked)} id="dialogImagesCompress"/>
                            </>
                        }
                    </>
                )
            }
            <input {...getInputProps()}/>
            <RichTextCopyImageDialog show={copyImageShow} onSubmit={submitCopyImage} risen/>
        </div>
    );
}

const connector = connect(
    (state: ClientState, props: OwnProps) => ({
        rootPage: props.nodeName ? getNamingNameNodeUri(state, props.nodeName) : getNodeRootPage(state),
        compressImages: getSetting(state, "posting.media.compress.default") as boolean
    }),
    { richTextEditorImagesUpload, richTextEditorImageCopy }
);

export default connector(RichTextImageDialogDropzone);
