import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from "ui/control";
import { nodeCardCopyMention } from "state/nodecards/actions";

type Props = {
    nodeName: string;
    fullName: string | null;
} & ConnectedProps<typeof connector>;

function CopyMentionButton({nodeName, fullName, nodeCardCopyMention}: Props) {
    const onClick = () => nodeCardCopyMention(nodeName, fullName);

    return (
        <Button variant="outline-info" size="sm" onClick={onClick}>
            <FontAwesomeIcon icon="at"/>
            {" "}Mention
        </Button>
    );
}

const connector = connect(
    null,
    { nodeCardCopyMention }
);

export default connector(CopyMentionButton);
