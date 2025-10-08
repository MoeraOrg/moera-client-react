import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from "ui/control";
import { Icon, msRotate90DegreesCcw, msRotate90DegreesCw } from "ui/material-symbols";

interface Props {
    value: number;
    onChange?: (angle: number) => void;
}

export default function Rotate({value, onChange}: Props) {
    const {t} = useTranslation();

    const onClick = (sign: 1 | -1) => () => {
        if (onChange) {
            onChange((value + sign * 90) % 360);
        }
    }

    return (
        <div className="btn-group">
            <Button variant="tool" title={t("rotate-left")} onClick={onClick(-1)}>
                <Icon icon={msRotate90DegreesCcw} size={24}/>
            </Button>
            <Button variant="tool" title={t("rotate-right")} onClick={onClick(1)}>
                <Icon icon={msRotate90DegreesCw} size={24}/>
            </Button>
        </div>
    );
}
