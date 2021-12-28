import React from 'react';

import { ExtPostingInfo } from "state/postings/state";
import EntryHtml from "ui/entry/EntryHtml";

interface Props {
    posting: ExtPostingInfo | null;
}

const LightBoxCaption = ({posting}: Props) => (
    posting != null ?
        <div className="lightbox-caption">
            <EntryHtml postingId={posting.id} html={posting.body.text}/>
        </div>
    :
        null
);

export default LightBoxCaption;
