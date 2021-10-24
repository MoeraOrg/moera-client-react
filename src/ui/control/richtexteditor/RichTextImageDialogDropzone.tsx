import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';
import { useField } from 'formik';

import { PrivateMediaFileInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNodeRootPage } from "state/node/selectors";
import { richTextEditorImageUpload } from "state/richtexteditor/actions";
import { ACCEPTED_IMAGE_TYPES } from "ui/image-types";
import { Button, DeleteButton } from "ui/control";
import { mediaImagePreview, mediaImageSize } from "util/media-images";
import "./RichTextImageDialogDropzone.css";

type Props = ConnectedProps<typeof connector>;

function RichTextImageDialogDropzone({rootPage, richTextEditorImageUpload}: Props) {
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [, {value}, {setValue}] = useField<PrivateMediaFileInfo | null>("mediaFile");

    const onImageUploadSuccess = (mediaFile: PrivateMediaFileInfo) => {
        setUploading(false);
        setValue(mediaFile);
    }

    const onImageUploadFailure = () => {
        setUploading(false);
    }

    const onImageUploadProgress = (loaded: number, total: number) => {
        setUploadProgress(Math.round(loaded * 100 / total));
    }

    const onDrop = (files: File[]) => {
        if (files != null && files.length > 0) {
            setUploading(true);
            setUploadProgress(0);
            richTextEditorImageUpload(files[0], onImageUploadSuccess, onImageUploadFailure, onImageUploadProgress);
        }
    }

    const onDelete = () => {
        setValue(null);
    }

    const {getRootProps, getInputProps, isDragAccept, isDragReject, open} =
        useDropzone({noClick: true, noKeyboard: true, accept: ACCEPTED_IMAGE_TYPES, maxFiles: 1, onDrop});

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
            :
                (src != null ?
                    <div className="uploaded-image">
                        <DeleteButton onClick={onDelete}/>
                        <img alt="" src={src} width={imageWidth} height={imageHeight}/>
                    </div>
                :
                    <>
                        <Button variant="primary" size="sm" onClick={open}>Upload image</Button> or drop it here
                    </>
                )
            }
            <input {...getInputProps()}/>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        rootPage: getNodeRootPage(state)
    }),
    { richTextEditorImageUpload }
);

export default connector(RichTextImageDialogDropzone);
