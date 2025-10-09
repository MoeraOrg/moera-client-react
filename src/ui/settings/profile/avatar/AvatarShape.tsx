import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from "ui/control";
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
        <div className="avatar-shape">
            {(["circle", "square"] as Shape[]).map(shape =>
                <Button
                    variant="tool"
                    active={value === shape}
                    title={t(`avatar-shape.${shape}`)}
                    onClick={onClick(shape)}
                    key={shape}
                >
                    <Icon icon={SHAPE_ICONS[shape]} size={20}/>
                </Button>
            )}
        </div>
    );
}
