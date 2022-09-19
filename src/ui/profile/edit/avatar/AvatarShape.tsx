import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import "./AvatarShape.css";

interface Props {
    value: string;
    onChange?: (shape: string) => void;
}

export default function AvatarShape({value, onChange}: Props) {
    const {t} = useTranslation();

    const onClick = (shape: string) => () => {
        if (onChange) {
            onChange(shape);
        }
    }

    return (
        <div className="avatar-shape" title={t("avatar-shape")}>
            {["circle", "square"].map(shape =>
                <button className={cx({"active" : value === shape})} onClick={onClick(shape)} key={shape}>
                    <FontAwesomeIcon icon={["far", shape as any]}/>
                </button>
            )}
        </div>
    );
}
