import React from 'react';

import "./PostingSubject.css";
import { connect } from "react-redux";
import { goToPosting } from "state/navigation/actions";

const PostingSubject = ({posting, preview, rootLocation, goToPosting}) => {
    const subject = preview && posting.bodyPreview.subject ? posting.bodyPreview.subject : posting.body.subject;
    if (!subject) {
        return null;
    }
    return (
        <div className="subject"><a href={`${rootLocation}/post/${posting.id}`} onClick={e => {
            goToPosting(posting.id);
            e.preventDefault();
        }}>{subject}</a></div>
    );
};

export default connect(
    state => ({
        rootLocation: state.node.root.location,
    }),
    { goToPosting }
)(PostingSubject);
