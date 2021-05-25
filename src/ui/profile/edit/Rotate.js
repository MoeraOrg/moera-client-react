import React from 'react';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from "ui/control";

export default function Rotate({value, onChange}) {
    const onClick = sign => () => {
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

Rotate.propTypes = {
    value: PropType.number,
    onChange: PropType.func
}
