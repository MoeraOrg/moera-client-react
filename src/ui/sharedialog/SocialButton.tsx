import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BlueskyIcon,
    BlueskyShareButton,
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    GabIcon,
    GabShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    LivejournalIcon,
    LivejournalShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton,
    ThreadsIcon,
    ThreadsShareButton,
    TwitterShareButton,
    ViberIcon,
    ViberShareButton,
    VKIcon,
    VKShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon
} from 'react-share';
import * as immutable from 'object-path-immutable';

import { CLIENT_SETTINGS_PREFIX } from "api";
import { ClientState } from "state/state";
import { settingsUpdate } from "state/settings/actions";
import { getSetting } from "state/settings/selectors";
import { closeShareDialog } from "state/sharedialog/actions";

const ICON_SIZE = 48;

interface Props {
    type: string;
    url: string;
    title?: string;
}

export default function SocialButton({type, url, title}: Props) {
    const usage = useSelector((state: ClientState) =>
        getSetting(state, "share.social-buttons.usage") as any as Partial<Record<string, number>>
    );
    const dispatch = useDispatch();

    const onClick = () => {
        dispatch(closeShareDialog());
        const data = immutable.update(usage, [type], n => (n ?? 0) + 1);
        dispatch(settingsUpdate([{
            name: CLIENT_SETTINGS_PREFIX + "share.social-buttons.usage",
            value: JSON.stringify(data)
        }]));
    };

    switch (type) {
        case "bluesky":
            return (
                <BlueskyShareButton url={url} title={title} beforeOnClick={onClick}>
                    <BlueskyIcon size={ICON_SIZE} round/>
                </BlueskyShareButton>
            );
        case "email":
            return (
                <EmailShareButton url={url} subject={title} beforeOnClick={onClick}>
                    <EmailIcon size={ICON_SIZE} round/>
                </EmailShareButton>
            );
        case "facebook":
            return (
                <FacebookShareButton url={url} title={title} beforeOnClick={onClick}>
                    <FacebookIcon size={ICON_SIZE} round/>
                </FacebookShareButton>
            );
        case "gab":
            return (
                <GabShareButton url={url} title={title} beforeOnClick={onClick}>
                    <GabIcon size={ICON_SIZE} round/>
                </GabShareButton>
            );
        case "linkedin":
            return (
                <LinkedinShareButton url={url} title={title} beforeOnClick={onClick}>
                    <LinkedinIcon size={ICON_SIZE} round/>
                </LinkedinShareButton>
            );
        case "livejournal":
            return (
                <LivejournalShareButton url={url} title={title} beforeOnClick={onClick}>
                    <LivejournalIcon size={ICON_SIZE} round/>
                </LivejournalShareButton>
            );
        case "reddit":
            return (
                <RedditShareButton url={url} title={title} beforeOnClick={onClick}>
                    <RedditIcon size={ICON_SIZE} round/>
                </RedditShareButton>
            );
        case "telegram":
            return (
                <TelegramShareButton url={url} title={title} beforeOnClick={onClick}>
                    <TelegramIcon size={ICON_SIZE} round/>
                </TelegramShareButton>
            );
        case "threads":
            return (
                <ThreadsShareButton url={url} title={title} beforeOnClick={onClick}>
                    <ThreadsIcon size={ICON_SIZE} round/>
                </ThreadsShareButton>
            );
        case "twitter":
            return (
                <TwitterShareButton url={url} title={title} beforeOnClick={onClick}>
                    <XIcon size={ICON_SIZE} round/>
                </TwitterShareButton>
            );
        case "viber":
            return (
                <ViberShareButton url={url} title={title} beforeOnClick={onClick}>
                    <ViberIcon size={ICON_SIZE} round/>
                </ViberShareButton>
            );
        case "vk":
            return (
                <VKShareButton url={url} title={title} beforeOnClick={onClick}>
                    <VKIcon size={ICON_SIZE} round/>
                </VKShareButton>
            );
        case "whatsapp":
            return (
                <WhatsappShareButton url={url} title={title} beforeOnClick={onClick}>
                    <WhatsappIcon size={ICON_SIZE} round/>
                </WhatsappShareButton>
            );
        default:
            return null;
    }
}
