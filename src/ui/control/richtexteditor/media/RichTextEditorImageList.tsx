import React, { useState } from 'react';
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
import cx from 'classnames';

import { VerifiedMediaFile } from "api";
import { RichTextValue } from "ui/control/richtexteditor";
import { useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import UploadedImage from "ui/control/richtexteditor/media/UploadedImage";
import AttachedImage from "ui/control/richtexteditor/media/AttachedImage";
import { mediaHashesExtract } from "util/media-images";
import { RelNodeName } from "util/rel-node-name";
import { notNull } from "util/misc";
import "./RichTextEditorImageList.css";

interface Props {
    value: RichTextValue;
    className?: string;
    nodeName: RelNodeName | string;
}

export default function RichTextEditorImageList({value, className, nodeName}: Props) {
    const {reorderImage} = useRichTextEditorMedia();

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

    const embedded = mediaHashesExtract(value.value);
    const mediaList = value.media
        .filter(notNull)
        .filter(media => !embedded.has(media.hash));
    const mediaIds = mediaList.map(mf => mf.id);

    const onDragStart = ({active}: DragStartEvent) =>
        setDragged(mediaList.find(mf => mf.id === active.id) ?? null);
    const onDragEnd = ({active, over}: DragEndEvent) => {
        if (over != null && active.id !== over.id) {
            reorderImage(String(active.id), String(over.id));
        }
        setDragged(null);
    };
    const onDragCancel = () => setDragged(null);

    return (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
            <SortableContext items={mediaIds}>
                {mediaList.length > 0 &&
                    <div className={cx("rich-text-editor-image-list", className)}>
                        {mediaList.map(media =>
                            <UploadedImage key={media.id} media={media} nodeName={nodeName}
                                           dragged={dragged?.id === media.id} showMenu={!dragged}/>
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
