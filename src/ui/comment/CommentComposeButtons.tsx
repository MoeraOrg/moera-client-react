import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { commentComposeCancel } from "state/detailedposting/actions";
import { isCommentComposerReady } from "state/detailedposting/selectors";
import { confirmBox } from "state/confirmbox/actions";
import { Button } from "ui/control";
import CommentDraftSaver from "ui/comment/CommentDraftSaver";
import { areImagesUploaded, areValuesEmpty, CommentComposeValues } from "ui/comment/comment-compose";
import "./CommentComposeButtons.css";

export default function CommentComposeButtons() {
    const ready = useSelector(isCommentComposerReady);
    const draft = useSelector((state: ClientState) => state.detailedPosting.compose.draft);
    const beingPosted = useSelector((state: ClientState) => state.detailedPosting.compose.beingPosted);
    const dispatch = useDispatch();
    const {t} = useTranslation();

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
            {ready && <CommentDraftSaver commentId={null}/>}
            <Button variant="secondary" invisible={invisible} onClick={onCancel}>
                {t("cancel")}
            </Button>
            <Button variant="primary" type="submit" loading={beingPosted} invisible={invisible}>
                {t("add-comment")}
            </Button>
        </div>
    );
}
