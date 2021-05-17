import React from 'react';

import Jump from "ui/navigation/Jump";
import "./PostingSubject.css";

export default function PostingSubject({posting, preview}) {
    const subjectHtml = preview && posting.bodyPreview.subjectHtml
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
