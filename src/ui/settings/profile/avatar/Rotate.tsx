import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt, faUndoAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { Button } from "ui/control";

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
            <Button variant="light" size="sm" title={t("rotate-left")} onClick={onClick(-1)}>
                <FontAwesomeIcon icon={faUndoAlt}/>
            </Button>
            <Button variant="light" size="sm" title={t("rotate-right")} onClick={onClick(1)}>
                <FontAwesomeIcon icon={faRedoAlt}/>
            </Button>
        </div>
    );
}
