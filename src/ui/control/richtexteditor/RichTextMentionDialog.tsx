import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ModalDialog } from "ui/control/ModalDialog";
import { NameSelector } from "ui/control/NameSelector";
import { NameListItem } from "util/names-list";

interface Props {
    onSubmit: (ok: boolean, values: NameListItem) => void;
}

export default function RichTextMentionDialog({onSubmit}: Props) {
    const [query, setQuery] = useState<string>("");
    const {t} = useTranslation();

    const onChange = (newQuery: string | null) => setQuery(newQuery ?? "");

    const onSubmitted = (success: boolean, data: NameListItem) => onSubmit(success, data);

    const onClose = () => onSubmit(false, {nodeName: query});

    return (
        <ModalDialog title={t("insert-mention")} centered={false} onClose={onClose}>
            <div className="modal-body">
                <NameSelector onSubmit={onSubmitted} onChange={onChange}/>
            </div>
        </ModalDialog>
    );
}
