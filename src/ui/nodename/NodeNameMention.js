import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';

import NodeNamePopup from "ui/nodename/NodeNamePopup";
import Jump from "ui/navigation/Jump";
import { getSetting } from "state/settings/selectors";
import { mentionName } from "util/misc";

const NodeNameMention = ({name, fullName, text, mode}) => {
    if (!name) {
        return null;
    }

    let content;
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
};

NodeNameMention.propTypes = {
    name: PropType.string,
    fullName: PropType.string,
    text: PropType.string
};

export default connect(
    state => ({
        mode: getSetting(state, "full-name.display")
    })
)(NodeNameMention);
