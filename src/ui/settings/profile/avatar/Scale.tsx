import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from "ui/control";
import { Icon, msAdd, msRemove } from "ui/material-symbols";
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
            <Button variant="silent" size="sm" title={t("zoom-out")} onClick={onClick(-1)} disabled={value === 1}>
                <Icon icon={msRemove} size={16}/>
            </Button>
            <input type="range" className="form-range" min={1} max={max} step="any" value={value}
                   onChange={onScaleChange}/>
            <Button variant="silent" size="sm" title={t("zoom-in")} onClick={onClick(1)} disabled={value === max}>
                <Icon icon={msAdd} size={16}/>
            </Button>
        </div>
    );
}
