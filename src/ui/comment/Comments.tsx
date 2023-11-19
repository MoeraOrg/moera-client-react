import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SourceFormat } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import { isPermitted } from "state/node/selectors";
import {
    commentsFutureSliceLoad,
    commentsPastSliceLoad,
    commentsScrolledToAnchor,
    commentsScrolledToComments,
    commentsScrolledToComposer,
    detailedPostingScrolledToGallery
} from "state/detailedposting/actions";
import {
    getCommentDialogComment,
    getCommentsReceiverPostingId,
    getCommentsState,
    getCommentsWithVisibility,
    getDetailedPosting,
    isCommentComposerFocused,
    isCommentsFocused,
    isCommentsShowInvisible,
    isDetailedPostingCached,
    isDetailedPostingGalleryFocused
} from "state/detailedposting/selectors";
import { isAtDetailedPostingPage } from "state/navigation/selectors";
import { getSetting } from "state/settings/selectors";
import CommentsSentinelLine from "ui/comment/CommentsSentinelLine";
import Comment from "ui/comment/Comment";
import CommentComposeLine from "ui/comment/CommentComposeLine";
import { getPageHeaderHeight, isElementCompletelyVisible } from "util/misc";
import "./Comments.css";

const CommentDialog = React.lazy(() => import("ui/comment/CommentDialog"));

export default function Comments() {
    const visible = useSelector(isAtDetailedPostingPage);
    const galleryFocused = useSelector(isDetailedPostingGalleryFocused);
    const total = useSelector((state: ClientState) =>
        isDetailedPostingCached(state) ? (getDetailedPosting(state)!.totalComments ?? 0) : 0);
    const loadingFuture = useSelector((state: ClientState) => getCommentsState(state).loadingFuture);
    const loadingPast = useSelector((state: ClientState) => getCommentsState(state).loadingPast);
    const before = useSelector((state: ClientState) => getCommentsState(state).before);
    const after = useSelector((state: ClientState) => getCommentsState(state).after);
    const totalInPast = useSelector((state: ClientState) => getCommentsState(state).totalInPast);
    const totalInFuture = useSelector((state: ClientState) => getCommentsState(state).totalInFuture);
    const comments = useSelector(
        (state: ClientState) =>
            isCommentsShowInvisible(state)
                ? getCommentsWithVisibility(state)
                : getCommentsWithVisibility(state).filter(c => !c.invisible)
    );
    const anchor = useSelector((state: ClientState) => getCommentsState(state).anchor);
    const focusedCommentId = useSelector((state: ClientState) => getCommentsState(state).focusedCommentId);
    const focused = useSelector(isCommentsFocused);
    const composerFocused = useSelector(isCommentComposerFocused);
    const showCommentDialog = useSelector((state: ClientState) => state.detailedPosting.commentDialog.show);
    const commentsVisible = useSelector((state: ClientState) =>
        isPermitted("viewComments", getDetailedPosting(state), "public", state));

    const ownerName = useSelector(getHomeOwnerName);
    const ownerFullName = useSelector(getHomeOwnerFullName);
    const ownerGender = useSelector(getHomeOwnerGender);
    const avatarDefault = useSelector(getHomeOwnerAvatar);
    const receiverPostingId = useSelector(getCommentsReceiverPostingId);
    const comment = useSelector(getCommentDialogComment);
    const draft = useSelector((state: ClientState) => state.detailedPosting.commentDialog.draft);
    const reactionsPositiveDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.reactions.positive.default") as string);
    const reactionsNegativeDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.reactions.negative.default") as string);
    const sourceFormatDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.body-src-format.default") as SourceFormat);
    const smileysEnabled = useSelector((state: ClientState) => getSetting(state, "comment.smileys.enabled") as boolean);

    const dispatch = useDispatch();
    const {t} = useTranslation();

    useEffect(() => {
        if (!visible) {
            return;
        }
        if (galleryFocused) {
            scrollToElement(document.getElementById("posting-gallery")!);
            dispatch(detailedPostingScrolledToGallery());
            return;
        }
        if (focused) {
            scrollToElement(document.getElementById("comments")!);
            dispatch(commentsScrolledToComments());
            return;
        }
        if (composerFocused) {
            scrollToElement(document.getElementById("comment-composer")!);
            const body = document.getElementById("body");
            if (body != null) {
                body.focus();
            }
            dispatch(commentsScrolledToComposer());
            return;
        }
        if (
            anchor != null
            && (anchor <= before || (anchor >= Number.MAX_SAFE_INTEGER && before >= Number.MAX_SAFE_INTEGER))
            && (anchor > after || (anchor <= Number.MIN_SAFE_INTEGER && after <= Number.MIN_SAFE_INTEGER))
        ) {
            if (scrollTo(anchor)) {
                dispatch(commentsScrolledToAnchor());
            }
        }
    }, [dispatch, after, anchor, before, composerFocused, focused, galleryFocused, visible]);

    const loadFuture = () => {
        if (loadingFuture || before >= Number.MAX_SAFE_INTEGER) {
            return;
        }
        dispatch(commentsFutureSliceLoad(null));
    }

    const loadPast = () => {
        if (loadingPast || after <= Number.MIN_SAFE_INTEGER) {
            return;
        }
        dispatch(commentsPastSliceLoad(null));
    }

    if (!commentsVisible) {
        return <div id="comments" className="disabled">{t("comments-disabled")}</div>;
    }

    const empty = comments.length === 0 && !loadingFuture && !loadingPast
        && before >= Number.MAX_SAFE_INTEGER && after <= Number.MIN_SAFE_INTEGER;

    return (
        <>
            <div id="comments">
                {empty ||
                    <>
                        {comments.length > 0 &&
                            <CommentsSentinelLine end={false} loading={loadingPast}
                                                  title={t("view-earlier-comments")} total={totalInPast}
                                                  visible={total > 0 && after > Number.MIN_SAFE_INTEGER}
                                                  onClick={loadPast}/>
                        }
                        {comments.map((comment, index) =>
                            <Comment key={comment.moment} comment={comment}
                                     previousId={index > 0 ? comments[index - 1].id : null}
                                     focused={comment.id === focusedCommentId}/>
                        )}
                        <CommentsSentinelLine end={true} loading={loadingFuture}
                                              title={
                                                  comments.length !== 0
                                                      ? t("view-later-comments")
                                                      : t("view-comments")
                                              }
                                              total={totalInFuture}
                                              visible={total > 0 && before < Number.MAX_SAFE_INTEGER}
                                              onClick={loadFuture}/>
                    </>
                }
            </div>
            <CommentComposeLine/>
            {showCommentDialog &&
                <Suspense fallback={null}>
                    <CommentDialog avatarDefault={avatarDefault} receiverPostingId={receiverPostingId} comment={comment}
                                   draft={draft} ownerName={ownerName} ownerFullName={ownerFullName}
                                   ownerGender={ownerGender} smileysEnabled={smileysEnabled}
                                   sourceFormatDefault={sourceFormatDefault}
                                   reactionsPositiveDefault={reactionsPositiveDefault}
                                   reactionsNegativeDefault={reactionsNegativeDefault}
                                   repliedToId={comment?.repliedTo?.id ?? null}/>
                </Suspense>
            }
        </>
    );
}

function getCommentAt(moment: number): HTMLElement | null {
    const comments = document.getElementsByClassName("comment");
    for (let i = 0; i < comments.length; i++) {
        const comment = comments.item(i) as HTMLElement;
        if (comment == null) {
            continue;
        }
        if (comment.dataset.moment != null && parseInt(comment.dataset.moment) >= moment) {
            return comment;
        }
    }
    return null;
}

function scrollTo(moment: number): boolean {
    if (moment === Number.MAX_SAFE_INTEGER) {
        scrollToEnd();
        return true;
    } else {
        const comment = getCommentAt(moment);
        if (comment != null && !isElementCompletelyVisible(comment)) {
            scrollToElement(comment);
        }
        return comment != null;
    }
}

function scrollToEnd(): void {
    setTimeout(() => {
        const y = document.getElementById("comments")!.getBoundingClientRect().bottom;
        window.scrollBy(0, y - getPageHeaderHeight());
    });
}

function scrollToElement(element: Element): void {
    setTimeout(() => {
        const y = element.getBoundingClientRect().top;
        window.scrollBy(0, y - getPageHeaderHeight());
    });
}
