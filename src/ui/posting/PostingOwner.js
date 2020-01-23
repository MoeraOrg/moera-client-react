import React from 'react';
import { connect } from 'react-redux';

import { NodeName } from "ui/control";
import PostingVerifyButton from "ui/posting/PostingVerifyButton";
import "./PostingOwner.css";

const PostingOwner = ({posting, nodeOwnerName}) => (
    <span className="owner">
        <NodeName name={posting.ownerName}/>
        {" "}<PostingVerifyButton id={posting.id}/>
        {posting.receiverName !== nodeOwnerName &&
            <>
                <span className="arrow">{" "}&#x25b8;{" "}</span>
                <NodeName name={posting.receiverName}/>
            </>
        }
    </span>
);

export default connect(
    state => ({
        nodeOwnerName: state.owner.name
    })
)(PostingOwner);
