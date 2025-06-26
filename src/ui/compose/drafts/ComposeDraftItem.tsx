import React, { useMemo } from 'react';
import cx from 'classnames';
import LinesEllipsis from 'react-lines-ellipsis';
import { formatISO, fromUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { tDistanceToNow } from "i18n/time";
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
        () => getDraftText(draft) || t("no-text"),
        [draft, t]
    );

    return (
        <div key={draft.id} className={cx("dropdown-item", {"current": current})}>
            <div className="draft-info" onClick={handleSelect}>
                <div className="content">
                    {draft.subject && <b>{draft.subject} </b>}
                    <LinesEllipsis text={text} maxLine="3"/>
                </div>
                <time className="edited" dateTime={formatISO(editDate)}>
                    {tDistanceToNow(editDate, t)}
                </time>
            </div>
            <Button variant="tool" className="draft-delete" title={t("delete-draft")} onClick={handleDelete}>
                <Icon icon={msDelete} size={16}/>
            </Button>
        </div>
    );
}

function getDraftText(draft: ExtDraftInfo): string {
    let text = (draft.text ?? "").replaceAll("<p>", "").replaceAll("</p>", " ").trim();
    if (draft.media) {
        const linkMedia = new Set(draft.body.linkPreviews?.map(lp => lp.imageHash));
        let hasGallery = false;
        for (const media of draft.media) {
            if (media.media?.hash == null || linkMedia.has(media.media.hash)) {
                continue;
            }
            if (media.media.textContent) {
                text += " " + media.media.textContent;
            } else {
                hasGallery = true;
            }
        }
        if (hasGallery) {
            text += " " + String.fromCodePoint(0x1f5bc);
        }
    }
    return text.trim();
}
