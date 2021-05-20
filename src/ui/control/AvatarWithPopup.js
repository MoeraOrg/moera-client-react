import React from 'react';
import PropType from 'prop-types';

import Jump from "ui/navigation/Jump";
import NodeNamePopup from "ui/nodename/NodeNamePopup";
import { Avatar } from "ui/control/Avatar";

export const AvatarWithPopup = ({ownerName, ownerFullName, avatar, nodeName, size}) => (
    <Jump nodeName={ownerName} href="/profile">
        <NodeNamePopup nodeName={ownerName} fullName={ownerFullName}>
            {(ref, mainEnter, mainLeave, mainTouch) =>
                <Avatar avatar={avatar} size={size} nodeName={nodeName} imageRef={ref}
                        onMouseEnter={mainEnter} onMouseLeave={mainLeave} onTouchStart={mainTouch}/>
            }
        </NodeNamePopup>
    </Jump>
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
