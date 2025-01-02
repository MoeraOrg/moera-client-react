import React, { MouseEvent, useState } from 'react';
import ReactDOM from 'react-dom';
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
import { SortableContext } from '@dnd-kit/sortable';

import { PrivateMediaFileInfo, VerifiedMediaFile } from "api";
import { RichTextValue } from "ui/control/richtexteditor";
import UploadedImage from "ui/control/richtexteditor/UploadedImage";
import AttachedImage from "ui/control/richtexteditor/AttachedImage";
import { mediaHashesExtract } from "util/media-images";
import { RelNodeName } from "util/rel-node-name";
import "./RichTextEditorImageList.css";

interface Props {
    value: RichTextValue;
    nodeName: RelNodeName | string;
    selectedImage: PrivateMediaFileInfo | null;
    selectImage: (image: VerifiedMediaFile | null) => void;
    onDeleted?: (id: string) => void;
    onReorder?: (activeId: string, overId: string) => void;
}

export default function RichTextEditorImageList({value, nodeName, selectedImage, selectImage, onDeleted,
                                                 onReorder}: Props) {
    const mouseSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 10
        }
    });
    const keyboardSensor = useSensor(KeyboardSensor);

    const sensors = useSensors(
        mouseSensor,
        keyboardSensor,
    );

    const [dragged, setDragged] = useState<VerifiedMediaFile | null>(null);

    if (value.media == null || value.media.length === 0) {
        return null;
    }

    const embedded = mediaHashesExtract(value.text);
    const mediaList = value.media
        .filter((media): media is VerifiedMediaFile => media != null && !embedded.has(media.hash));
    const mediaIds = mediaList.map(mf => mf.id);

    const onDragStart = ({active}: DragStartEvent) =>
        setDragged(mediaList.find(mf => mf.id === active.id) ?? null);
    const onDragEnd = ({active, over}: DragEndEvent) => {
        if (onReorder != null && over != null && active.id !== over.id) {
            onReorder(String(active.id), String(over.id));
        }
        setDragged(null);
    };
    const onDragCancel = () => setDragged(null);

    const onDelete = (id: string) => () => {
        if (onDeleted) {
            onDeleted(id);
        }
    }

    const onClick = (image: VerifiedMediaFile) => (event: MouseEvent) => {
        selectImage(image);
        event.preventDefault();
    }

    return (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
            <SortableContext items={mediaIds}>
                {mediaList.length > 0 &&
                    <div className="rich-text-editor-image-list">
                        {mediaList.filter(media => media.id !== selectedImage?.id).map(media =>
                            <UploadedImage key={media.id} media={media} nodeName={nodeName}
                                           dragged={dragged?.id === media.id} showMenu={!dragged}
                                           onDelete={onDelete(media.id)}
                                           onClick={!dragged ? onClick(media) : undefined}/>
                        )}
                    </div>
                }
            </SortableContext>
            {ReactDOM.createPortal(
                <DragOverlay zIndex={1080} dropAnimation={null}>
                    {dragged &&
                        <AttachedImage media={dragged} nodeName={nodeName} dragging/>
                    }
                </DragOverlay>,
                document.querySelector("#modal-root")!
            )}
        </DndContext>
    );
}
