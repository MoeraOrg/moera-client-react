import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from "ui/control";
import { nodeCardCopyMention } from "state/nodecards/actions";

function CopyMentionButton({nodeName, fullName, nodeCardCopyMention}) {
    const onClick = useCallback(
        () => nodeCardCopyMention(nodeName, fullName),
        [nodeName, fullName, nodeCardCopyMention]
    );

    return (
        <Button variant="outline-info" size="sm" onClick={onClick}>
            <FontAwesomeIcon icon="at"/>
            {" "}Mention
        </Button>
    );
}

export default connect(
    null,
    { nodeCardCopyMention }
)(CopyMentionButton);
