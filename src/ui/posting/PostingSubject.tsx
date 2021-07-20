import React from 'react';

import Jump from "ui/navigation/Jump";
import { ExtPostingInfo } from "state/postings/state";
import "./PostingSubject.css";

interface Props {
    posting: ExtPostingInfo;
    preview: boolean;
}

export default function PostingSubject({posting, preview}: Props) {
    const subjectHtml = preview && posting.bodyPreview?.subjectHtml
        ? posting.bodyPreview.subjectHtml
        : posting.body.subjectHtml;
    if (!subjectHtml) {
        return null;
    }
    return (
        <div className="subject">
            <Jump href={`/post/${posting.id}`}><span dangerouslySetInnerHTML={{__html: subjectHtml}}/></Jump>
        </div>
    );
}
