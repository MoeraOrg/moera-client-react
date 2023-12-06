import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import NodeNamePopup from "ui/nodename/NodeNamePopup";
import { NameDisplayMode } from "ui/types";
import Jump from "ui/navigation/Jump";
import { mentionName } from "util/misc";

interface Props {
    name: string | null;
    fullName: string | null;
    text: string;
}

export default function NodeNameMention({name, fullName, text}: Props) {
    const mode = useSelector((state: ClientState) => getSetting(state, "full-name.display") as NameDisplayMode);

    if (!name) {
        return null;
    }

    let content: string;
    const mention = mentionName(name);
    if (text !== mention) {
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
        content = text;
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
