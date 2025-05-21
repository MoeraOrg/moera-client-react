import React from 'react';
import { useSelector } from 'react-redux';

import { SearchNodeInfo } from "api";
import { NodeName as NodeNameFormat } from "api/node-name";
import { getHomeOwnerName } from "state/home/selectors";
import { AvatarWithPopup, SubscribeButton } from "ui/control";
import NodeName from "ui/nodename/NodeName";

interface Props {
    node: SearchNodeInfo;
}

export default function SearchNode({node}: Props) {
    const homeOwnerName = useSelector(getHomeOwnerName);
    return (
        <>
            <div className="person-avatar">
                <AvatarWithPopup ownerName={node.nodeName} ownerFullName={node.fullName}
                                 avatar={node.avatar} size={40}/>
            </div>
            <div className="person-details">
                <NodeName name={node.nodeName} fullName={node.fullName}/><br/>
                <span className="raw-node-name">{NodeNameFormat.shorten(node.nodeName)}</span><br/>
                <span className="title">{node.title}</span>
            </div>
            <div className="person-subscribe">
                {node.nodeName !== homeOwnerName &&
                    <SubscribeButton nodeName={node.nodeName} feedName="timeline"/>
                }
            </div>
        </>
    );
}
