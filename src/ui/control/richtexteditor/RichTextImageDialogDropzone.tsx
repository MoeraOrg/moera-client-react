import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';
import { useField } from 'formik';

import { PostingFeatures } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNodeRootPage } from "state/node/selectors";
import { richTextEditorImagesUpload, RichTextMedia } from "state/richtexteditor/actions";
import { getSetting } from "state/settings/selectors";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { Button, DeleteButton } from "ui/control";
import { mediaImagePreview, mediaImageSize } from "util/media-images";
import "./RichTextImageDialogDropzone.css";
import { Browser } from "ui/browser";

interface OwnProps {
    features: PostingFeatures | null;
    nodeName: string | null;
    onAdded?: (image: RichTextMedia) => void;
    onDeleted?: (id: string) => void;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function RichTextImageDialogDropzone({features, nodeName, onAdded, onDeleted, rootPage, compressImages,
                                      richTextEditorImagesUpload}: Props) {
    const [compress, setCompress] = useState<boolean>(compressImages);
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

    const onDrop = (files: File[]) => {
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

    const {getRootProps, getInputProps, isDragAccept, isDragReject, open} =
        useDropzone({noClick: true, noKeyboard: true, accept: features?.imageFormats, maxFiles: 1, onDrop});

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
                        <Button variant="outline-info" size="sm" onClick={open}>Upload image</Button>
                        {!Browser.isTinyScreen() ? " or drop them here" : ""}<br/>
                        <label className="form-check-label" htmlFor="dialogImagesCompress">
                            Compress image
                        </label>
                        <input className="form-check-input" type="checkbox" checked={compress}
                               onChange={e => setCompress(e.target.checked)} id="dialogImagesCompress"/>
                    </>
                )
            }
            <input {...getInputProps()}/>
        </div>
    );
}

const connector = connect(
    (state: ClientState, props: OwnProps) => ({
        rootPage: props.nodeName ? getNamingNameNodeUri(state, props.nodeName) : getNodeRootPage(state),
        compressImages: getSetting(state, "posting.media.compress.default") as boolean
    }),
    { richTextEditorImagesUpload }
);

export default connector(RichTextImageDialogDropzone);
