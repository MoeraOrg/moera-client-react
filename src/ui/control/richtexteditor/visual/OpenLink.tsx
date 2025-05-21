import React from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, msOpenInNew } from "ui/material-symbols";
import "./OpenLink.css";

interface Props {
    href: string;
}

export default function OpenLink({href}: Props) {
    const {t} = useTranslation();

    const onClick = (event: React.MouseEvent) => {
        window.open(href, "_blank");
        event.preventDefault();
    }

    return (
        <button type="button" className="open-link" title={t("open-link")} contentEditable={false} onClick={onClick}>
            <Icon icon={msOpenInNew} size={16}/>
        </button>
    );
}
