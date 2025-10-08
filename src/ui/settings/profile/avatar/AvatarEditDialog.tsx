import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactAvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getNodeRootPage } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import { profileAvatarCreate, profileCloseAvatarEditDialog, profileImageUpload } from "state/profile/actions";
import { ACCEPTED_IMAGE_TYPES } from "ui/image-types";
import { Button, ModalDialog } from "ui/control";
import avatarPlaceholder from "ui/control/avatar.jpg";
import { Icon, msUpload } from "ui/material-symbols";
import Rotate from "ui/settings/profile/avatar/Rotate";
import AvatarShape from "ui/settings/profile/avatar/AvatarShape";
import Scale from "ui/settings/profile/avatar/Scale";
import "./AvatarEditDialog.css";

export default function AvatarEditDialog() {
    const imageUploading = useSelector((state: ClientState) => state.profile.avatarEditDialog.imageUploading);
    const imageUploadProgress = useSelector((state: ClientState) => state.profile.avatarEditDialog.imageUploadProgress);
    const imageId = useSelector((state: ClientState) => state.profile.avatarEditDialog.imageId);
    const path = useSelector((state: ClientState) => state.profile.avatarEditDialog.path);
    const width = useSelector((state: ClientState) => state.profile.avatarEditDialog.width);
    const height = useSelector((state: ClientState) => state.profile.avatarEditDialog.height);
    const orientation = useSelector((state: ClientState) => state.profile.avatarEditDialog.orientation);
    const creating = useSelector((state: ClientState) => state.profile.avatarEditDialog.avatarCreating);
    const rootPage = useSelector(getNodeRootPage);
    const shapeDefault = useSelector((state: ClientState) => getSetting(state, "avatar.shape.default") as string);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const domFile = useRef<HTMLInputElement>(null);
    const refEditor = useRef<ReactAvatarEditor>(null);
    const [scale, setScale] = useState<number>(1);
    const [rotate, setRotate] = useState<number>(0);
    const [shape, setShape] = useState<string>("circle");

    const getScaleMax = useCallback(() =>
        width != null && height != null ? Math.min(width, height) / 100 : 2,
        [width, height]);

    const updateScale = useCallback((value: number) =>
        setScale(Math.max(Math.min(value, getScaleMax()), 1)),
        [getScaleMax]);

    const onEditorWheel = useCallback((event: WheelEvent) => {
        updateScale(scale - event.deltaY * getScaleMax() / 4000);
        event.preventDefault();
    }, [updateScale, getScaleMax, scale]);

    useEffect(() => {
        const editor = document.querySelector(".avatar-edit-dialog .editor") as HTMLElement;
        if (!editor) {
            return;
        }

        editor.addEventListener("wheel", onEditorWheel, {passive: true});
        return () => editor.removeEventListener("wheel", onEditorWheel);
    }, [onEditorWheel]);

    useEffect(() => {
        setShape(shapeDefault);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 'shapeDefault' is missing on purpose

    useEffect(() => {
        setScale(1);
        setRotate(0);
    }, [imageId]);

    const onUploadClick = () => {
        if (domFile.current != null) {
            domFile.current.click();
        }
    }

    const imageUpload = (files: {[index: number]: File, length: number}) => {
        if (files.length > 0) {
            dispatch(profileImageUpload(files[0]));
        }
    }

    const onFileChange = () => {
        if (domFile.current?.files != null) {
            imageUpload(domFile.current?.files);
        }
    }

    const onDrop = (files: File[]) =>
        imageUpload(files);

    const onRotateChange = (value: number) =>
        setRotate(value);

    const onShapeChange = (value: string) =>
        setShape(value);

    const onScaleChange = (value: number) =>
        updateScale(value);

    const onCreateClick = () => {
        if (refEditor.current == null || imageId == null || width == null || height == null) {
            return;
        }

        const imageWidth = isSwapAxes(orientation) ? height : width;
        const imageHeight = isSwapAxes(orientation) ? width : height;
        const clip = refEditor.current.getCroppingRect();
        dispatch(profileAvatarCreate({
            mediaId: imageId,
            clipX: Math.round(clip.x * imageWidth),
            clipY: Math.round(clip.y * imageHeight),
            clipSize: Math.round(clip.width * imageWidth),
            avatarSize: 200,
            rotate,
            shape
        }));
    }

    const onClose = () => dispatch(profileCloseAvatarEditDialog());

    return (
        <ModalDialog
            title={t("create-avatar")}
            className="avatar-edit-dialog"
            expand
            onClose={onClose}
        >
            <div className="modal-body">
                <div className="tools">
                    <Rotate value={rotate} onChange={onRotateChange}/>
                    <AvatarShape value={shape} onChange={onShapeChange}/>
                </div>
                <Dropzone onDrop={onDrop} noClick noKeyboard accept={{"image/*": ACCEPTED_IMAGE_TYPES}} maxFiles={1}>
                    {({getRootProps, getInputProps, isDragAccept, isDragReject}) => (
                        <div {...getRootProps()}>
                            <ReactAvatarEditor
                                className={cx("editor", {"drag-accept": isDragAccept, "drag-reject": isDragReject})}
                                image={path ? `${rootPage}/media/${path}` : avatarPlaceholder}
                                width={200}
                                height={200}
                                border={50}
                                color={[255, 255, 255, 0.8]}
                                borderRadius={shape === "circle" ? 100 : 10}
                                scale={scale}
                                rotate={rotate}
                                ref={refEditor}
                            />
                            <input {...getInputProps()}/>
                        </div>
                    )}
                </Dropzone>
                <Button
                    variant={imageId ? "outline-secondary" : "primary"}
                    size="sm"
                    className="upload"
                    loading={imageUploading}
                    onClick={onUploadClick}
                >
                    <Icon icon={msUpload} size="1.2em"/>&nbsp;&nbsp;
                    {imageUploadProgress == null
                        ? t("upload-image")
                        : t("uploading-file", {progress: imageUploadProgress})
                    }
                </Button>
                <Scale max={getScaleMax()} value={scale} onChange={onScaleChange}/>
                <input type="file" accept="image/*" ref={domFile} onChange={onFileChange}/>
            </div>
            <div className="modal-footer">
                <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                <Button variant="primary" type="submit" loading={creating} disabled={!imageId} onClick={onCreateClick}>
                    {t("create")}
                </Button>
            </div>
        </ModalDialog>
    );
}

function isSwapAxes(orientation: number | null): boolean {
    return orientation != null && orientation >= 5 && orientation <= 8;
}
