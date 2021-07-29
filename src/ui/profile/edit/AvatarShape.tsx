import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import "./AvatarShape.css";

interface Props {
    value: string;
    onChange?: (shape: string) => void;
}

export default function AvatarShape({value, onChange}: Props) {
    const onClick = (shape: string) => () => {
        if (onChange) {
            onChange(shape);
        }
    }

    return (
        <div className="avatar-shape" title="Avatar shape">
            {["circle", "square"].map(shape =>
                <button className={cx({"active" : value === shape})} onClick={onClick(shape)} key={shape}>
                    <FontAwesomeIcon icon={["far", shape as any]}/>
                </button>
            )}
        </div>
    );
}
