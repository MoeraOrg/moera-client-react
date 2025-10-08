import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { Icon, MaterialSymbol, msCircle, msCropSquare } from "ui/material-symbols";

type Shape = "circle" | "square";
const SHAPE_ICONS: Record<Shape, MaterialSymbol> = {
    "circle": msCircle,
    "square": msCropSquare
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
                <button className={cx("btn", "btn-tool", {"active" : value === shape})} onClick={onClick(shape)}
                        key={shape}>
                    <Icon icon={SHAPE_ICONS[shape]} size={24}/>
                </button>
            )}
        </div>
    );
}
