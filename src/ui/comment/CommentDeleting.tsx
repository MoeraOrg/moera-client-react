import React from 'react';

import { Loading } from "ui/control";
import "./CommentDeleting.css";

const CommentDeleting = () => (
    <span className="deleting">Deleting... <Loading/></span>
);

export default CommentDeleting;
