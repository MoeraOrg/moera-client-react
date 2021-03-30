import React from 'react';
import cx from 'classnames';

import CommentRepliedTo from "ui/comment/CommentRepliedTo";
import EntryHtml from "ui/posting/EntryHtml";
import { hasWindowSelection } from "util/misc";

class CommentContent extends React.PureComponent {

    state = {
        preview: true
    };

    onClick = () => {
        if (!hasWindowSelection()) {
            this.setState({preview: !this.state.preview});
        }
    }

    render() {
        const {comment, previousId} = this.props;
        const {preview} = this.state;

        return (
            <div className={cx("content", {"preview": preview})} onClick={this.onClick}>
                <CommentRepliedTo comment={comment} previousId={previousId}/>
                {this.renderText()}
            </div>
        );
    }

    renderText() {
        const {comment} = this.props;

        if (this.state.preview) {
            if (comment.bodyPreview.text) {
                return (
                    <>
                        <EntryHtml html={comment.bodyPreview.text}/>
                        <p>
                            <button className="btn btn-link read-more" onClick={this.onClick}>Read more...</button>
                        </p>
                    </>
                );
            } else {
                return <EntryHtml html={comment.body.previewText}/>;
            }
        } else {
            return <EntryHtml html={comment.body.text}/>;
        }
    }

}

export default CommentContent;
