import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';

import { getSetting } from "state/settings/selectors";
import { commentPost } from "state/detailedposting/actions";
import { getDetailedPostingId } from "state/detailedposting/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import { TextField } from "ui/control/field";
import CommentSubmitButton from "ui/comment/CommentSubmitButton";
import commentComposeLogic from "ui/comment/comment-compose-logic";
import "./CommentCompose.css";

class CommentCompose extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.postingId !== prevProps.postingId || this.props.formId !== prevProps.formId) {
            const values = commentComposeLogic.mapPropsToValues(this.props);
            this.props.resetForm({values});
        }
    }

    render() {
        const {ownerName, beingPosted} = this.props;

        if (!ownerName) {
            return null;
        }
        return (
            <div id="comment-composer">
                <Form>
                    <div className="content">
                        <TextField name="body" rows={1} placeholder="Write a comment here..." anyValue
                                   disabled={beingPosted}/>
                    </div>
                    <CommentSubmitButton loading={beingPosted}/>
                </Form>
            </div>
        );
    }

}

export default connect(
    state => ({
        ownerName: getHomeOwnerName(state),
        postingId: getDetailedPostingId(state),
        formId: state.detailedPosting.compose.formId,
        beingPosted: state.detailedPosting.compose.beingPosted,
        reactionsPositiveDefault: getSetting(state, "comment.reactions.positive.default"),
        reactionsNegativeDefault: getSetting(state, "comment.reactions.negative.default"),
        sourceFormatDefault: getSetting(state, "comment.body-src-format.default")
    }),
    { commentPost }
)(withFormik(commentComposeLogic)(CommentCompose));
