import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { PostingInfo } from "api";
import { ClientState } from "state/state";
import { nodeCardsPreload } from "state/nodecards/actions";
import { openSharingsDialog } from "state/sharingsdialog/actions";
import { isPostingSharingsPermitted } from "state/sharingsdialog/selectors";
import { useDispatcher } from "ui/hook";
import { Icon, msRepeat } from "ui/material-symbols";
import { RelNodeName } from "util/rel-node-name";
import "./PostingSharings.css";

interface Props {
    nodeName: RelNodeName | string;
    posting: PostingInfo;
}

export default function PostingSharings({nodeName, posting}: Props) {
    const permitted = useSelector((state: ClientState) => isPostingSharingsPermitted(state, posting));
    const dispatch = useDispatcher();
    const {t} = useTranslation();

    const sharingCount = posting.totalSharings;
    const receiverName = posting.receiverName;
    const principal = posting.receiverOperations?.viewSharings;

    useEffect(() => {
        if (
            sharingCount != null && sharingCount > 0 && receiverName != null
            && (principal === "subscribed" || principal?.startsWith("f:"))
        ) {
            dispatch(nodeCardsPreload([receiverName]));
        }
    }, [dispatch, principal, receiverName, sharingCount]);

    if (sharingCount == null || sharingCount <= 0) {
        return null;
    }

    return (
        <button type="button" className="posting-sharings" title={t("sharings")} disabled={!permitted}
                onClick={() => dispatch(openSharingsDialog(nodeName, posting.id))}>
            <Icon icon={msRepeat} size="1.2em"/>
            <span className="caption">{sharingCount}</span>
        </button>
    );
}
