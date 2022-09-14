import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { CommentInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { isPermitted } from "state/node/selectors";
import { getDetailedPosting } from "state/detailedposting/selectors";
import { Principal } from "ui/control";
import "./CommentVisibility.css";

type Props = {
    comment: CommentInfo;
} & ConnectedProps<typeof connector>;

function CommentVisibility({comment, isSenior}: Props) {
    const {t} = useTranslation();

    const view = comment.operations?.view ?? "public";
    const seniorView = comment.seniorOperations?.view ?? "unset";

    if (seniorView !== "unset" && (isSenior || seniorView !== "public")) {
        return (
            <span className="visibility">
                &middot;
                <Principal value={view} className="senior" comment={t("set-by-post-owner")}/>
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

const connector = connect(
    (state: ClientState) => ({
        isSenior: isPermitted("overrideComment", getDetailedPosting(state), "owner", state)
    })
);

export default connector(CommentVisibility);
