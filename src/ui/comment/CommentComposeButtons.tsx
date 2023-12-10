import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { CommentText, SourceFormat } from "api";
import { commentComposeCancel } from "state/detailedposting/actions";
import { confirmBox } from "state/confirmbox/actions";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import { getCommentComposerRepliedToId, isCommentComposerReady } from "state/detailedposting/selectors";
import { ClientState } from "state/state";
import { Button } from "ui/control";
import CommentDraftSaver from "ui/comment/CommentDraftSaver";
import {
    areImagesUploaded,
    areValuesEmpty,
    commentComposeLogic,
    CommentComposeValues,
    valuesToCommentText
} from "ui/comment/comment-compose";
import "./CommentComposeButtons.css";

export default function CommentComposeButtons() {
    const ready = useSelector(isCommentComposerReady);
    const ownerName = useSelector(getHomeOwnerName);
    const ownerFullName = useSelector(getHomeOwnerFullName);
    const ownerGender = useSelector(getHomeOwnerGender);
    const avatarDefault = useSelector(getHomeOwnerAvatar);
    const smileysEnabled = useSelector((state: ClientState) => getSetting(state, "comment.smileys.enabled") as boolean);
    const sourceFormatDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.body-src-format.default") as SourceFormat);
    const reactionsPositiveDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.reactions.positive.default") as string);
    const reactionsNegativeDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.reactions.negative.default") as string);
    const repliedToId = useSelector(getCommentComposerRepliedToId);
    const draft = useSelector((state: ClientState) => state.detailedPosting.compose.draft);
    const beingPosted = useSelector((state: ClientState) => state.detailedPosting.compose.beingPosted);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const [initialText, setInitialText] = useState<CommentText>({ownerName: "", bodySrc: ""});

    useEffect(() => {
        const commentText = valuesToCommentText(
            commentComposeLogic.mapPropsToValues({comment: null, draft, avatarDefault}),
            {
                ownerName, ownerFullName, ownerGender, smileysEnabled, sourceFormatDefault, reactionsPositiveDefault,
                reactionsNegativeDefault, repliedToId
            }
        );
        if (commentText != null) {
            setInitialText(commentText);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ownerName, draft, setInitialText]); // 'props' are missing on purpose

    const onCancel = (e: React.MouseEvent) => {
        dispatch(confirmBox(
            t("forget-unfinished-comment"), t("forget"), t("cancel"), commentComposeCancel(), null, "danger"
        ));
        e.preventDefault();
    };

    const {values} = useFormikContext<CommentComposeValues>();
    const invisible = !ready || (draft == null && areValuesEmpty(values)) || !areImagesUploaded(values);

    return (
        <div className="buttons">
            <CommentDraftSaver initialized={true} initialText={initialText} commentId={null}/>
            <Button variant="secondary" invisible={invisible} onClick={onCancel}>
                {t("cancel")}
            </Button>
            <Button variant="primary" type="submit" loading={beingPosted} invisible={invisible}>
                {t("add-comment")}
            </Button>
        </div>
    );
}
