import React from 'react';

import { NodeName } from "ui/control";
import PostingVerifyButton from "ui/posting/PostingVerifyButton";
import "./PostingOwner.css";

const PostingOwner = ({posting}) => (
    <span className="owner">
        <NodeName name={posting.ownerName} fullName={posting.ownerFullName}/>
        {" "}<PostingVerifyButton id={posting.id}/>
        {posting.receiverName && posting.receiverName !== posting.ownerName &&
            <>
                <span className="arrow">{" "}&#x25b8;{" "}</span>
                <NodeName name={posting.receiverName} fullName={posting.receiverFullName}/>
            </>
        }
    </span>
);

export default PostingOwner;
