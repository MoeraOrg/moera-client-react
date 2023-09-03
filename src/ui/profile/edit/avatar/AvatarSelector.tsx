import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, } from '@dnd-kit/sortable';
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import cx from 'classnames';

import { AvatarInfo } from "api/node/api-types";
import { Avatar, Loading } from "ui/control";
import AvatarSelectorItem from "ui/profile/edit/avatar/AvatarSelectorItem";
import "./AvatarSelector.css";

interface Props {
    nodeName: string | null;
    loaded: boolean;
    loading: boolean;
    avatars: AvatarInfo[];
    active: AvatarInfo | null;
    onSelect: (avatar: AvatarInfo) => void;
    onNew: () => void;
    onDelete: (id: string) => void;
    onReorder: (activeId: string, overId: string) => void;
}

export default function AvatarSelector({nodeName, loaded, loading, avatars, active, onSelect, onNew, onDelete,
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

    const [dragged, setDragged] = useState<AvatarInfo | null>(null);
    const onDragStart = ({active}: DragStartEvent) =>
        setDragged(avatars.find(avatar => avatar.id === active.id) ?? null);
    const onDragEnd = ({active, over}: DragEndEvent) => {
        if (over != null && active.id !== over.id) {
            onReorder(String(active.id), String(over.id));
        }
        setDragged(null);
    };
    const onDragCancel = () => setDragged(null);

    const avatarIds = avatars.map(avatar => avatar.id);

    return (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
            <SortableContext items={avatarIds}>
                <div className="avatar-selector">
                    {loaded ?
                        <>
                            <div className="item">
                                <div className="create" onClick={onNew}>
                                    <FontAwesomeIcon icon="plus"/><br/>New
                                </div>
                            </div>
                            {avatars.map(avatar =>
                                <div key={avatar.id}
                                     className={cx("item", {"active": active && !dragged && avatar.id === active.id})}>
                                    <AvatarSelectorItem nodeName={nodeName} avatar={avatar}
                                                        onSelect={!dragged ? onSelect: null}
                                                        onDelete={!dragged ? onDelete: null}/>
                                </div>
                            )}
                        </>
                    :
                        <Loading active={loading}/>
                    }
                </div>
            </SortableContext>
            {ReactDOM.createPortal(
                <DragOverlay zIndex={1080} dropAnimation={null}
                             modifiers={[restrictToFirstScrollableAncestor]}>
                    {dragged &&
                        <Avatar avatar={dragged} ownerName={nodeName} size={100} shape="design" draggable={false}/>
                    }
                </DragOverlay>,
                document.querySelector("#modal-root")!
            )}
        </DndContext>
    );
}
