import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { nodeCardCopyMention } from "state/nodecards/actions";
import { Button } from "ui/control";

type Props = {
    nodeName: string;
    fullName: string | null;
} & ConnectedProps<typeof connector>;

function CopyMentionButton({nodeName, fullName, nodeCardCopyMention}: Props) {
    const {t} = useTranslation();

    const onClick = () => nodeCardCopyMention(nodeName, fullName);

    return (
        <Button variant="outline-info" size="sm" onClick={onClick}>
            <FontAwesomeIcon icon="at"/> {t("mention")}
        </Button>
    );
}

const connector = connect(
    null,
    { nodeCardCopyMention }
);

export default connector(CopyMentionButton);
