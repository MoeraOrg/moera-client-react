import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    collapse?: boolean;
    onClick: () => void;
}

export default function EntryGalleryExpandButton({collapse = false, onClick}: Props) {
    const buttonClick = (e: React.MouseEvent) => {
        onClick();
        e.preventDefault();
    }

    return (
        <button className="gallery-expand" title={collapse ? "View images as grid" : "View images as list"}
                onClick={buttonClick}>
            <FontAwesomeIcon icon={collapse ? "th" : "bars"}/>
        </button>
    );
}
