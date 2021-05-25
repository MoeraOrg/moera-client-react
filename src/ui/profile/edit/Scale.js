import React from 'react';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./Scale.css";

export default function Scale({max, value, onChange}) {
    const onClick = sign => () => {
        if (onChange) {
            let v = value + sign * (max - 1) / 100;
            v = Math.max(Math.min(v, max), 1)
            if (v !== value) {
                onChange(v);
            }
        }
    }

    const onScaleChange = event => {
        if (onChange) {
            onChange(event.target.value);
        }
    }

    return (
        <div className="scale">
            <button className="btn btn-light btn-sm" onClick={onClick(-1)} disabled={value === 1}>
                <FontAwesomeIcon icon="minus"/>
            </button>
            <input type="range" className="form-control-range" min={1} max={max} step="any" value={value}
                   onChange={onScaleChange}/>
            <button className="btn btn-light btn-sm" onClick={onClick(1)} disabled={value === max}>
                <FontAwesomeIcon icon="plus"/>
            </button>
        </div>
    );
}

Scale.propTypes = {
    max: PropType.number,
    value: PropType.number,
    onChange: PropType.func
}

Scale.defaultProps = {
    max: 1
}
