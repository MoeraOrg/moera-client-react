import React from 'react';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import "./AvatarShape.css";

export default function AvatarShape({value, onChange}) {
    const onClick = shape => () => {
        if (onChange) {
            onChange(shape);
        }
    }

    return (
        <div className="avatar-shape" title="Avatar shape">
            {["circle", "square"].map(shape =>
                <button className={cx({"active" : value === shape})} onClick={onClick(shape)} key={shape}>
                    <FontAwesomeIcon icon={["far", shape]}/>
                </button>
            )}
        </div>
    );
}

AvatarShape.propTypes = {
    value: PropType.string,
    onChange: PropType.func
}
