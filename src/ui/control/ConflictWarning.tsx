import React from 'react';

import { CloseButton } from "ui/control/CloseButton";

interface Props {
    text: string;
    show: boolean;
    onClose: () => void;
}

export const ConflictWarning = ({text, show, onClose}: Props) => (
    show ?
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
            {text}
            <CloseButton onClick={onClose}/>
        </div>
    :
        null
);
