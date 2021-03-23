import React from 'react';
import { connect } from 'react-redux';
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    LivejournalIcon,
    LivejournalShareButton,
    OKIcon,
    OKShareButton,
    PocketIcon,
    PocketShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton,
    TumblrIcon,
    TumblrShareButton,
    TwitterIcon,
    TwitterShareButton,
    ViberIcon,
    ViberShareButton,
    VKIcon,
    VKShareButton,
    WeiboIcon,
    WeiboShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from 'react-share';

import { Button, ModalDialog } from "ui/control";
import { closeShareDialog, shareDialogCopyLink } from "state/sharedialog/actions";
import "./ShareDialog.css";

const ShareDialog = ({show, title, url, closeShareDialog, shareDialogCopyLink}) => (
    show &&
        <ModalDialog title="Share" className="share-dialog" onClose={closeShareDialog}>
            <div className="modal-body">
                <div className="title">"{title}"</div>
                <div className="link">
                    <input type="text" className="form-control" value={url} readOnly={true}/>
                    <Button variant="secondary" onClick={() => shareDialogCopyLink(url)}>Copy</Button>
                </div>
                <div className="social">
                    <FacebookShareButton url={url} quote={title}>
                        <FacebookIcon size={40} round={true}/>
                    </FacebookShareButton>
                    <TelegramShareButton url={url} title={title}>
                        <TelegramIcon size={40} round={true}/>
                    </TelegramShareButton>
                    <TwitterShareButton url={url} title={title}>
                        <TwitterIcon size={40} round={true}/>
                    </TwitterShareButton>
                    <RedditShareButton url={url} title={title}>
                        <RedditIcon size={40} round={true}/>
                    </RedditShareButton>
                    <EmailShareButton url={url} subject={title}>
                        <EmailIcon size={40} round={true}/>
                    </EmailShareButton>
                    <VKShareButton url={url} title={title}>
                        <VKIcon size={40} round={true}/>
                    </VKShareButton>
                    <LivejournalShareButton url={url} title={title}>
                        <LivejournalIcon size={40} round={true}/>
                    </LivejournalShareButton>
                    <LinkedinShareButton url={url} title={title}>
                        <LinkedinIcon size={40} round={true}/>
                    </LinkedinShareButton>
                    <PocketShareButton url={url} title={title}>
                        <PocketIcon size={40} round={true}/>
                    </PocketShareButton>
                    <TumblrShareButton url={url} title={title}>
                        <TumblrIcon size={40} round={true}/>
                    </TumblrShareButton>
                    <WhatsappShareButton url={url} title={title}>
                        <WhatsappIcon size={40} round={true}/>
                    </WhatsappShareButton>
                    <ViberShareButton url={url} title={title}>
                        <ViberIcon size={40} round={true}/>
                    </ViberShareButton>
                    <OKShareButton url={url} title={title}>
                        <OKIcon size={40} round={true}/>
                    </OKShareButton>
                    <WeiboShareButton url={url} title={title}>
                        <WeiboIcon size={40} round={true}/>
                    </WeiboShareButton>
                </div>
            </div>
            <div className="modal-footer">
                <Button variant="primary" onClick={closeShareDialog}>Close</Button>
            </div>
        </ModalDialog>
);

export default connect(
    state => ({
        show: state.shareDialog.show,
        title: state.shareDialog.title,
        url: state.shareDialog.url
    }),
    { closeShareDialog, shareDialogCopyLink }
)(ShareDialog);
