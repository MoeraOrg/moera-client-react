import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createSelector } from 'reselect';

import { Button, ModalDialog } from "ui/control";
import { closeShareDialog, shareDialogCopyLink } from "state/sharedialog/actions";
import { SOCIAL_BUTTONS, SOCIAL_BUTTONS_ORDER } from "ui/sharedialog/social-buttons";
import SocialButton from "ui/sharedialog/SocialButton";
import { getSetting } from "state/settings/selectors";
import { ClientState } from "state/state";
import "./ShareDialog.css";

type Props = ConnectedProps<typeof connector>;

const ShareDialog = ({show, title, url, socialButtons, closeShareDialog, shareDialogCopyLink}: Props) => (
    show ?
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
    :
        null
);

const getSocialButtons = createSelector(
    (state: ClientState) => getSetting(state, "share.social-buttons.usage") as any as Partial<Record<string, number>>,
    usage => (
        [...SOCIAL_BUTTONS].sort((a, b) => {
            const ua = usage[a] ?? 0;
            const ub = usage[b] ?? 0;
            return ua !== ub ? ub - ua : SOCIAL_BUTTONS_ORDER.get(a)! - SOCIAL_BUTTONS_ORDER.get(b)!;
        })
    )
);

const connector = connect(
    (state: ClientState) => ({
        show: state.shareDialog.show,
        title: state.shareDialog.title,
        url: state.shareDialog.url ?? "",
        socialButtons: getSocialButtons(state)
    }),
    { closeShareDialog, shareDialogCopyLink }
);

export default connector(ShareDialog);
