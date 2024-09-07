import React from 'react';

import { ExtPostingInfo } from "state/postings/state";
import StorySubject from "ui/story/StorySubject";

interface Props {
    posting: ExtPostingInfo;
    preview: boolean;
}

export default function PostingSubject({posting, preview}: Props) {
    const subjectHtml = preview ? posting.bodyPreview?.subjectHtml : posting.body.subjectHtml;
    return <StorySubject subjectHtml={subjectHtml} href={`/post/${posting.id}`}/>
}
