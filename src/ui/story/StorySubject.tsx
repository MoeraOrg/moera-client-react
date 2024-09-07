import React from 'react';

import Jump from "ui/navigation/Jump";
import "./StorySubject.css";

interface Props {
    subjectHtml?: string | null;
    href?: string | null;
}

export default function StorySubject({subjectHtml, href}: Props) {
    if (!subjectHtml) {
        return null;
    }
    return (
        <div className="subject" dir="auto">
            {href != null ?
                <Jump href={href}><span dangerouslySetInnerHTML={{__html: subjectHtml}}/></Jump>
            :
                <span dangerouslySetInnerHTML={{__html: subjectHtml}}/>
            }
        </div>
    );
}
