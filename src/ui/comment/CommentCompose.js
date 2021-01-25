import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as textFieldEdit from 'text-field-edit'

import { getSetting } from "state/settings/selectors";
import { commentPost } from "state/detailedposting/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { getHomeOwnerName } from "state/home/selectors";
import { getCommentComposerRepliedToId } from "state/detailedposting/selectors";
import { Browser } from "ui/browser";
import { Button } from "ui/control";
import { RichTextField } from "ui/control/field";
import CommentComposeRepliedTo from "ui/comment/CommentComposeRepliedTo";
import commentComposeLogic from "ui/comment/comment-compose-logic";
import CommentComposeButtons from "ui/comment/CommentComposeButtons";
import { mentionName, parseBool } from "util/misc";
import "./CommentCompose.css";

class CommentCompose extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.receiverName !== prevProps.receiverName
            || this.props.receiverPostingId !== prevProps.receiverPostingId
            || this.props.formId !== prevProps.formId) {

            const values = commentComposeLogic.mapPropsToValues(this.props);
            this.props.resetForm({values});
        }
    }

    onKeyDown = event => {
        const {submitKey, submitForm} = this.props;

        if (event.key === "Enter") {
            const submit = !Browser.isTouchScreen() && !event.shiftKey
                && ((submitKey === "enter" && !event.ctrlKey) || (submitKey === "ctrl-enter" && event.ctrlKey));
            if (submit) {
                submitForm();
            } else {
                textFieldEdit.insert(event.target, "\n");
            }
            event.preventDefault();
        }
    }

    render() {
        const {
            homeOwnerName, beingPosted, receiverName, smileysEnabled, openSignUpDialog, openConnectDialog
        } = this.props;

        if (homeOwnerName) {
            return (
                <div id="comment-composer">
                    <Form>
                        <div className="content">
                            <CommentComposeRepliedTo/>
                            <RichTextField name="body" rows={1} anyValue
                                           placeholder={`Write a comment to ${mentionName(receiverName)} here...`}
                                           disabled={beingPosted} smileysEnabled={smileysEnabled} hidingPanel={true}
                                           onKeyDown={this.onKeyDown}/>
                        </div>
                        <CommentComposeButtons loading={beingPosted}/>
                    </Form>
                </div>
            );
        } else {
            return (
                <div className="alert alert-info">
                    To add comments, you need to&nbsp;
                    <Button variant="primary" size="sm" onClick={() => openSignUpDialog()}>Sign Up</Button>
                    &nbsp;or&nbsp;
                    <Button variant="success" size="sm" onClick={() => openConnectDialog()}>Connect</Button>
                </div>
            );
        }
    }

}

export default connect(
    state => ({
        homeOwnerName: getHomeOwnerName(state),
        receiverName: state.detailedPosting.comments.receiverName,
        receiverPostingId: state.detailedPosting.comments.receiverPostingId,
        formId: state.detailedPosting.compose.formId,
        repliedToId: getCommentComposerRepliedToId(state),
        beingPosted: state.detailedPosting.compose.beingPosted,
        reactionsPositiveDefault: getSetting(state, "comment.reactions.positive.default"),
        reactionsNegativeDefault: getSetting(state, "comment.reactions.negative.default"),
        sourceFormatDefault: getSetting(state, "comment.body-src-format.default"),
        submitKey: getSetting(state, "comment.submit-key"),
        smileysEnabled: parseBool(getSetting(state, "comment.smileys.enabled"))
    }),
    { commentPost, openSignUpDialog, openConnectDialog }
)(withFormik(commentComposeLogic)(CommentCompose));
