import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { CommentText, SourceFormat } from "api/node/api-types";
import { commentComposeCancel } from "state/detailedposting/actions";
import { confirmBox } from "state/confirmbox/actions";
import { getOwnerName } from "state/node/selectors";
import { getHomeOwnerAvatar, getHomeOwnerFullName } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import { getCommentComposerRepliedToId } from "state/detailedposting/selectors";
import { ClientState } from "state/state";
import { Button } from "ui/control";
import CommentDraftSaver from "ui/comment/CommentDraftSaver";
import commentComposeLogic, { CommentComposeValues } from "ui/comment/comment-compose-logic";
import "./CommentComposeButtons.css";

type Props = {
    loading: boolean;
} & ConnectedProps<typeof connector>;

function CommentComposeButtons(props: Props) {
    const {loading, ownerName, draft, confirmBox} = props;

    const {t} = useTranslation();

    const [initialText, setInitialText] = useState<CommentText>({ownerName: "", bodySrc: ""});

    useEffect(() => {
        const values = commentComposeLogic.mapPropsToValues(props);
        const commentText = commentComposeLogic.mapValuesToCommentText(values, props);
        if (commentText != null) {
            setInitialText(commentText);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ownerName, draft, setInitialText]); // 'props' are missing on purpose

    const onCancel = (e: React.MouseEvent) => {
        confirmBox(t("forget-unfinished-comment"), t("forget"), t("cancel"), commentComposeCancel(), null, "danger");
        e.preventDefault();
    };

    const {values} = useFormikContext<CommentComposeValues>();
    const invisible = (draft == null && commentComposeLogic.areValuesEmpty(values))
        || !commentComposeLogic.areImagesUploaded(values);

    return (
        <div className="buttons">
            <CommentDraftSaver initialized={true} initialText={initialText} commentId={null}/>
            <Button variant="secondary" invisible={invisible} onClick={onCancel}>
                {t("cancel")}
            </Button>
            <Button variant="primary" type="submit" loading={loading} invisible={invisible}>
                {t("add-comment")}
            </Button>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        ownerName: getOwnerName(state),
        ownerFullName: getHomeOwnerFullName(state),
        avatarDefault: getHomeOwnerAvatar(state),
        draft: state.detailedPosting.compose.draft,
        comment: null,
        repliedToId: getCommentComposerRepliedToId(state),
        smileysEnabled: getSetting(state, "comment.smileys.enabled") as boolean,
        reactionsPositiveDefault: getSetting(state, "comment.reactions.positive.default") as string,
        reactionsNegativeDefault: getSetting(state, "comment.reactions.negative.default") as string,
        sourceFormatDefault: getSetting(state, "comment.body-src-format.default") as SourceFormat
    }),
    { confirmBox }
);

export default connector(CommentComposeButtons);
