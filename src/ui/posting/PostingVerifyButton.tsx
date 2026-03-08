import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { postingVerify } from "state/postings/actions";
import { getPostingVerificationStatus } from "state/postings/selectors";
import { useDispatcher } from "ui/hook";
import { SignatureVerifyButton } from "ui/control";
import { REL_CURRENT } from "util/rel-node-name";

interface Props {
    id: string;
}

export default function PostingVerifyButton({id}: Props) {
    const connectedToHome = useSelector(isConnectedToHome);
    const status = useSelector((state: ClientState) => getPostingVerificationStatus(state, id, REL_CURRENT));
    const dispatch = useDispatcher();

    if (!connectedToHome) {
        return null;
    }

    const onVerify = () => dispatch(postingVerify(id, REL_CURRENT));

    return <SignatureVerifyButton status={status} onVerify={onVerify}/>;
}
