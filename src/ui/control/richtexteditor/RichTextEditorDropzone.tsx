import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';

import { ClientState } from "state/state";
import { getNodeRootPage } from "state/node/selectors";
import { ACCEPTED_IMAGE_TYPES } from "ui/image-types";
import { Button, DeleteButton, RichTextValue } from "ui/control";
import { mediaImagePreview, mediaImageSize } from "util/media-images";
import "./RichTextEditorDropzone.css";

const HASH_URI_PATTERN = /["' (]hash:([A-Za-z0-9+/-]+={0,2})["' )]/g;

function extractMediaHashes(text: string): Set<string> {
    const result = new Set<string>();
    const matches = text.matchAll(HASH_URI_PATTERN);
    for (const match of matches) {
        result.add(match[1]);
    }
    return result;
}

type Props = {
    value: RichTextValue;
} & ConnectedProps<typeof connector>;

function RichTextEditorDropzone({value, rootPage}: Props) {
    const onDrop = (files: File[]) => {

    };

    const onDelete = () => {

    }

    const {getRootProps, getInputProps, isDragAccept, isDragReject, open} =
        useDropzone({noClick: true, noKeyboard: true, accept: ACCEPTED_IMAGE_TYPES, onDrop});
    const embedded = extractMediaHashes(value.text);

    return (
        <div className={cx(
            "rich-text-editor-dropzone",
            {"drag-accept": isDragAccept, "drag-reject": isDragReject}
        )} {...getRootProps()}>
            {value.media != null && value.media.length > 0 &&
                <div className="uploaded-image-list">
                    {value.media.filter(media => !embedded.has(media.hash)).map(media => {
                        const src = mediaImagePreview(rootPage + "/media/" + media.path, 150);
                        const [imageWidth, imageHeight] = mediaImageSize(150, 150, 150, media);
                        return (
                            <div className="uploaded-image" key={media.id}>
                                <DeleteButton onClick={onDelete}/>
                                <img alt="" src={src} width={imageWidth} height={imageHeight}/>
                            </div>
                        );
                    })}
                </div>
            }
            <div className="upload">
                <Button variant="primary" size="sm" onClick={open}>Upload images</Button> or drop them here
            </div>
            <input {...getInputProps()}/>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        rootPage: getNodeRootPage(state)
    })
);

export default connector(RichTextEditorDropzone);
