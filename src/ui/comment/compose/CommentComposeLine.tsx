import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { tTitle } from "i18n";
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
import * as Browser from "ui/browser";
import { useIsTinyScreen } from "ui/hook";
import Jump from "ui/navigation/Jump";
import "./CommentComposeLine.css";

const CommentCompose = React.lazy(() => import("ui/comment/compose/CommentCompose"));

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
        isPrincipalIn("addComment", getDetailedPosting(state), "signed", "none")
    );
    const receiverPostingId = useSelector(getCommentsReceiverPostingId);
    const draft = useSelector((state: ClientState) => state.detailedPosting.compose.draft);
    const formId = useSelector((state: ClientState) => state.detailedPosting.compose.formId);
    const repliedToId = useSelector(getCommentComposerRepliedToId);
    const reactionsPositiveDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.reactions-disabled.positive.default") as string
    );
    const reactionsNegativeDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.reactions-disabled.negative.default") as string
    );
    const sourceFormatDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.body-src-format.default") as SourceFormat
    );
    const smileysEnabled = useSelector((state: ClientState) => getSetting(state, "comment.smileys.enabled") as boolean);
    const tinyScreen = useIsTinyScreen();
    const {t} = useTranslation();

    if (!ownerName) {
        return (
            <div id="comment-compose" className="nologin">
                <Jump
                    className={cx("btn", {"btn-primary": tinyScreen, "btn-outline-primary": !tinyScreen})}
                    href={Browser.urlWithBackHref("/connect")}
                >
                    {tTitle(t("add-comment"))}
                </Jump>
            </div>
        );
    }

    if (!commentingAllowed) {
        if (discussionClosed) {
            return (
                <div id="comment-compose" className="disabled">{t("discussion-closed")}</div>
            );
        } else {
            return (
                <div id="comment-compose"/>
            );
        }
    }

    return (
        <Suspense fallback={null}>
            <CommentCompose
                avatarDefault={avatarDefault}
                receiverPostingId={receiverPostingId}
                comment={null}
                draft={draft}
                formId={formId}
                ownerName={ownerName}
                ownerFullName={ownerFullName}
                ownerGender={ownerGender}
                smileysEnabled={smileysEnabled}
                sourceFormatDefault={sourceFormatDefault}
                reactionsPositiveDefault={reactionsPositiveDefault}
                reactionsNegativeDefault={reactionsNegativeDefault}
                repliedToId={repliedToId}
            />
        </Suspense>
    );
}
