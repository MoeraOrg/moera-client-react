import React from 'react';

import { CommentInfo } from "api/node/api-types";
import { Principal } from "ui/control";
import "./CommentVisibility.css";

interface Props {
    comment: CommentInfo;
}

const CommentVisibility = ({comment}: Props) => (
    (comment.operations?.view ?? "public") !== "public" ?
        <span className="visibility">
            &middot;
            <Principal value={comment.operations?.view}/>
        </span>
    :
        null
);

export default CommentVisibility;
