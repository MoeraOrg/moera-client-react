import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { reactionVerify } from "state/reactionsdialog/actions";
import { getReactionVerificationStatus } from "state/reactionsdialog/selectors";
import { useDispatcher } from "ui/hook";
import { SignatureVerifyButton } from "ui/control";

interface Props {
    postingId: string;
    commentId: string | null;
    ownerName: string;
}

export default function ReactionVerifyButton({postingId, commentId, ownerName}: Props) {
    const connectedToHome = useSelector(isConnectedToHome);
    const status = useSelector((state: ClientState) => getReactionVerificationStatus(state, ownerName));
    const dispatch = useDispatcher();

    const onVerify = () => dispatch(reactionVerify(postingId, commentId, ownerName));

    return connectedToHome ? <SignatureVerifyButton status={status} onVerify={onVerify}/> : null;
}
