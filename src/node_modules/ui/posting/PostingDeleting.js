import React from 'react';

import { Loading } from "ui/control";
import "./PostingDeleting.css";

const PostingDeleting = () => (
    <span className="deleting">Deleting... <Loading /></span>
);

export default PostingDeleting;
