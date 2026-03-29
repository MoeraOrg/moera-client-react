import React, { useState } from 'react';
import {
    DndContext,
    DragEndEvent,
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
import UploadedFile from "ui/control/richtexteditor/media/UploadedFile";
import { notNull } from "util/misc";

interface Props {
    value: RichTextValue;
    className?: string;
}

export default function RichTextEditorFileList({value, className}: Props) {
    const {reorderMedia} = useRichTextEditorMedia();

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

    const mediaList = value.media
        .filter(notNull)
        .filter(media => media.attachment);
    const mediaIds = mediaList.map(mf => mf.id);

    const onDragStart = ({active}: DragStartEvent) =>
        setDragged(mediaList.find(mf => mf.id === active.id) ?? null);
    const onDragEnd = ({active, over}: DragEndEvent) => {
        if (over != null && active.id !== over.id) {
            reorderMedia(String(active.id), String(over.id));
        }
        setDragged(null);
    };
    const onDragCancel = () => setDragged(null);

    return (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
            <SortableContext items={mediaIds}>
                {mediaList.length > 0 &&
                    <div className={cx("rich-text-editor-file-list", className)}>
                        {mediaList.map(media =>
                            <UploadedFile key={media.id} media={media} dragged={dragged?.id === media.id}/>
                        )}
                    </div>
                }
            </SortableContext>
        </DndContext>
    );
}
