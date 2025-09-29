import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ModalDialog, NameSelector } from "ui/control";
import { useParent } from "ui/hook";
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

    const {overlayId: parentOverlayId} = useParent();

    return (
        <ModalDialog title={t("insert-mention")} parentOverlayId={parentOverlayId} centered={false} onClose={onClose}>
            <div className="modal-body">
                <NameSelector onSubmit={onSubmitted} onChange={onChange}/>
            </div>
        </ModalDialog>
    );
}
