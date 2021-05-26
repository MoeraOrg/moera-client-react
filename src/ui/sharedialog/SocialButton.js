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
import * as immutable from 'object-path-immutable';

import { settingsUpdate } from "state/settings/actions";
import { getSetting } from "state/settings/selectors";
import { PREFIX } from "api/settings";
import { closeShareDialog } from "state/sharedialog/actions";

function SocialButton({type, url, title, usage, settingsUpdate, closeShareDialog}) {
    const onClick = () => {
        closeShareDialog();
        const data = immutable.update(usage, [type], n => (n ?? 0) + 1);
        settingsUpdate([{
            name: PREFIX + "share.social-buttons.usage",
            value: JSON.stringify(data)
        }])
    };

    switch (type) {
        case "facebook":
            return (
                <FacebookShareButton url={url} beforeOnClick={onClick}>
                    <FacebookIcon size={40} round={true}/>
                </FacebookShareButton>
            );
        case "telegram":
            return (
                <TelegramShareButton url={url} title={title} beforeOnClick={onClick}>
                    <TelegramIcon size={40} round={true}/>
                </TelegramShareButton>
            );
        case "twitter":
            return (
                <TwitterShareButton url={url} title={title} beforeOnClick={onClick}>
                    <TwitterIcon size={40} round={true}/>
                </TwitterShareButton>
            );
        case "reddit":
            return (
                <RedditShareButton url={url} title={title} beforeOnClick={onClick}>
                    <RedditIcon size={40} round={true}/>
                </RedditShareButton>
            );
        case "email":
            return (
                <EmailShareButton url={url} subject={title} beforeOnClick={onClick}>
                    <EmailIcon size={40} round={true}/>
                </EmailShareButton>
            );
        case "vk":
            return (
                <VKShareButton url={url} title={title} beforeOnClick={onClick}>
                    <VKIcon size={40} round={true}/>
                </VKShareButton>
            );
        case "livejournal":
            return (
                <LivejournalShareButton url={url} title={title} beforeOnClick={onClick}>
                    <LivejournalIcon size={40} round={true}/>
                </LivejournalShareButton>
            );
        case "linkedin":
            return (
                <LinkedinShareButton url={url} title={title} beforeOnClick={onClick}>
                    <LinkedinIcon size={40} round={true}/>
                </LinkedinShareButton>
            );
        case "pocket":
            return (
                <PocketShareButton url={url} title={title} beforeOnClick={onClick}>
                    <PocketIcon size={40} round={true}/>
                </PocketShareButton>
            );
        case "tumblr":
            return (
                <TumblrShareButton url={url} title={title} beforeOnClick={onClick}>
                    <TumblrIcon size={40} round={true}/>
                </TumblrShareButton>
            );
        case "whatsapp":
            return (
                <WhatsappShareButton url={url} title={title} beforeOnClick={onClick}>
                    <WhatsappIcon size={40} round={true}/>
                </WhatsappShareButton>
            );
        case "viber":
            return (
                <ViberShareButton url={url} title={title} beforeOnClick={onClick}>
                    <ViberIcon size={40} round={true}/>
                </ViberShareButton>
            );
        case "ok":
            return (
                <OKShareButton url={url} title={title} beforeOnClick={onClick}>
                    <OKIcon size={40} round={true}/>
                </OKShareButton>
            );
        case "weibo":
            return (
                <WeiboShareButton url={url} title={title} beforeOnClick={onClick}>
                    <WeiboIcon size={40} round={true}/>
                </WeiboShareButton>
            );
        default:
            return null;
    }
}

export default connect(
    state => ({
        usage: getSetting(state, "share.social-buttons.usage")
    }),
    { settingsUpdate, closeShareDialog }
)(SocialButton);
