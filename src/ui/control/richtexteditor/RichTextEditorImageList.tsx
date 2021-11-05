import React, { MouseEvent, useState } from 'react';
import ReactDOM from 'react-dom';
import { connect, ConnectedProps } from 'react-redux';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { PrivateMediaFileInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNodeRootPage } from "state/node/selectors";
import { DeleteButton, RichTextValue } from "ui/control";
import { mediaImagePreview, mediaImageSize } from "util/media-images";
import "./RichTextEditorImageList.css";

const HASH_URI_PATTERN = /["' (]hash:([A-Za-z0-9_-]+={0,2})["' )]/g;

function extractMediaHashes(text: string): Set<string> {
    const result = new Set<string>();
    const matches = text.matchAll(HASH_URI_PATTERN);
    for (const match of matches) {
        result.add(match[1]);
    }
    return result;
}

interface AttachedImageProps {
    media: PrivateMediaFileInfo;
    rootPage: string | null;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

function AttachedImage({media, rootPage, onClick}: AttachedImageProps) {
    const src = mediaImagePreview(rootPage + "/media/" + media.path, 150);
    const [imageWidth, imageHeight] = mediaImageSize(150, 150, 150, media);

    return (
        <img className="rich-text-editor-uploaded-image-thumbnail" alt="" src={src}
             width={imageWidth} height={imageHeight} draggable={false} onClick={onClick}/>
    );
}

interface UploadedImageProps {
    media: PrivateMediaFileInfo;
    rootPage: string | null;
    onDeleteClick?: React.MouseEventHandler;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

function UploadedImage({media, rootPage, onDeleteClick, onClick}: UploadedImageProps) {
    const sortable = useSortable({id: media.id});
    const sortableStyle = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition ?? undefined,
    };

    return (
        <div className="rich-text-editor-uploaded-image" key={media.id}>
            <DeleteButton onClick={onDeleteClick}/>
            <div ref={sortable.setNodeRef} style={sortableStyle}{...sortable.attributes} {...sortable.listeners}>
                <AttachedImage media={media} rootPage={rootPage} onClick={onClick}/>
            </div>
        </div>
    );
}

type Props = {
    value: RichTextValue;
    selectImage: (image: PrivateMediaFileInfo | null) => void;
    onDeleted?: (id: string) => void;
    onReorder?: (activeId: string, overId: string) => void;
} & ConnectedProps<typeof connector>;

function RichTextEditorImageList({value, selectImage, onDeleted, onReorder, rootPage}: Props) {
    const mouseSensor = useSensor(PointerSensor);
    const keyboardSensor = useSensor(KeyboardSensor);

    const sensors = useSensors(
        mouseSensor,
        keyboardSensor,
    );

    const [dragged, setDragged] = useState<PrivateMediaFileInfo | null>(null);

    if (value.media == null || value.media.length === 0) {
        return null;
    }

    const embedded = extractMediaHashes(value.text);
    const mediaList = value.media
        .filter((media): media is PrivateMediaFileInfo => media != null && !embedded.has(media.hash));
    const mediaIds = mediaList.map(mf => mf.id);

    const onDragStart = ({active}: DragStartEvent) =>
        setDragged(mediaList.find(mf => mf.id === active.id) ?? null);
    const onDragEnd = ({active, over}: DragEndEvent) => {
        if (onReorder != null && over != null && active.id !== over.id) {
            onReorder(active.id, over.id);
        }
        setDragged(null);
    };
    const onDragCancel = () => setDragged(null);

    const onDelete = (id: string) => () => {
        if (onDeleted) {
            onDeleted(id);
        }
    }

    const onClick = (image: PrivateMediaFileInfo) => (event: MouseEvent) => {
        selectImage(image);
        event.preventDefault();
    }

    return (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
            <SortableContext items={mediaIds}>
                <div>
                    {mediaList.map(media =>
                        <UploadedImage key={media.id} media={media} rootPage={rootPage}
                                       onDeleteClick={!dragged ? onDelete(media.id) : undefined}
                                       onClick={!dragged ? onClick(media) : undefined}/>
                    )}
                </div>
            </SortableContext>
            {ReactDOM.createPortal(
                <DragOverlay zIndex={1080} dropAnimation={null}>
                    {dragged &&
                        <AttachedImage media={dragged} rootPage={rootPage}/>
                    }
                </DragOverlay>,
                document.querySelector("#modal-root")!
            )}
        </DndContext>
    );
}

const connector = connect(
    (state: ClientState) => ({
        rootPage: getNodeRootPage(state)
    })
);

export default connector(RichTextEditorImageList);
