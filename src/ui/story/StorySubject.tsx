import React from 'react';

import Jump from "ui/navigation/Jump";
import "./StorySubject.css";
import { RelNodeName } from "util/rel-node-name";

interface Props {
    subjectHtml?: string | null;
    nodeName?: RelNodeName | string;
    href?: string | null;
}

export default function StorySubject({subjectHtml, nodeName, href}: Props) {
    if (!subjectHtml) {
        return null;
    }
    return (
        <div className="subject" dir="auto">
            {href != null ?
                <Jump nodeName={nodeName} href={href}><span dangerouslySetInnerHTML={{__html: subjectHtml}}/></Jump>
            :
                <span dangerouslySetInnerHTML={{__html: subjectHtml}}/>
            }
        </div>
    );
}
