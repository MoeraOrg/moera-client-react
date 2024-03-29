import React from 'react';

import { AvatarImage } from "api";
import Jump from "ui/navigation/Jump";
import NodeNamePopup from "ui/nodename/NodeNamePopup";
import { Avatar } from "ui/control/Avatar";
import { RelNodeName } from "util/rel-node-name";

interface Props {
    ownerName: string;
    ownerFullName?: string | null;
    avatar?: AvatarImage | null;
    nodeName?: RelNodeName | string;
    size: number;
    className?: string;
}

export const AvatarWithPopup = ({ownerName, ownerFullName, avatar = null, nodeName, size, className}: Props) => (
    <NodeNamePopup nodeName={ownerName} fullName={ownerFullName} avatar={avatar} avatarNodeName={nodeName}>
        {ref =>
            <Jump nodeName={ownerName} href="/profile" className={className}>
                <Avatar avatar={avatar} ownerName={ownerName} size={size} nodeName={nodeName} ref={ref}/>
            </Jump>
        }
    </NodeNamePopup>
);
