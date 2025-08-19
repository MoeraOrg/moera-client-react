import React from 'react';
import cx from 'classnames';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { FundraiserInfo } from "api";
import { Icon, msEdit } from "ui/material-symbols";

interface Props {
    index: number;
    fundraiser: FundraiserInfo;
    dragged: boolean;
    onClick: React.MouseEventHandler;
}

export default function FundraiserButton({index, fundraiser, dragged, onClick}: Props) {
    const sortable = useSortable({id: index});
    const sortableStyle = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition ?? undefined,
    };

    return (
        <button className={cx("btn", "btn-tool", "fundraiser", {"dragged": dragged})} onClick={onClick}
                ref={sortable.setNodeRef} style={sortableStyle}{...sortable.attributes} {...sortable.listeners}>
            <span className="me-2">{fundraiser.title}</span>
            <Icon icon={msEdit} size={14}/>
        </button>
    );
}
