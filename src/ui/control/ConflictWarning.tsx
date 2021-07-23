import React from 'react';

interface Props {
    text: string;
    show: boolean;
    onClose: () => void;
}

export const ConflictWarning = ({text, show, onClose}: Props) => (
    show ?
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
            {text}
            <button type="button" className="close" aria-label="Close" onClick={onClose}>
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    :
        null
);
