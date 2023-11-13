import React, { Suspense } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
import {
    getCommentsReceiverFeatures,
    getCommentsReceiverName,
    getDetailedPosting
} from "state/detailedposting/selectors";
import { isPermitted, isPrincipalIn } from "state/node/selectors";
import { openSignUpDialog } from "state/signupdialog/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { Button } from "ui/control";

const CommentCompose = React.lazy(() => import("ui/comment/CommentCompose"));

type Props = ConnectedProps<typeof connector>;

function CommentComposeLine({
    ownerName, commentingAllowed, discussionClosed, openSignUpDialog, openConnectDialog
}: Props) {
    const {t} = useTranslation();

    if (!ownerName) {
        return (
            <div id="comment-composer" className="alert alert-info">
                <Trans i18nKey="add-comments-need" values={{signup: t("sign-up"), connect: t("connect")}}>
                    <Button variant="primary" size="sm" onClick={() => openSignUpDialog()}/>
                    <Button variant="success" size="sm" onClick={() => openConnectDialog()}/>
                </Trans>
            </div>
        );
    }

    if (!commentingAllowed) {
        if (discussionClosed) {
            return (
                <div id="comment-composer" className="disabled">{t("discussion-closed")}</div>
            );
        } else {
            return (
                <div id="comment-composer"/>
            );
        }
    }

    return (
        <Suspense fallback={null}>
            <CommentCompose/>
        </Suspense>
    );
}

const connector = connect(
    (state: ClientState) => ({
        ownerName: getHomeOwnerName(state),
        commentingAllowed: isPermitted("addComment", getDetailedPosting(state), "signed", state, {
            objectSourceName: getCommentsReceiverName(state),
            objectSourceFeatures: getCommentsReceiverFeatures(state)
        }),
        discussionClosed: isPrincipalIn("addComment", getDetailedPosting(state), "signed", "none")
    }),
    { openSignUpDialog, openConnectDialog }
);

export default connector(CommentComposeLine);
