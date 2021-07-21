import React from 'react';

import Jump from "ui/navigation/Jump";
import NodeNamePopup from "ui/nodename/NodeNamePopup";
import { Avatar } from "ui/control/Avatar";
import { AvatarImage } from "api/node/api-types";

interface Props {
    ownerName: string;
    ownerFullName?: string | null;
    avatar?: AvatarImage | null;
    nodeName?: string;
    size: number;
}

export const AvatarWithPopup = ({ownerName, ownerFullName, avatar = null, nodeName, size}: Props) => (
    <NodeNamePopup nodeName={ownerName} fullName={ownerFullName} avatar={avatar} avatarNodeName={nodeName}>
        {(ref, mainEnter, mainLeave, mainTouch) =>
            <Jump nodeName={ownerName} href="/profile">
                <Avatar avatar={avatar} ownerName={ownerName} size={size} nodeName={nodeName} imageRef={ref}
                        onMouseEnter={mainEnter} onMouseLeave={mainLeave} onTouchStart={mainTouch}/>
            </Jump>
        }
    </NodeNamePopup>
);
