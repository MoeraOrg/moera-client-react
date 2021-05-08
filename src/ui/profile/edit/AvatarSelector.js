import React, { useCallback, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors, } from '@dnd-kit/core';
import { SortableContext, } from '@dnd-kit/sortable';
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import cx from 'classnames';

import { Avatar, Loading } from "ui/control";
import AvatarSelectorItem from "ui/profile/edit/AvatarSelectorItem";
import "./AvatarSelector.css";

export default function AvatarSelector({loaded, loading, avatars, active, onSelect, onNew, onDelete, onReorder}) {
    const mouseSensor = useSensor(PointerSensor);
    const keyboardSensor = useSensor(KeyboardSensor);

    const sensors = useSensors(
        mouseSensor,
        keyboardSensor,
    );

    const [dragged, setDragged] = useState(null);
    const onDragStart = useCallback(
        ({active}) => setDragged(avatars.find(avatar => avatar.id === active.id)),
        [setDragged, avatars]
    );
    const onDragEnd = useCallback(
        ({active, over}) => {
            if (active.id !== over.id) {
                onReorder(active.id, over.id);
            }
            setDragged(null);
        },
        [setDragged, onReorder]
    );
    const onDragCancel = useCallback(
        () => setDragged(null),
        [setDragged]
    );

    const avatarIds = avatars.map(avatar => avatar.id);

    const selectorRef = useRef();
    const relateToSelector = useCallback(({transform}) => {
        if (selectorRef.current) {
            const r = selectorRef.current.getBoundingClientRect();
            return {
                ...transform,
                y: transform.y + r.y + window.scrollY - 120
            };
        }
    }, [selectorRef]);

    return (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
            <SortableContext items={avatarIds}>
                <div className="avatar-selector" ref={selectorRef}>
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
                                    <AvatarSelectorItem avatar={avatar}
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
                             modifiers={[restrictToFirstScrollableAncestor, relateToSelector]}>
                    {dragged &&
                        <Avatar avatar={dragged} size={100} shape="design" draggable={false}/>
                    }
                </DragOverlay>,
                document.querySelector("#modal-root")
            )}
        </DndContext>
    );
}
