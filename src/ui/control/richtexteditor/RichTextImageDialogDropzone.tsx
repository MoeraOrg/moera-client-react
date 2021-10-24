import React from 'react';
import Dropzone from 'react-dropzone';
import cx from 'classnames';

import { ACCEPTED_IMAGE_TYPES } from "ui/image-types";
import { Button } from "ui/control/Button";
import "./RichTextImageDialogDropzone.css";

export default function RichTextImageDialogDropzone() {
    return (
        <Dropzone noClick noKeyboard accept={ACCEPTED_IMAGE_TYPES} maxFiles={1}>
            {({getRootProps, getInputProps, isDragAccept, isDragReject}) => (
                <div className={cx(
                    "rich-text-image-dialog-dropzone",
                    {"drag-accept": isDragAccept, "drag-reject": isDragReject}
                )} {...getRootProps()}>
                    <Button variant="primary" size="sm">Upload image</Button> or drop it here
                    <input {...getInputProps()}/>
                </div>
            )}
        </Dropzone>
    );
}
