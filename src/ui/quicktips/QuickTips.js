import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, ModalDialog, NodeName } from "ui/control";
import { getOwnerName } from "state/owner/selectors";
import { closeQuickTips } from "state/quicktips/actions";
import { settingsUpdate } from "state/settings/actions";
import { getSetting } from "state/settings/selectors";
import { PREFIX } from "api/settings";
import "./QuickTips.css";

class QuickTips extends React.PureComponent {

    onClose = () => {
        const {shown, closeQuickTips, settingsUpdate} = this.props;

        closeQuickTips();
        if (!shown) {
            settingsUpdate([{
                name: PREFIX + "invitation.quick-tips.shown",
                value: "true"
            }]);
        }
    };

    render() {
        const {show, ownerName} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog className="quick-tips" title="Quick tips" onClose={this.onClose}>
                <div className="modal-body">
                    <ul>
                        <li className="new-post">
                            To write a post, click
                            <Button variant="success" size="sm">
                                <FontAwesomeIcon icon="pen-alt"/>&nbsp;&nbsp;New post
                            </Button>
                            button in the top-right corner.
                        </li>
                        {ownerName &&
                            <li className="visit">
                                To visit someone's blog, click <NodeName name={ownerName} linked={false}/> in
                                the top-left corner and type the blog name.
                            </li>
                        }
                        <li className="subscribe">
                            To subscribe to a blog, open it and click
                            <Button variant="outline-primary" size="sm">Subscribe</Button>
                            button.
                        </li>
                        <li className="blog">
                            To quickly access your blog, use buttons in the top-right corner:
                            <p>
                                <button><FontAwesomeIcon icon="newspaper"/></button> &mdash; your News feed;<br/>
                                <button><FontAwesomeIcon icon="bell"/></button> &mdash; your Notifications;<br/>
                                <button><FontAwesomeIcon icon="cog"/></button> &mdash; your Settings;<br/>
                                <button><FontAwesomeIcon icon="home"/></button> &mdash; your Timeline.
                            </p>
                        </li>
                        <li>
                            Discover new blogs in the{" "}
                            <a href="https://lamed.moera.blog/moera/post/1549a6ef-2ea8-47ce-9643-abebc95e3d74">{
                                }<b>list of blogs</b>{
                            }</a>.
                        </li>
                    </ul>
                </div>
                <div className="modal-footer">
                    <Button variant="primary" block={true} onClick={this.onClose} autoFocus>OK</Button>
                </div>
            </ModalDialog>
        );
    }

}

export default connect(
    state => ({
        show: state.quickTips.show,
        ownerName: getOwnerName(state),
        shown: getSetting(state, "invitation.quick-tips.shown")
    }),
    { closeQuickTips, settingsUpdate }
)(QuickTips);
