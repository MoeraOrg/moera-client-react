import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
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
import { ClientState } from "state/state";

type Props = {
    type: string;
    url: string;
    title?: string;
} & ConnectedProps<typeof connector>;

function SocialButton({type, url, title, usage, settingsUpdate, closeShareDialog}: Props) {
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
                <FacebookShareButton url={url} quote={title} beforeOnClick={onClick}>
                    <FacebookIcon size={40} round/>
                </FacebookShareButton>
            );
        case "telegram":
            return (
                <TelegramShareButton url={url} title={title} beforeOnClick={onClick}>
                    <TelegramIcon size={40} round/>
                </TelegramShareButton>
            );
        case "twitter":
            return (
                <TwitterShareButton url={url} title={title} beforeOnClick={onClick}>
                    <TwitterIcon size={40} round/>
                </TwitterShareButton>
            );
        case "reddit":
            return (
                <RedditShareButton url={url} title={title} beforeOnClick={onClick}>
                    <RedditIcon size={40} round/>
                </RedditShareButton>
            );
        case "email":
            return (
                <EmailShareButton url={url} subject={title} beforeOnClick={onClick}>
                    <EmailIcon size={40} round/>
                </EmailShareButton>
            );
        case "vk":
            return (
                <VKShareButton url={url} title={title} beforeOnClick={onClick}>
                    <VKIcon size={40} round/>
                </VKShareButton>
            );
        case "livejournal":
            return (
                <LivejournalShareButton url={url} title={title} beforeOnClick={onClick}>
                    <LivejournalIcon size={40} round/>
                </LivejournalShareButton>
            );
        case "linkedin":
            return (
                <LinkedinShareButton url={url} title={title} beforeOnClick={onClick}>
                    <LinkedinIcon size={40} round/>
                </LinkedinShareButton>
            );
        case "pocket":
            return (
                <PocketShareButton url={url} title={title} beforeOnClick={onClick}>
                    <PocketIcon size={40} round/>
                </PocketShareButton>
            );
        case "tumblr":
            return (
                <TumblrShareButton url={url} title={title} beforeOnClick={onClick}>
                    <TumblrIcon size={40} round/>
                </TumblrShareButton>
            );
        case "whatsapp":
            return (
                <WhatsappShareButton url={url} title={title} beforeOnClick={onClick}>
                    <WhatsappIcon size={40} round/>
                </WhatsappShareButton>
            );
        case "viber":
            return (
                <ViberShareButton url={url} title={title} beforeOnClick={onClick}>
                    <ViberIcon size={40} round/>
                </ViberShareButton>
            );
        case "ok":
            return (
                <OKShareButton url={url} title={title} beforeOnClick={onClick}>
                    <OKIcon size={40} round/>
                </OKShareButton>
            );
        case "weibo":
            return (
                <WeiboShareButton url={url} title={title} beforeOnClick={onClick}>
                    <WeiboIcon size={40} round/>
                </WeiboShareButton>
            );
        default:
            return null;
    }
}

const connector = connect(
    (state: ClientState) => ({
        usage: getSetting(state, "share.social-buttons.usage") as any as Partial<Record<string, number>>
    }),
    { settingsUpdate, closeShareDialog }
);

export default connector(SocialButton);
