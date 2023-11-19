import React, { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { SourceFormat } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import { isPermitted, isPrincipalIn } from "state/node/selectors";
import {
    getCommentComposerRepliedToId,
    getCommentsReceiverFeatures,
    getCommentsReceiverName,
    getCommentsReceiverPostingId,
    getDetailedPosting
} from "state/detailedposting/selectors";
import { getSetting } from "state/settings/selectors";
import { openSignUpDialog } from "state/signupdialog/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { Button } from "ui/control";

const CommentCompose = React.lazy(() => import("ui/comment/CommentCompose"));

export default function CommentComposeLine() {
    const ownerName = useSelector(getHomeOwnerName);
    const ownerFullName = useSelector(getHomeOwnerFullName);
    const ownerGender = useSelector(getHomeOwnerGender);
    const avatarDefault = useSelector(getHomeOwnerAvatar);
    const commentingAllowed = useSelector(
        (state: ClientState) =>
            isPermitted("addComment", getDetailedPosting(state), "signed", state, {
                objectSourceName: getCommentsReceiverName(state),
                objectSourceFeatures: getCommentsReceiverFeatures(state)
            })
    );
    const discussionClosed = useSelector((state: ClientState) =>
        isPrincipalIn("addComment", getDetailedPosting(state), "signed", "none"));
    const receiverPostingId = useSelector(getCommentsReceiverPostingId);
    const draft = useSelector((state: ClientState) => state.detailedPosting.compose.draft);
    const repliedToId = useSelector(getCommentComposerRepliedToId);
    const reactionsPositiveDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.reactions.positive.default") as string);
    const reactionsNegativeDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.reactions.negative.default") as string);
    const sourceFormatDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.body-src-format.default") as SourceFormat);
    const smileysEnabled = useSelector((state: ClientState) => getSetting(state, "comment.smileys.enabled") as boolean);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (!ownerName) {
        const onSignUp = () => dispatch(openSignUpDialog());
        const onConnect = () => dispatch(openConnectDialog());
        return (
            <div id="comment-composer" className="alert alert-info">
                <Trans i18nKey="add-comments-need" values={{signup: t("sign-up"), connect: t("connect")}}>
                    <Button variant="primary" size="sm" onClick={onSignUp}/>
                    <Button variant="success" size="sm" onClick={onConnect}/>
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
            <CommentCompose avatarDefault={avatarDefault} receiverPostingId={receiverPostingId} comment={null}
                            draft={draft} ownerName={ownerName} ownerFullName={ownerFullName} ownerGender={ownerGender}
                            smileysEnabled={smileysEnabled} sourceFormatDefault={sourceFormatDefault}
                            reactionsPositiveDefault={reactionsPositiveDefault}
                            reactionsNegativeDefault={reactionsNegativeDefault} repliedToId={repliedToId}/>
        </Suspense>
    );
}
