import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { nodeCardCopyMention } from "state/nodecards/actions";
import { Button } from "ui/control";

interface Props {
    nodeName: string;
    fullName: string | null;
}

export default function CopyMentionButton({nodeName, fullName}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClick = () => dispatch(nodeCardCopyMention(nodeName, fullName));

    return (
        <Button variant="outline-info" size="sm" onClick={onClick}>
            <FontAwesomeIcon icon={faAt}/> {t("mention")}
        </Button>
    );
}
