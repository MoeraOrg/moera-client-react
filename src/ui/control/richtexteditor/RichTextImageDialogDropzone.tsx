import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';
import { useField } from 'formik';
import { Trans, useTranslation } from 'react-i18next';

import { PostingFeatures, VerifiedMediaFile } from "api";
import { ClientState } from "state/state";
import { richTextEditorImageCopy, richTextEditorImagesUpload } from "state/richtexteditor/actions";
import { getSetting } from "state/settings/selectors";
import { getNamingNameRoot } from "state/naming/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import { Button, DeleteButton } from "ui/control";
import RichTextCopyImageDialog, { RichTextCopyImageValues } from "ui/control/richtexteditor/RichTextCopyImageDialog";
import * as Browser from "ui/browser";
import { mediaImageFindLargerPreview, mediaImagePreview, mediaImageSize } from "util/media-images";
import { urlWithParameters } from "util/url";
import "./RichTextImageDialogDropzone.css";
import { RelNodeName } from "util/rel-node-name";

interface Props {
    features: PostingFeatures | null;
    nodeName: RelNodeName | string;
    forceCompress?: boolean;
    onAdded?: (image: VerifiedMediaFile) => void;
    onDeleted?: (id: string) => void;
    externalImage?: File;
    uploadingExternalImage?: () => void;
}

export default function RichTextImageDialogDropzone({
    features, nodeName, forceCompress = false, onAdded, onDeleted, externalImage, uploadingExternalImage
}: Props) {
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, nodeName));
    const carte = useSelector(getCurrentViewMediaCarte);
    const compressImages = useSelector((state: ClientState) =>
        getSetting(state, "posting.media.compress.default") as boolean);
    const dispatch = useDispatch();

    const [compress, setCompress] = useState<boolean>(forceCompress || compressImages);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [, {value}, {setValue}] = useField<VerifiedMediaFile | null>("mediaFile");
    const {t} = useTranslation();

    const onImageUploadSuccess = (index: number, mediaFile: VerifiedMediaFile) => {
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
            dispatch(richTextEditorImagesUpload(nodeName, [files[0]], features, compress, onImageUploadSuccess,
                onImageUploadFailure, onImageUploadProgress));
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

    const submitCopyImage = (ok: boolean | null, {url}: RichTextCopyImageValues) => {
        setCopyImageShow(false);
        if (!ok || !url) {
            return;
        }
        setDownloading(true);
        dispatch(richTextEditorImageCopy(url, onImageDownloadSuccess, onImageDownloadFailure));
    }

    const {getRootProps, getInputProps, isDragAccept, isDragReject, open} =
        useDropzone({
            noClick: true,
            noKeyboard: true,
            accept: {
                "image/*": features?.imageFormats ?? []
            },
            maxFiles: 1,
            onDrop: uploadImage
        });

    let src: string | null;
    if (value?.directPath) {
        const preview = mediaImageFindLargerPreview(value.previews, 150);
        src = rootPage + "/media/" + preview?.directPath ?? value.directPath;
    } else {
        const auth = carte != null ? "carte:" + carte : null;
        const mediaLocation = value != null ? urlWithParameters(rootPage + "/media/" + value.path, {auth}) : null;
        src = mediaLocation != null ? mediaImagePreview(mediaLocation, 150) : null;
    }
    const [imageWidth, imageHeight] = value != null ? mediaImageSize(150, 150, 150, value) : [0, 0];
    if (!uploading && externalImage) {
        uploadImage([externalImage]);
        uploadingExternalImage?.();
    }
    const buttonsTitle = !Browser.isTinyScreen() ? "upload-or-copy-or-drop-images" : "upload-or-copy-images";

    return (
        <div className={cx(
            "rich-text-image-dialog-dropzone",
            {"drag-accept": isDragAccept, "drag-reject": isDragReject}
        )} {...getRootProps()}>
            {uploading ?
                t("uploading-file", {progress: uploadProgress})
            : downloading ?
                t("downloading-image")
            :
                (src != null ?
                    <div className="uploaded-image">
                        <DeleteButton onClick={onDelete}/>
                        <img alt="" src={src} width={imageWidth} height={imageHeight}/>
                    </div>
                :
                    <>
                        <Trans i18nKey={buttonsTitle}>
                            <Button variant="outline-info" size="sm" onClick={open}/>
                            <Button variant="outline-secondary" size="sm" onClick={openCopyImage}/>
                        </Trans>
                        {!forceCompress &&
                            <>
                                <br/>
                                <label className="form-check-label" htmlFor="dialogImagesCompress">
                                    {t("compress-images")}
                                </label>
                                <input className="form-check-input" type="checkbox" checked={compress}
                                       onChange={e => setCompress(e.target.checked)} id="dialogImagesCompress"/>
                            </>
                        }
                    </>
                )
            }
            <input {...getInputProps()}/>
            {copyImageShow && <RichTextCopyImageDialog onSubmit={submitCopyImage}/>}
        </div>
    );
}
