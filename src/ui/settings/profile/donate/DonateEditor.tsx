import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import * as immutable from 'object-path-immutable';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    UniqueIdentifier,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { useTranslation } from 'react-i18next';

import { FundraiserInfo } from "api";
import { Icon, msPaid } from "ui/material-symbols";
import FundraiserButton from "ui/settings/profile/donate/FundraiserButton";
import FundraiserDialog from "ui/settings/profile/donate/FundraiserDialog";
import "./DonateEditor.css";
import { Button } from "ui/control";

interface Props {
    value: FundraiserInfo[];
    setValue: (value: FundraiserInfo[]) => void;
}

function idSequence(n: number): {id: UniqueIdentifier}[] {
    const ids:{id: UniqueIdentifier}[] = [];

    for (let i = 0; i < n; i++) {
        ids.push({id: i});
    }

    return ids;
}

export default function DonateEditor({value, setValue}: Props) {
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

    const [dragged, setDragged] = useState<number | null>(null);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [selected, setSelected] = useState<number | null>(null);
    const {t} = useTranslation();

    const onClick = (index: number | null) => (e: React.MouseEvent) => {
        setSelected(index);
        setShowDialog(true);
        e.preventDefault();
    }

    const onSubmitDialog = (fundraiser: FundraiserInfo) => {
        if (selected != null) {
            setValue(immutable.set(value, [selected], fundraiser));
        } else {
            setValue([...value, fundraiser]);
        }
        setShowDialog(false);
    }

    const onCancelDialog = () => {
        setShowDialog(false);
    }

    const onDelete = () => {
        if (selected != null) {
            setValue(immutable.del(value, [selected]));
        }
        setShowDialog(false);
    }

    const fundraiserIds = idSequence(value.length);

    const onDragStart = ({active}: DragStartEvent) =>
        setDragged(active.id as number);
    const onDragEnd = ({active, over}: DragEndEvent) => {
        if (over != null && active.id !== over.id) {
            const newValue = [...value];
            const activeId = active.id as number;
            const overId = over.id as number;
            newValue[activeId] = value[overId];
            newValue[overId] = value[activeId];
            setValue(newValue);
        }
        setDragged(null);
    };
    const onDragCancel = () => setDragged(null);

    return (
        <div className="donate-editor">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
                <SortableContext items={fundraiserIds}>
                    {value.map((fundraiser, index) =>
                        <FundraiserButton key={index} index={index} fundraiser={fundraiser} dragged={index === dragged}
                                          onClick={onClick(index)}/>
                    )}
                </SortableContext>
                {ReactDOM.createPortal(
                    <DragOverlay zIndex={1080} dropAnimation={null}>
                        {dragged != null &&
                            <span className="btn btn-tool fundraiser-overlay">
                                {value[dragged].title}
                            </span>
                        }
                    </DragOverlay>,
                    document.querySelector("#modal-root")!
                )}
            </DndContext>
            <Button variant="primary" className="new-fundraiser" onClick={onClick(null)}>
                <Icon className="icon" icon={msPaid} size={16}/>
                {t("add-donation-button")}
            </Button>
            {showDialog &&
                <FundraiserDialog fundraiser={selected != null ? value[selected] : null} onSubmit={onSubmitDialog}
                                  onCancel={onCancelDialog} onDelete={onDelete}/>
            }
        </div>
    );
}
