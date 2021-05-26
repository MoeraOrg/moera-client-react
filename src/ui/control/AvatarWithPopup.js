import React from 'react';
import PropType from 'prop-types';

import Jump from "ui/navigation/Jump";
import NodeNamePopup from "ui/nodename/NodeNamePopup";
import { Avatar } from "ui/control/Avatar";

export const AvatarWithPopup = ({ownerName, ownerFullName, avatar, nodeName, size}) => (
    <NodeNamePopup nodeName={ownerName} fullName={ownerFullName} avatar={avatar} avatarNodeName={nodeName}>
        {(ref, mainEnter, mainLeave, mainTouch) =>
            <Jump nodeName={ownerName} href="/profile">
                <Avatar avatar={avatar} size={size} nodeName={nodeName} imageRef={ref}
                        onMouseEnter={mainEnter} onMouseLeave={mainLeave} onTouchStart={mainTouch}/>
            </Jump>
        }
    </NodeNamePopup>
);

AvatarWithPopup.propTypes = {
    ownerName: PropType.string,
    ownerFullName: PropType.string,
    avatar: PropType.shape({
        path: PropType.string,
        shape: PropType.string
    }),
    nodeName: PropType.string,
    size: PropType.number
}
