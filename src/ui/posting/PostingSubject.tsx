import React from 'react';

import Jump from "ui/navigation/Jump";
import { ExtPostingInfo } from "state/postings/state";
import { ellipsize } from "util/text";
import "./PostingSubject.css";

const MAX_SHORT_TITLE = 120;

interface Props {
    posting: ExtPostingInfo;
    preview: boolean;
}

export default function PostingSubject({posting, preview}: Props) {
    let subjectHtml = preview && posting.bodyPreview?.subjectHtml
        ? posting.bodyPreview.subjectHtml
        : posting.body.subjectHtml;
    if (!subjectHtml) {
        return null;
    }
    if (preview) {
        subjectHtml = ellipsize(subjectHtml, MAX_SHORT_TITLE); // FIXME may break HTML entities
    }
    return (
        <div className="subject" dir="auto">
            <Jump href={`/post/${posting.id}`}><span dangerouslySetInnerHTML={{__html: subjectHtml}}/></Jump>
        </div>
    );
}
