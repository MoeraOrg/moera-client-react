import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    onClick: () => void;
}

export default function EntryGalleryExpandButton({onClick}: Props) {
    const buttonClick = (e: React.MouseEvent) => {
        onClick();
        e.preventDefault();
    }

    return (
        <button className="gallery-expand" title="View images as list" onClick={buttonClick}>
            <FontAwesomeIcon icon="bars"/>
        </button>
    );
}
