import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { postingOperationsUpdate } from "state/postings/actions";
import { Principal, PrincipalSelect } from "ui/control";
import "./PostingVisibility.css";

type Props = {
    id: string;
    principal: string | null | undefined;
    editable: boolean;
} & ConnectedProps<typeof connector>;

const PostingVisibility = ({id, principal, editable, postingOperationsUpdate}: Props) => {
    const onChange = (value: string) => postingOperationsUpdate(id, "", {view: value});

    return (
        <span className="visibility">
            &middot;
            {editable ?
                <PrincipalSelect value={principal} onChange={onChange}/>
            :
                <Principal value={principal}/>
            }
        </span>
    );
}

const connector = connect(
    null,
    { postingOperationsUpdate }
);

export default connector(PostingVisibility);
