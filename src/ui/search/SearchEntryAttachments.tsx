import React from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, msAttachFile } from "ui/material-symbols";
import "./SearchEntryAttachments.css";

interface Props {
    count: number;
}

export default function SearchEntryAttachments({count}: Props) {
    const {t} = useTranslation();

    if (count === 0) {
        return null;
    }

    return (
        <p className="search-attachments">
            <Icon icon={msAttachFile} size="1.2em" className="icon"/>
            {t("count-files", {count})}
        </p>
    );
}
