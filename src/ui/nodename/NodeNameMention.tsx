import React from 'react';

import { NodeName } from "api";
import NodeNamePopup from "ui/nodename/NodeNamePopup";
import { useNameDisplayMode } from "ui/nodename/hooks";
import Jump from "ui/navigation/Jump";

interface Props {
    name: string | null;
    fullName: string | null;
    text: string;
}

export default function NodeNameMention({name, fullName, text}: Props) {
    const mode = useNameDisplayMode();

    if (!name) {
        return null;
    }

    let content: string;
    const mention = "@" + NodeName.shorten(name);
    if (text && text !== mention) {
        switch (mode) {
            case "name":
                content = mention;
                break;
            case "full-name":
                content = text;
                break;
            case "both":
                content = `${text} (${mention})`;
                break;
            default:
                content = "?";
        }
    } else {
        content = mention;
    }

    return (
        <NodeNamePopup nodeName={name} fullName={fullName}>
            {ref =>
                <Jump nodeName={name} href="/" ref={ref}>
                    {content}
                </Jump>
            }
        </NodeNamePopup>
    );
}
