import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from "ui/control";

interface Props {
    value: number;
    onChange?: (angle: number) => void;
}

export default function Rotate({value, onChange}: Props) {
    const onClick = (sign: 1 | -1) => () => {
        if (onChange) {
            onChange((value + sign * 90) % 360);
        }
    }

    return (
        <div className="btn-group">
            <Button variant="light" size="sm" onClick={onClick(-1)}>
                <FontAwesomeIcon icon="undo-alt"/>
            </Button>
            <Button variant="light" size="sm" onClick={onClick(1)}>
                <FontAwesomeIcon icon="redo-alt"/>
            </Button>
        </div>
    );
}
