import React from 'react';

import NodeNameText from "ui/nodename/NodeNameText";
import { NameDisplayMode } from "ui/types";

interface Props {
    name?: string | null;
    fullName?: string | null;
    mode?: NameDisplayMode | null;
}

const InstantMention = ({name, fullName, mode}: Props) => (
    <span className="node-name">
        <NodeNameText nodeName={name} fullName={fullName} mode={mode ?? undefined}/>
    </span>
);

export default InstantMention;
