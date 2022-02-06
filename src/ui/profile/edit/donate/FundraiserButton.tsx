import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { FundraiserInfo } from "api/node/api-types";

interface Props {
    index: number;
    fundraiser: FundraiserInfo;
    dragged: boolean;
    onClick: React.MouseEventHandler;
}

export default function FundraiserButton({index, fundraiser, dragged, onClick}: Props) {
    const sortable = useSortable({id: index.toString()});
    const sortableStyle = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition ?? undefined,
    };

    return (
        <button className={cx("fundraiser", {"dragged": dragged})} onClick={onClick} ref={sortable.setNodeRef}
                style={sortableStyle}{...sortable.attributes} {...sortable.listeners}>
            {fundraiser.title}
            <FontAwesomeIcon className="icon" icon="pen"/>
        </button>
    );
}
