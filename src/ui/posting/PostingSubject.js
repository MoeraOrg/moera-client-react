import React from 'react';

import Jump from "ui/navigation/Jump";
import "./PostingSubject.css";

const PostingSubject = ({posting, preview}) => {
    const subject = preview && posting.bodyPreview.subject ? posting.bodyPreview.subject : posting.body.subject;
    if (!subject) {
        return null;
    }
    return (
        <div className="subject"><Jump href={`/post/${posting.id}`}>{subject}</Jump></div>
    );
};

export default PostingSubject;
