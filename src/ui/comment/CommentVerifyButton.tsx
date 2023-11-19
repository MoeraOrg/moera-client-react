import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { isConnectedToHome } from "state/home/selectors";
import { commentVerify } from "state/detailedposting/actions";
import { ExtCommentInfo } from "state/detailedposting/state";
import { SignatureVerifyButton } from "ui/control";

interface Props {
    comment: ExtCommentInfo;
}

export default function CommentVerifyButton({comment}: Props) {
    const connectedToHome = useSelector(isConnectedToHome);
    const dispatch = useDispatch();

    if (!connectedToHome || !comment.signature) {
        return null;
    }

    const onVerify = () => dispatch(commentVerify(comment.id));

    return <SignatureVerifyButton status={comment.verificationStatus} onVerify={onVerify}/>;
}
