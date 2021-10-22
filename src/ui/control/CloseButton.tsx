import React, { MouseEventHandler } from 'react';

interface Props {
    onClick?: MouseEventHandler | null;
}

export const CloseButton = ({onClick}: Props) => (
    <button type="button" className="btn-close" aria-label="Close" onClick={onClick ?? undefined}/>
);
