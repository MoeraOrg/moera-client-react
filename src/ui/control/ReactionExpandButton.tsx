import React from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, msExpandCircleDownFilled40, msExpandCircleUpFilled40 } from "ui/material-symbols";
import "./ReactionExpandButton.css";

interface Props {
    expanded: boolean;
    onClick: () => void;
}

export function ReactionExpandButton({expanded, onClick}: Props) {
    const {t} = useTranslation();

    return (
        <button className="choice expand" onClick={() => onClick()} title={expanded ? t("less") : t("more")}>
            <Icon icon={expanded ? msExpandCircleUpFilled40 : msExpandCircleDownFilled40} size="40"/>
        </button>
    );
}
