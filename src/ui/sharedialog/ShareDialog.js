import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { Button, ModalDialog } from "ui/control";
import { closeShareDialog, shareDialogCopyLink } from "state/sharedialog/actions";
import { SOCIAL_BUTTONS, SOCIAL_BUTTONS_ORDER } from "ui/sharedialog/social-buttons";
import SocialButton from "ui/sharedialog/SocialButton";
import { getSetting } from "state/settings/selectors";
import "./ShareDialog.css";

const ShareDialog = ({show, title, url, socialButtons, closeShareDialog, shareDialogCopyLink}) => (
    show &&
        <ModalDialog title="Share" className="share-dialog" onClose={closeShareDialog}>
            <div className="modal-body">
                <div className="title">"{title}"</div>
                <div className="link">
                    <input type="text" className="form-control" value={url} onChange={() => {}}/>
                    <Button variant="secondary" onClick={() => shareDialogCopyLink(url)}>Copy</Button>
                </div>
                <div className="social">
                    {socialButtons.map(type => <SocialButton key={type} type={type} url={url} title={title}/>)}
                </div>
            </div>
            <div className="modal-footer">
                <Button variant="primary" onClick={closeShareDialog}>Close</Button>
            </div>
        </ModalDialog>
);

const getSocialButtons = createSelector(
    state => getSetting(state, "share.social-buttons.usage"),
    usage => (
        [...SOCIAL_BUTTONS].sort((a, b) => {
            const ua = usage[a] ?? 0;
            const ub = usage[b] ?? 0;
            return ua !== ub ? ub - ua : SOCIAL_BUTTONS_ORDER.get(a) - SOCIAL_BUTTONS_ORDER.get(b);
        })
    )
);

export default connect(
    state => ({
        show: state.shareDialog.show,
        title: state.shareDialog.title,
        url: state.shareDialog.url,
        socialButtons: getSocialButtons(state)
    }),
    { closeShareDialog, shareDialogCopyLink }
)(ShareDialog);
