import React from 'react';
import { useSelector } from 'react-redux';
import { getOwnerName } from "state/node/selectors";
import { DraftPostingInfo, ExtDraftInfo } from "state/compose/state";
import NodeName from "ui/nodename/NodeName";

interface Props {
    draft: ExtDraftInfo | DraftPostingInfo;
}

export default function DraftOwner({draft}: Props) {
    const ownerName = useSelector(getOwnerName);

    return (
        <span className="owner">
            <NodeName name={ownerName} fullName={draft.ownerFullName} avatar={draft.ownerAvatar} popup={false}/>
                {draft.receiverName && draft.receiverName !== ownerName &&
                    <>
                        <span className="arrow">{" "}&#x25b8;{" "}</span>
                        <NodeName name={draft.receiverName}/>
                    </>
                }
        </span>
    );
}
