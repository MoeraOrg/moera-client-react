import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircle, faSquare } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';

import "ui/settings/profile/avatar/AvatarShape.css";

type Shape = "circle" | "square";
const SHAPE_ICONS: Record<Shape, IconProp> = {
    "circle": faCircle,
    "square": faSquare
};

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
            {(["circle", "square"] as Shape[]).map(shape =>
                <button className={cx({"active" : value === shape})} onClick={onClick(shape)} key={shape}>
                    <FontAwesomeIcon icon={SHAPE_ICONS[shape]}/>
                </button>
            )}
        </div>
    );
}
