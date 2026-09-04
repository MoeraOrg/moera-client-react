import React from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { NodeName } from "api";
import {
    getOwnerAvatar,
    getOwnerCard,
    getOwnerFullName,
    getOwnerName,
    getOwnerSourceUri,
    getOwnerTitle,
    isAtHomeNode,
    isRegularNode
} from "state/node/selectors";
import { profileEmailVerify } from "state/profile/actions";
import { sharePageCopyLink } from "state/sharedialog/actions";
import { useDispatcher } from "ui/hook";
import { Icon, msLink } from "ui/material-symbols";
import { Button, DonateButton, OnlyDesktop } from "ui/control";
import Jump from "ui/navigation/Jump";
import NodeFullName from "ui/nodename/NodeFullName";
import { useTimeline } from "ui/feed/feeds";
import FeedSubscribeButton from "ui/feed/FeedSubscribeButton";
import ProfileAvatar from "ui/profile/ProfileAvatar";
import ProfileSourceDisclaimer from "ui/profile/ProfileSourceDisclaimer";
import ManagementMenu from "ui/profile/manage/ManagementMenu";
import OperationStatus from "ui/profile/manage/OperationStatus";
import EntryHtml from "ui/entry/EntryHtml";
import { REL_CURRENT } from "util/rel-node-name";
import { NodeSourceUri } from "util/node-source-uri";
import { formatFullName } from "util/names";
import "./ProfileSidebar.css";

export default function ProfileSidebar() {
    const atHome = useSelector(isAtHomeNode);
    const regularNode = useSelector(isRegularNode);
    const nodeName = useSelector(getOwnerName);
    const fullName = useSelector(getOwnerFullName);
    const sourceUri = useSelector(getOwnerSourceUri);
    const sourceUriTarget = sourceUri ? NodeSourceUri.parse(sourceUri).uri : null;
    const title = useSelector(getOwnerTitle);
    const avatar = useSelector(getOwnerAvatar);
    const card = useSelector(getOwnerCard);
    const profile = card?.details.profile;
    const storiesTotal = card?.stories.storiesTotal ?? "?";
    const subscribersTotal = card?.people.subscribersTotal ?? "?";
    const fundraisers = card?.details.profile.fundraisers;
    const timelineHref = useTimeline();
    const dispatch = useDispatcher();
    const {t} = useTranslation();

    const onCopyLink = () => dispatch(sharePageCopyLink(REL_CURRENT, "/"));

    return (
        <OnlyDesktop>
            <aside id="profile-sidebar">
                <div className="panel">
                    <ProfileAvatar avatar={avatar} ownerName={nodeName} size={96}/>
                    {atHome ?
                        <ManagementMenu/>
                    :
                        <FeedSubscribeButton
                            className="position-lg"
                            nodeName={nodeName ?? REL_CURRENT}
                            feedName="timeline"
                            sharing
                        />
                    }
                </div>
                <div className="full-name">
                    <NodeFullName nodeName={nodeName} fullName={fullName} sourceUri={sourceUri}/>
                </div>
                <div className="mention" onClick={onCopyLink}>@{NodeName.shorten(nodeName)}</div>
                <OperationStatus/>
                {sourceUriTarget &&
                    <div className="source-uri">
                        <Icon icon={msLink} size="1.2em"/><a href={sourceUriTarget}>{sourceUriTarget}</a>
                    </div>
                }
                {title && <div className="title">{title}</div>}
                {!atHome &&
                    <FeedSubscribeButton
                        className="position-sm"
                        nodeName={nodeName ?? REL_CURRENT}
                        feedName="timeline"
                        sharing
                    />
                }
                {regularNode &&
                    <>
                        <div className="counters-line">
                            <Jump className="counter" href={timelineHref}>
                                <Trans i18nKey="count-posts" values={{count: storiesTotal}}><em/></Trans>
                            </Jump>
                            <Jump className="counter" href="/people/subscribers">
                                <Trans i18nKey="count-subscribers" values={{count: subscribersTotal}}><em/></Trans>
                            </Jump>
                        </div>
                        {profile?.bioHtml &&
                            <div className="bio">
                                <EntryHtml html={profile.bioHtml} nodeName={REL_CURRENT}/>
                                <ProfileSourceDisclaimer nodeSourceUri={sourceUri}
                                                         title={formatFullName(nodeName, fullName)}/>
                            </div>
                        }
                        {profile?.email &&
                            <div className="email">
                                <span className="title">{t("e-mail")}:</span>{" "}
                                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                                {atHome && !profile.emailVerified &&
                                    <>
                                        {" "}<span className="not-verified">{t("not-confirmed")}</span>{" "}
                                        <Button variant="primary" size="sm"
                                                onClick={() => dispatch(profileEmailVerify())}>
                                            {t("confirm")}
                                        </Button>
                                    </>
                                }
                            </div>
                        }
                    </>
                }
                <DonateButton name={nodeName} fullName={fullName} fundraisers={fundraisers ?? null}/>
            </aside>
        </OnlyDesktop>
    );
}
