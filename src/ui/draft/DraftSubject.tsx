import React from 'react';

import { ExtDraftInfo } from "state/compose/state";
import Jump from "ui/navigation/Jump";

interface Props {
    draft: ExtDraftInfo;
}

export default function DraftSubject({draft}: Props) {
    if (!draft.subjectHtml) {
        return null;
    }
    return (
        <div className="subject">
            <Jump href={`/post/${draft.id}`}><span dangerouslySetInnerHTML={{__html: draft.subjectHtml}}/></Jump>
        </div>
    );
}
