import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, ModalDialog } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import { ClientState } from "state/state";
import { getOwnerName } from "state/node/selectors";
import { closeQuickTips } from "state/quicktips/actions";
import { settingsUpdate } from "state/settings/actions";
import { getSetting } from "state/settings/selectors";
import { PREFIX } from "api/settings";
import Jump from "ui/navigation/Jump";
import { Browser } from "ui/browser";
import "./QuickTips.css";

type Props = ConnectedProps<typeof connector>;

function QuickTips({show, ownerName, shown, closeQuickTips, settingsUpdate}: Props) {
    if (!show) {
        return null;
    }

    const onClose = () => {
        closeQuickTips();
        if (!shown) {
            settingsUpdate([{
                name: PREFIX + "invitation.quick-tips.shown",
                value: "true"
            }]);
        }
    };

    const onJump = (href: string, performJump: () => void) => {
        onClose();
        performJump();
    }

    return (
        <ModalDialog className="quick-tips" title="Quick tips" onClose={onClose}>
            <div className="modal-body">
                <ul>
                    <li className="new-post">
                        To write a post, click
                        <Button variant="success" size="sm">
                            <FontAwesomeIcon icon="pen-alt"/>&nbsp;&nbsp;New post
                        </Button>
                        button in the {Browser.isTinyScreen()? "bottom panel" : "top-right corner"}.
                    </li>
                    {ownerName &&
                        <li className="visit">
                            To visit someone's blog, click <NodeName name={ownerName} linked={false} popup={false}/>
                            {" "}in the {Browser.isTinyScreen()? "top panel" : "top-left corner"} and type the blog
                            name.
                        </li>
                    }
                    <li className="subscribe">
                        To subscribe to a blog, open it and click
                        <Button variant="outline-primary" size="sm">Subscribe</Button>
                        button.
                    </li>
                    <li className="blog">
                        To quickly access your blog, use buttons in the
                        {Browser.isTinyScreen()? " bottom panel" : " top-right corner"}:
                        <p>
                            <button><FontAwesomeIcon icon="newspaper"/></button> &mdash; your News feed;<br/>
                            <button><FontAwesomeIcon icon="bell"/></button> &mdash; your Notifications;<br/>
                            <button><FontAwesomeIcon icon="cog"/></button> &mdash; your Settings;<br/>
                            <button><FontAwesomeIcon icon="home"/></button> &mdash; your Timeline.
                        </p>
                    </li>
                    <li>
                        Discover new blogs in the{" "}
                        <Jump nodeName="lamed_0" href="/post/1549a6ef-2ea8-47ce-9643-abebc95e3d74"
                              onNear={onJump} onFar={onJump}>
                            <b>list of blogs</b>
                        </Jump>.
                    </li>
                </ul>
            </div>
            <div className="modal-footer">
                <Button variant="primary" block onClick={onClose} autoFocus>OK</Button>
            </div>
        </ModalDialog>
    );
}

const connector = connect(
    (state: ClientState) => ({
        show: state.quickTips.show,
        ownerName: getOwnerName(state),
        shown: getSetting(state, "invitation.quick-tips.shown") as boolean
    }),
    { closeQuickTips, settingsUpdate }
);

export default connector(QuickTips);
