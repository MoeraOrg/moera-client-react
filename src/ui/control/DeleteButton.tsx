import React, { MouseEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./DeleteButton.css";

interface Props {
    onClick?: MouseEventHandler;
}

export const DeleteButton = ({onClick}: Props) => (
    <div className="delete-button" title="Delete" onClick={onClick}>
        <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon="times" color="white"/>
            <FontAwesomeIcon icon="times-circle"/>
        </span>
    </div>
);
