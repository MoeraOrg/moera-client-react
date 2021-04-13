import React from 'react';
import { connect } from 'react-redux';
import ReactAvatarEditor from 'react-avatar-editor';

import { Button, ModalDialog } from "ui/control";
import avatarPlaceholder from "ui/control/avatar.png";
import { profileCloseAvatarEditDialog, profileImageUpload } from "state/profile/actions";
import { getNodeRootPage } from "state/node/selectors";
import "./AvatarEditDialog.css";

class AvatarEditDialog extends React.Component {

    #domFile;

    onUploadClick = () => {
        this.#domFile.click();
    }

    onFileChange = () => {
        if (this.#domFile.files.length > 0) {
            this.props.profileImageUpload(this.#domFile.files[0]);
        }
    }

    render() {
        const {show, imageUploading, path, rootPage, profileCloseAvatarEditDialog} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog title="Create Avatar" className="avatar-edit-dialog" onClose={profileCloseAvatarEditDialog}>
                <div className="modal-body">
                    <ReactAvatarEditor className="editor" image={path ? `${rootPage}/media/${path}` : avatarPlaceholder}
                                       width={200} height={200} border={50} color={[255, 255, 255, 0.6]}
                                       borderRadius={100}/>
                    <br/>
                    <input type="file" ref={dom => this.#domFile = dom} onChange={this.onFileChange}/>
                    <Button variant="outline-secondary" size="sm" loading={imageUploading}
                            onClick={this.onUploadClick}>Upload image</Button>
                    <br/>
                    <input type="range" className="custom-range"/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={profileCloseAvatarEditDialog}>Cancel</Button>
                    <Button variant="primary" type="submit" loading={false}>Create</Button>
                </div>
            </ModalDialog>
        );
    }

}

export default connect(
    state => ({
        show: state.profile.avatarEditDialog.show,
        imageUploading: state.profile.avatarEditDialog.imageUploading,
        path: state.profile.avatarEditDialog.path,
        rootPage: getNodeRootPage(state)
    }),
    { profileCloseAvatarEditDialog, profileImageUpload }
)(AvatarEditDialog);
