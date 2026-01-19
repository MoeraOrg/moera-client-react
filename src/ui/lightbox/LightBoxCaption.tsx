import React from 'react';

import { ExtPostingInfo } from "state/postings/state";
import EntryHtml from "ui/entry/EntryHtml";

interface Props {
    posting: ExtPostingInfo;
}

const LightBoxCaption = ({posting}: Props) => (
    <div className="lightbox-caption">
        <EntryHtml postingId={posting.id} html={posting.body.text}/>
    </div>
);

export default LightBoxCaption;
