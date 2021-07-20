import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import NodeNamePopup from "ui/nodename/NodeNamePopup";
import { NameDisplayMode } from "ui/types";
import Jump from "ui/navigation/Jump";
import { getSetting } from "state/settings/selectors";
import { ClientState } from "state/state";
import { mentionName } from "util/misc";

type Props = {
    name: string | null;
    fullName: string | null;
    text: string;
} & ConnectedProps<typeof connector>;

function NodeNameMention({name, fullName, text, mode}: Props) {
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
            {(ref, mainEnter, mainLeave, mainTouch) =>
                <Jump nodeName={name} href="/" anchorRef={ref} onMouseEnter={mainEnter} onMouseLeave={mainLeave}
                      onTouchStart={mainTouch}>
                    {content}
                </Jump>
            }
        </NodeNamePopup>
    );
}

const connector = connect(
    (state: ClientState) => ({
        mode: getSetting(state, "full-name.display") as NameDisplayMode
    })
);

export default connector(NodeNameMention);
