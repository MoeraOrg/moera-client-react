import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';

import { PrivateMediaFileInfo } from "api/node/api-types";
import { richTextEditorImageUpload } from "state/richtexteditor/actions";
import { ACCEPTED_IMAGE_TYPES } from "ui/image-types";
import { Button } from "ui/control/Button";
import "./RichTextImageDialogDropzone.css";

type Props = ConnectedProps<typeof connector>;

function RichTextImageDialogDropzone({richTextEditorImageUpload}: Props) {
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const onImageUploadSuccess = (mediaFile: PrivateMediaFileInfo) => {
        setUploading(false);
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

    const {getRootProps, getInputProps, isDragAccept, isDragReject, open} =
        useDropzone({noClick: true, noKeyboard: true, accept: ACCEPTED_IMAGE_TYPES, maxFiles: 1, onDrop});

    return (
        <div className={cx(
            "rich-text-image-dialog-dropzone",
            {"drag-accept": isDragAccept, "drag-reject": isDragReject}
        )} {...getRootProps()}>
            {uploading ?
                <>Uploading {uploadProgress}% ...</>
            :
                <>
                    <Button variant="primary" size="sm" onClick={open}>Upload image</Button> or drop it here
                </>
            }
            <input {...getInputProps()}/>
        </div>
    );
}

const connector = connect(
    null,
    { richTextEditorImageUpload }
);

export default connector(RichTextImageDialogDropzone);
