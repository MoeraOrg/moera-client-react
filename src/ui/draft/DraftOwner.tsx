import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { getOwnerName } from "state/node/selectors";
import { DraftPostingInfo, ExtDraftInfo } from "state/compose/state";
import NodeName from "ui/nodename/NodeName";

type Props = {
    draft: ExtDraftInfo | DraftPostingInfo;
} & ConnectedProps<typeof connector>;

const DraftOwner = ({draft, ownerName}: Props) => (
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

const connector = connect(
    (state: ClientState) => ({
        ownerName: getOwnerName(state)
    })
);

export default connector(DraftOwner);
