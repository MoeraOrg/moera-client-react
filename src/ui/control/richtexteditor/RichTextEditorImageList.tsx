import React, { MouseEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { PrivateMediaFileInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNodeRootPage } from "state/node/selectors";
import { DeleteButton, RichTextValue } from "ui/control";
import { mediaImagePreview, mediaImageSize } from "util/media-images";

const HASH_URI_PATTERN = /["' (]hash:([A-Za-z0-9_-]+={0,2})["' )]/g;

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
    selectImage: (image: PrivateMediaFileInfo | null) => void;
    onDeleted?: (id: string) => void;
} & ConnectedProps<typeof connector>;

function RichTextEditorImageList({value, selectImage, onDeleted, rootPage}: Props) {
    if (value.media == null || value.media.length === 0) {
        return null;
    }

    const onDelete = (id: string) => () => {
        if (onDeleted) {
            onDeleted(id);
        }
    }

    const onClick = (image: PrivateMediaFileInfo) => (event: MouseEvent) => {
        selectImage(image);
        event.preventDefault();
    }

    const embedded = extractMediaHashes(value.text);

    return (
        <div className="uploaded-image-list">
            {value.media
                .filter((media): media is PrivateMediaFileInfo => media != null && !embedded.has(media.hash))
                .map(media => {
                    const src = mediaImagePreview(rootPage + "/media/" + media.path, 150);
                    const [imageWidth, imageHeight] = mediaImageSize(150, 150, 150, media);
                    return (
                        <div className="uploaded-image" key={media.id}>
                            <DeleteButton onClick={onDelete(media.id)}/>
                            <img alt="" src={src} width={imageWidth} height={imageHeight}
                                 onClick={onClick(media)}/>
                        </div>
                    );
                })
            }
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        rootPage: getNodeRootPage(state)
    })
);

export default connector(RichTextEditorImageList);
