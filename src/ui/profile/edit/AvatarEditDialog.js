import React from 'react';
import { connect } from 'react-redux';
import ReactAvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import cx from 'classnames';

import { Button, ModalDialog } from "ui/control";
import avatarPlaceholder from "ui/control/avatar.png";
import { profileAvatarCreate, profileCloseAvatarEditDialog, profileImageUpload } from "state/profile/actions";
import { getNodeRootPage } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import Rotate from "ui/profile/edit/Rotate";
import AvatarShape from "ui/profile/edit/AvatarShape";
import Scale from "ui/profile/edit/Scale";
import "./AvatarEditDialog.css";

const ACCEPTED_MIME_TYPES = [
    "image/avif",
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/webp"
];

class AvatarEditDialog extends React.PureComponent {

    #domFile;
    #refEditor;

    state = {
        scale: 1,
        rotate: 0,
        shape: "circle"
    };

    getScaleMax() {
        const {width, height} = this.props;

        return width != null && height != null ? Math.min(width, height) / 100 : 2;
    }

    setScale(value) {
        this.setState({scale: Math.max(Math.min(value, this.getScaleMax()), 1)})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.show !== prevProps.show) {
            const editor = document.querySelector(".avatar-edit-dialog .editor");
            if (editor) {
                if (this.props.show) {
                    editor.addEventListener("wheel", this.onEditorWheel);
                } else {
                    editor.removeEventListener("wheel", this.onEditorWheel);
                }
            }
            if (this.props.show) {
                this.setState({shape: this.props.shapeDefault});
            }
        }

        if (this.props.show && this.props.imageId !== prevProps.imageId) {
            this.setState({scale: 1, rotate: 0});
        }
    }

    onUploadClick = () => {
        this.#domFile.click();
    }

    imageUpload(files) {
        if (files.length > 0) {
            this.props.profileImageUpload(files[0]);
        }
    }

    onFileChange = () => {
        this.imageUpload(this.#domFile.files);
    }

    onDrop = files => {
        this.imageUpload(files);
    }

    onEditorWheel = event => {
        this.setScale(this.state.scale - event.deltaY * this.getScaleMax() / 400);
        event.preventDefault();
    }

    onRotateChange = value => {
        this.setState({rotate: value});
    }

    onShapeChange = value => {
        this.setState({shape: value});
    }

    onScaleChange = value => {
        this.setScale(value);
    }

    onCreateClick = () => {
        const {imageId, width, height, profileAvatarCreate} = this.props;
        const {rotate, shape} = this.state;

        const clip = this.#refEditor.getCroppingRect();
        profileAvatarCreate({
            mediaId: imageId,
            clipX: Math.round(clip.x * width),
            clipY: Math.round(clip.y * height),
            clipSize: Math.round(clip.width * width),
            avatarSize: 200,
            rotate,
            shape
        });
    }

    render() {
        const {show, imageUploading, imageId, path, rootPage, profileCloseAvatarEditDialog} = this.props;
        const {scale, rotate, shape} = this.state;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog title="Create Avatar" className="avatar-edit-dialog" onClose={profileCloseAvatarEditDialog}>
                <div className="modal-body">
                    <div className="tools">
                        <Rotate value={rotate} onChange={this.onRotateChange}/>
                        <AvatarShape value={shape} onChange={this.onShapeChange}/>
                    </div>
                    <Dropzone onDrop={this.onDrop} noClick noKeyboard accept={ACCEPTED_MIME_TYPES}>
                        {({getRootProps, getInputProps, isDragAccept, isDragReject}) => (
                            <div {...getRootProps()}>
                                <ReactAvatarEditor
                                    className={cx("editor", {"drag-accept": isDragAccept, "drag-reject": isDragReject})}
                                    image={path ? `${rootPage}/media/${path}` : avatarPlaceholder}
                                    width={200} height={200} border={50} color={[255, 255, 224, 0.6]}
                                    borderRadius={shape === "circle" ? 100 : 10} scale={scale} rotate={rotate}
                                    ref={ref => this.#refEditor = ref}/>
                                <input {...getInputProps()}/>
                            </div>
                        )}
                    </Dropzone>
                    <Button variant={imageId ? "outline-secondary" : "primary"} size="sm" className="upload"
                            loading={imageUploading} onClick={this.onUploadClick}>Upload image</Button>
                    <Scale max={this.getScaleMax()} value={scale} onChange={this.onScaleChange}/>
                    <input type="file" ref={dom => this.#domFile = dom} onChange={this.onFileChange}/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={profileCloseAvatarEditDialog}>Cancel</Button>
                    <Button variant="primary" type="submit" loading={false} disabled={!imageId}
                            onClick={this.onCreateClick}>Create</Button>
                </div>
            </ModalDialog>
        );
    }

}

export default connect(
    state => ({
        show: state.profile.avatarEditDialog.show,
        imageUploading: state.profile.avatarEditDialog.imageUploading,
        imageId: state.profile.avatarEditDialog.imageId,
        path: state.profile.avatarEditDialog.path,
        width: state.profile.avatarEditDialog.width,
        height: state.profile.avatarEditDialog.height,
        rootPage: getNodeRootPage(state),
        shapeDefault: getSetting(state, "avatar.shape.default")
    }),
    { profileCloseAvatarEditDialog, profileImageUpload, profileAvatarCreate }
)(AvatarEditDialog);
