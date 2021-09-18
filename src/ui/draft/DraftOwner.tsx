import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import NodeName from "ui/nodename/NodeName";
import PostingVerifyButton from "ui/posting/PostingVerifyButton";
import { ClientState } from "state/state";
import { getOwnerName } from "state/owner/selectors";
import { DraftPostingInfo, ExtDraftInfo } from "state/compose/state";

type Props = {
    draft: ExtDraftInfo | DraftPostingInfo;
} & ConnectedProps<typeof connector>;

const DraftOwner = ({draft, ownerName}: Props) => (
    <span className="owner">
        <NodeName name={ownerName} fullName={draft.ownerFullName} avatar={draft.ownerAvatar}/>
        {" "}{draft.id && <PostingVerifyButton id={draft.id}/>}
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
