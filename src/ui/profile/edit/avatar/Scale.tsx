import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { Button } from "ui/control";
import "./Scale.css";

interface Props {
    max?: number;
    value: number;
    onChange: (scale: number) => void;
}

export default function Scale({max = 1, value, onChange}: Props) {
    const {t} = useTranslation();

    const onClick = (sign: 1 | -1) => () => {
        if (onChange) {
            let v = value + sign * (max - 1) / 100;
            v = Math.max(Math.min(v, max), 1)
            if (v !== value) {
                onChange(v);
            }
        }
    }

    const onScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(parseFloat(event.target.value));
        }
    }

    return (
        <div className="scale">
            <Button variant="light" size="sm" title={t("zoom-out")} onClick={onClick(-1)} disabled={value === 1}>
                <FontAwesomeIcon icon="minus"/>
            </Button>
            <input type="range" className="form-control-range" min={1} max={max} step="any" value={value}
                   onChange={onScaleChange}/>
            <Button variant="light" size="sm" title={t("zoom-in")} onClick={onClick(1)} disabled={value === max}>
                <FontAwesomeIcon icon="plus"/>
            </Button>
        </div>
    );
}
