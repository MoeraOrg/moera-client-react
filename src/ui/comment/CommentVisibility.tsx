import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { CommentInfo } from "api";
import { ClientState } from "state/state";
import { isPermitted } from "state/node/selectors";
import { getDetailedPosting } from "state/detailedposting/selectors";
import { Principal } from "ui/control";
import "./CommentVisibility.css";

interface Props {
    comment: CommentInfo;
}

export default function CommentVisibility({comment}: Props) {
    const isSenior = useSelector((state: ClientState) =>
        isPermitted("overrideComment", getDetailedPosting(state), "owner", state));
    const {t} = useTranslation();

    const view = comment.operations?.view ?? "public";
    const seniorView = comment.seniorOperations?.view ?? "unset";

    if (seniorView !== "unset" && (isSenior || seniorView !== "public")) {
        return (
            <span className="visibility">
                <Principal value={view} className="senior" comment={t("set-by-post-owner")}/>
                &middot;
            </span>
        );
    }

    if (view === "public") {
        return null;
    }

    return (
        <span className="visibility">
            &middot;
            <Principal value={view}/>
        </span>
    );
}
