import React, { useMemo } from 'react';
import cx from 'classnames';
import LinesEllipsis from 'react-lines-ellipsis';
import { formatDistanceToNow, formatISO, fromUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { getDateFnsLocale } from "i18n";
import { ExtDraftInfo } from "state/compose/state";
import { Button } from "ui/control";
import { Icon, msDelete } from "ui/material-symbols";
import "./ComposeDraftItem.css";

interface Props {
    draft: ExtDraftInfo;
    current: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function ComposeDraftItem({draft, current, onSelect, onDelete}: Props) {
    const {t} = useTranslation();

    const handleSelect = (e: React.MouseEvent) => {
        onSelect(draft.id);
        e.preventDefault();
    };

    const handleDelete = (e: React.MouseEvent) => {
        onDelete(draft.id);
        e.preventDefault();
    };

    const editDate = fromUnixTime(draft.editedAt ?? draft.createdAt);

    const text = useMemo(
        () => draft.text ? draft.text.replaceAll("<p>", "").replaceAll("</p>", " ") : t("no-text"),
        [draft.text, t]
    );

    return (
        <div key={draft.id} className={cx("dropdown-item", {"current": current})}>
            <div className="draft-info" onClick={handleSelect}>
                <div className="content">
                    {draft.subject && <b>{draft.subject} </b>}
                    <LinesEllipsis text={text} maxLine="3"/>
                </div>
                <time className="edited" dateTime={formatISO(editDate)}>
                    {formatDistanceToNow(editDate, {locale: getDateFnsLocale()})}
                </time>
            </div>
            <Button variant="tool" className="draft-delete" title={t("delete-draft")} onClick={handleDelete}>
                <Icon icon={msDelete} height={20} width={20}/>
            </Button>
        </div>
    );
}
