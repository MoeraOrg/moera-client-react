import React from 'react';

import { CloseButton } from "ui/control/CloseButton";

interface Props {
    text: string;
    onClose: () => void;
}

export const ConflictWarning = ({text, onClose}: Props) => (
    <div className="alert alert-warning alert-dismissible fade show" role="alert">
        {text}
        <CloseButton onClick={onClose}/>
    </div>
);
