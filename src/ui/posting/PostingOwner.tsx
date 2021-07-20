import React from 'react';

import { PostingInfo } from "api/node/api-types";
import NodeName from "ui/nodename/NodeName";
import PostingVerifyButton from "ui/posting/PostingVerifyButton";
import "./PostingOwner.css";

interface Props {
    posting: PostingInfo;
}

const PostingOwner = ({posting}: Props) => (
    <span className="owner">
        <NodeName name={posting.ownerName} fullName={posting.ownerFullName} avatar={posting.ownerAvatar}/>
        {" "}<PostingVerifyButton id={posting.id}/>
        {posting.receiverName && posting.receiverName !== posting.ownerName &&
            <>
                <span className="arrow">{" "}&#x25b8;{" "}</span>
                <NodeName name={posting.receiverName} fullName={posting.receiverFullName}
                          avatar={posting.receiverAvatar}/>
            </>
        }
    </span>
);

export default PostingOwner;
