import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SignatureVerifyButton } from "ui/control";
import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { reactionVerify } from "state/reactionsdialog/actions";
import { getReactionVerificationStatus } from "state/reactionsdialog/selectors";

interface Props {
    postingId: string;
    commentId: string | null;
    ownerName: string;
}

export default function ReactionVerifyButton({postingId, commentId, ownerName}: Props) {
    const connectedToHome = useSelector(isConnectedToHome);
    const status = useSelector((state: ClientState) => getReactionVerificationStatus(state, ownerName));
    const dispatch = useDispatch();

    const onVerify = () => dispatch(reactionVerify(postingId, commentId, ownerName));

    return connectedToHome ? <SignatureVerifyButton status={status} onVerify={onVerify}/> : null;
}
